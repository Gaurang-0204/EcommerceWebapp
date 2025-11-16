from django.utils.timezone import now
from django.db.models import Count
from datetime import timedelta
import logging

from .models import (
    AnalyticsEvent, AnalyticsSummary, SearchAnalytics,
    MenuAnalytics, CartAbandonmentEvent
)

logger = logging.getLogger(__name__)


class AnalyticsService:
    """Service for handling analytics operations"""
    
    @staticmethod
    def track_event(user_id=None, event_type=None, event_data=None, request=None):
        """Track an analytics event"""
        try:
            if not event_type:
                return False
            
            ip_address = AnalyticsService.get_client_ip(request) if request else '0.0.0.0'
            user_agent = request.META.get('HTTP_USER_AGENT', '') if request else ''
            page_url = request.build_absolute_uri() if request else ''
            referrer = request.META.get('HTTP_REFERER', '') if request else ''
            # FIX 1: Ensure session_id is never empty
            session_id = ''
            if request and hasattr(request, 'session'):
                session_id = request.session.session_key or ''
            
            # Set default if empty or None
            if not session_id:
                session_id = 'unknown'
            
            event = AnalyticsEvent.objects.create(
                user_id=user_id,
                event_type=event_type,
                event_data=event_data or {},
                page_url=page_url,
                referrer=referrer,
                ip_address=ip_address,
                user_agent=user_agent,
                session_id=session_id
            )
            
            return True
            
        except Exception as e:
            logger.error(f'Error tracking event: {str(e)}')
            return False
    
    @staticmethod
    def track_search(query, result_count, user_id=None):
        """Track search query"""
        try:
            SearchAnalytics.objects.create(
                query=query,
                result_count=result_count,
                user_id=user_id
            )
            return True
        except Exception as e:
            logger.error(f'Error tracking search: {str(e)}')
            return False
    
    @staticmethod
    def track_menu_click(menu_item, user_id=None):
        """Track menu clicks"""
        try:
            obj, created = MenuAnalytics.objects.get_or_create(
                user_id=user_id,
                menu_item=menu_item
            )
            if not created:
                obj.click_count += 1
                obj.save()
            return True
        except Exception as e:
            logger.error(f'Error tracking menu click: {str(e)}')
            return False
    
    @staticmethod
    def track_cart_abandonment(session_id, cart_value, items_count, user_id=None):
        """Track abandoned cart"""
        try:
            CartAbandonmentEvent.objects.create(
                user_id=user_id,
                session_id=session_id,
                cart_value=cart_value,
                items_count=items_count
            )
            return True
        except Exception as e:
            logger.error(f'Error tracking cart abandonment: {str(e)}')
            return False
    
    @staticmethod
    def generate_daily_summary(date=None):
        """Generate daily analytics summary"""
        try:
            if not date:
                date = now().date()
            
            start_of_day = now().replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = start_of_day + timedelta(days=1)
            
            events = AnalyticsEvent.objects.filter(
                timestamp__gte=start_of_day,
                timestamp__lt=end_of_day
            )
            
            summary_data = {
                'total_events': events.count(),
                'total_users': events.filter(user__isnull=False).values('user').distinct().count(),
                'unique_sessions': events.values('session_id').distinct().count(),
                'page_views': events.filter(event_type='page_view').count(),
                'user_logins': events.filter(event_type='user_login').count(),
                'user_registrations': events.filter(event_type='user_registered').count(),
                'products_viewed': events.filter(event_type='product_view').count(),
                'products_added_to_cart': events.filter(event_type='add_to_cart').count(),
                'checkouts_completed': events.filter(event_type='checkout_completed').count(),
            }
            
            # Calculate cart abandonment rate
            total_carts = events.filter(event_type__in=['cart_view', 'add_to_cart']).count()
            completed_checkouts = summary_data['checkouts_completed']
            summary_data['cart_abandonment_rate'] = (
                ((total_carts - completed_checkouts) / total_carts * 100)
                if total_carts > 0 else 0
            )
            
            summary, created = AnalyticsSummary.objects.get_or_create(
                date=date,
                defaults=summary_data
            )
            
            if not created:
                for key, value in summary_data.items():
                    setattr(summary, key, value)
                summary.save()
            
            return summary
            
        except Exception as e:
            logger.error(f'Error generating daily summary: {str(e)}')
            return None
    
    @staticmethod
    def get_trending_searches(days=7, limit=10):
        """Get trending search queries"""
        try:
            cutoff_date = now() - timedelta(days=days)
            
            trending = SearchAnalytics.objects.filter(
                timestamp__gte=cutoff_date
            ).values('query').annotate(
                count=Count('id')
            ).order_by('-count')[:limit]
            
            return trending
        except Exception as e:
            logger.error(f'Error getting trending searches: {str(e)}')
            return []
    
    @staticmethod
    def get_user_behavior(user_id, days=30):
        """Get user behavior analytics"""
        try:
            cutoff_date = now() - timedelta(days=days)
            
            events = AnalyticsEvent.objects.filter(
                user_id=user_id,
                timestamp__gte=cutoff_date
            )
            
            behavior = {
                'total_events': events.count(),
                'page_views': events.filter(event_type='page_view').count(),
                'products_viewed': events.filter(event_type='product_view').count(),
                'products_added': events.filter(event_type='add_to_cart').count(),
                'checkouts': events.filter(event_type='checkout_completed').count(),
                'last_activity': events.latest('timestamp').timestamp if events.exists() else None,
            }
            
            return behavior
        except Exception as e:
            logger.error(f'Error getting user behavior: {str(e)}')
            return {}
    
    @staticmethod
    def get_client_ip(request):
        """Extract client IP"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # ✅ FIX: Get first IP and strip whitespace
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
