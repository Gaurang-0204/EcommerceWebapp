from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from django.http import StreamingHttpResponse
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django.db.models import Q
import json
import time

from .models import Product, Inventory, InventoryEvent, InventorySubscription
from .serializers import (
    ProductSerializer,
    InventorySerializer,
    InventoryEventSerializer,
    ProductWithInventorySerializer,
)


class StandardPagination(PageNumberPagination):
    """Standard pagination for API views"""
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Product endpoints
    
    Endpoints:
    - GET /api/v1/products/ - List all products
    - GET /api/v1/products/{id}/ - Get product details
    - GET /api/v1/products/{id}/inventory/ - Get product inventory
    """
    
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardPagination
    
    def get_queryset(self):
        """Filter and search products"""
        queryset = Product.objects.all()
        
        # Search by name or color
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(color__icontains=search)
            )
        
        return queryset
    
    def get_serializer_class(self):
        """Use ProductWithInventorySerializer for detail view"""
        if self.action == 'retrieve':
            return ProductWithInventorySerializer
        return ProductSerializer
    
    @action(detail=True, methods=['get'])
    def inventory(self, request, pk=None):
        """Get inventory for specific product"""
        product = self.get_object()
        
        try:
            inventory = product.inventory
            serializer = InventorySerializer(inventory)
            return Response(serializer.data)
        except Inventory.DoesNotExist:
            return Response(
                {'error': 'Inventory not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class InventoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Inventory endpoints
    
    Endpoints:
    - GET /api/v1/inventory/ - List all inventory
    - GET /api/v1/inventory/{id}/ - Get inventory details
    - GET /api/v1/inventory/{id}/events/ - Get inventory events
    - GET /api/v1/inventory/{id}/check-stock/ - Check stock status
    """
    
    queryset = Inventory.objects.select_related('product')
    serializer_class = InventorySerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def check_stock(self, request):
        """Check stock for multiple products"""
        product_ids = request.query_params.getlist('product_ids')
        
        if not product_ids:
            return Response(
                {'error': 'product_ids parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        inventories = Inventory.objects.filter(
            product_id__in=product_ids
        ).select_related('product')
        
        serializer = InventorySerializer(inventories, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def events(self, request, pk=None):
        """Get recent events for this inventory"""
        inventory = self.get_object()
        
        # Get last 50 events
        events = inventory.events.all()[:50]
        serializer = InventoryEventSerializer(events, many=True)
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reserve_stock(self, request, pk=None):
        """Reserve stock for an order"""
        inventory = self.get_object()
        quantity = request.data.get('quantity', 0)
        
        try:
            inventory.reserve_stock(int(quantity))
            return Response({
                'status': 'success',
                'message': f'Reserved {quantity} units',
                'inventory': InventorySerializer(inventory).data
            })
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def release_stock(self, request, pk=None):
        """Release reserved stock"""
        inventory = self.get_object()
        quantity = request.data.get('quantity', 0)
        
        try:
            inventory.release_stock(int(quantity))
            return Response({
                'status': 'success',
                'message': f'Released {quantity} units',
                'inventory': InventorySerializer(inventory).data
            })
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def confirm_sale(self, request, pk=None):
        """Confirm sale and update sold quantities"""
        inventory = self.get_object()
        quantity = request.data.get('quantity', 0)
        
        try:
            inventory.confirm_sale(int(quantity))
            return Response({
                'status': 'success',
                'message': f'Confirmed sale of {quantity} units',
                'inventory': InventorySerializer(inventory).data
            })
        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


# ============================================================================
# SERVER-SENT EVENTS ENDPOINT (Real-Time Inventory Updates)
# ============================================================================

def event_stream(request):
    """
    Server-Sent Events stream for real-time inventory updates
    
    Usage:
    - /api/v1/events/inventory/ - All inventory changes
    - /api/v1/events/inventory/?product_id=123 - Specific product changes
    
    Connect from frontend:
    const eventSource = new EventSource('/api/v1/events/inventory/?product_id=123');
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Inventory updated:', data);
    };
    """
    
    # Get product_id from query params (optional)
    product_id = request.GET.get('product_id', None)
    
    # Create session ID for subscription tracking
    session_id = request.session.session_key or request.GET.get('session_id', 'anonymous')
    
    def generate_events():
        """Generator function for SSE"""
        
        # Register subscription
        try:
            subscription = InventorySubscription.objects.create(
                session_id=session_id,
                product_id=product_id,
            )
        except:
            subscription = None
        
        try:
            # Send initial connection message
            yield 'data: {"type": "connection", "status": "connected"}\n\n'
            
            # Send recent events as initial batch
            if product_id:
                recent_events = InventoryEvent.objects.filter(
                    inventory__product_id=product_id
                ).order_by('-created_at')[:10]
            else:
                recent_events = InventoryEvent.objects.order_by('-created_at')[:20]
            
            for event in reversed(recent_events):
                yield serialize_event(event)
            
            # Long-poll for new events
            last_event_id = recent_events.last().id if recent_events.exists() else 0
            
            while True:
                # Query for new events since last check
                if product_id:
                    new_events = InventoryEvent.objects.filter(
                        inventory__product_id=product_id,
                        id__gt=last_event_id
                    ).order_by('created_at')
                else:
                    new_events = InventoryEvent.objects.filter(
                        id__gt=last_event_id
                    ).order_by('created_at')
                
                # Yield new events
                for event in new_events:
                    yield serialize_event(event)
                    last_event_id = event.id
                
                # Update subscription
                if subscription:
                    subscription.last_event_id = str(last_event_id)
                    subscription.save()
                
                # Sleep before next check (adjustable polling interval)
                time.sleep(1)
        
        except GeneratorExit:
            # Client disconnected
            if subscription:
                subscription.delete()
        except Exception as e:
            yield f'data: {{"type": "error", "message": "{str(e)}"}}\n\n'

    return generate_events()


def serialize_event(event):
    """Serialize InventoryEvent to SSE format"""
    serializer = InventoryEventSerializer(event)
    data = json.dumps(serializer.data)
    return f'data: {data}\n\n'

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
@csrf_exempt  # For simplicity in development
@require_http_methods(["GET"])
def inventory_events_view(request):
    """View for SSE endpoint"""
    response = StreamingHttpResponse(
        event_stream(request),
        content_type='text/event-stream'
    )
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'  # Disable Nginx buffering
    return response


# ============================================================================
# WEBHOOK/POLLING ENDPOINT (for clients that don't support SSE)
# ============================================================================

@api_view(['GET'])
def inventory_changes_poll(request):
    """
    Polling endpoint for clients without SSE support
    
    Returns events created since 'since' timestamp
    
    Usage:
    GET /api/v1/inventory/changes/?since=2024-01-01T00:00:00Z&product_id=123
    """
    
    since = request.query_params.get('since', None)
    product_id = request.query_params.get('product_id', None)
    
    if not since:
        # Default to last 10 seconds if not provided
        from django.utils import timezone
        from datetime import timedelta
        since_dt = timezone.now() - timedelta(seconds=10)
    else:
        try:
            from django.utils.dateparse import parse_datetime
            from django.utils import timezone
            import dateutil.parser
            
            # Try Django's parser first
            since_dt = parse_datetime(since)
            
            # ✅ FIX: If Django's parser fails, use python-dateutil
            if since_dt is None:
                since_dt = dateutil.parser.parse(since)
            
            # Make timezone-aware if naive
            if since_dt and timezone.is_naive(since_dt):
                since_dt = timezone.make_aware(since_dt)
            
            # ✅ IMPORTANT: Check if we got a valid datetime
            if since_dt is None:
                return Response(
                    {'error': 'Invalid datetime format. Use ISO format (e.g., 2024-01-01T00:00:00Z)'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            return Response(
                {'error': f'Datetime parsing error: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    try:
        # Query events
        if product_id:
            events = InventoryEvent.objects.filter(
                created_at__gte=since_dt,
                inventory__product_id=product_id
            )
        else:
            events = InventoryEvent.objects.filter(created_at__gte=since_dt)
        
        serializer = InventoryEventSerializer(events, many=True)
        return Response({
            'count': events.count(),
            'events': serializer.data
        })
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


