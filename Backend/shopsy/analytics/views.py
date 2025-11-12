from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import StreamingHttpResponse, JsonResponse
from django.utils.timezone import now
from datetime import timedelta
import json
import logging
from django.db import models


from .models import AnalyticsEvent, AnalyticsSummary, SearchAnalytics
from .services import AnalyticsService
from .serializers import AnalyticsEventSerializer, AnalyticsSummarySerializer

logger = logging.getLogger(__name__)
analytics_service = AnalyticsService()


@api_view(['POST'])
@permission_classes([AllowAny])
def track_event(request):
    """Endpoint to track analytics events"""
    try:
        event_type = request.data.get('event_type')
        event_data = request.data.get('event_data', {})
        
        user_id = request.user.id if request.user.is_authenticated else None
        
        analytics_service.track_event(
            user_id=user_id,
            event_type=event_type,
            event_data=event_data,
            request=request
        )
        
        return Response({'success': True})
    except Exception as e:
        logger.error(f'Error tracking event: {str(e)}')
        return Response(
            {'error': 'Failed to track event'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def stream_analytics(request):
    """Server-Sent Events endpoint for real-time analytics"""
    
    def event_stream():
        """Generator for SSE events"""
        try:
            last_timestamp = now() - timedelta(seconds=5)
            
            while True:
                # Fetch new events
                new_events = AnalyticsEvent.objects.filter(
                    timestamp__gte=last_timestamp
                ).values('event_type').annotate(count=models.Count('id'))
                
                if new_events.exists():
                    data = {
                        'timestamp': now().isoformat(),
                        'events': list(new_events)
                    }
                    yield f"data: {json.dumps(data)}\n\n"
                    last_timestamp = now()
                
                # Small delay to prevent CPU spinning
                import time
                time.sleep(2)
                
        except GeneratorExit:
            pass
        except Exception as e:
            logger.error(f'SSE error: {str(e)}')
    
    response = StreamingHttpResponse(
        event_stream(),
        content_type="text/event-stream"
    )
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    
    return response


class AnalyticsViewSet(viewsets.ViewSet):
    """Analytics dashboard endpoints"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get analytics dashboard data"""
        try:
            today = now().date()
            
            # Get today's summary
            summary, _ = AnalyticsSummary.objects.get_or_create(date=today)
            
            # Get last 7 days data
            week_ago = today - timedelta(days=7)
            week_data = AnalyticsSummary.objects.filter(
                date__gte=week_ago
            ).order_by('date')
            
            # Get trending searches
            trending = analytics_service.get_trending_searches()
            
            data = {
                'today': AnalyticsSummarySerializer(summary).data,
                'week': AnalyticsSummarySerializer(week_data, many=True).data,
                'trending_searches': list(trending),
            }
            
            return Response(data)
        except Exception as e:
            logger.error(f'Dashboard error: {str(e)}')
            return Response(
                {'error': 'Failed to load dashboard'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def user_behavior(self, request):
        """Get user behavior analytics"""
        behavior = analytics_service.get_user_behavior(request.user.id)
        return Response(behavior)
    
    @action(detail=False, methods=['post'])
    def track_search(self, request):
        """Track search query"""
        query = request.data.get('query')
        result_count = request.data.get('result_count', 0)
        
        analytics_service.track_search(
            query=query,
            result_count=result_count,
            user_id=request.user.id
        )
        
        return Response({'success': True})
    
    @action(detail=False, methods=['post'])
    def track_menu(self, request):
        """Track menu clicks"""
        menu_item = request.data.get('menu_item')
        
        analytics_service.track_menu_click(
            menu_item=menu_item,
            user_id=request.user.id
        )
        
        return Response({'success': True})
    
    @action(detail=False, methods=['post'])
    def track_cart_abandonment(self, request):
        """Track cart abandonment"""
        session_id = request.session.session_key or request.data.get('session_id')
        cart_value = request.data.get('cart_value', 0)
        items_count = request.data.get('items_count', 0)
        
        analytics_service.track_cart_abandonment(
            session_id=session_id,
            cart_value=cart_value,
            items_count=items_count,
            user_id=request.user.id if request.user.is_authenticated else None
        )
        
        return Response({'success': True})
