from django.test import TestCase

# Create your tests here.
"""
Comprehensive analytics tests for event tracking, search, menu,
and cart abandonment analytics.
"""

import pytest
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    AnalyticsEvent, SearchAnalytics, MenuAnalytics, CartAbandonmentEvent
)
from analytics.services import AnalyticsService
from django.utils.timezone import now
from datetime import timedelta

User = get_user_model()


class AnalyticsEventTrackingTests(APITestCase):
    """Test analytics event tracking"""
    
    def setUp(self):
        self.client = APIClient()
        self.track_url = '/api/analytics/track/'
        
        self.user = User.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='testpass123'
        )
        
        self.token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_track_page_view(self):
        """Test page view event tracking"""
        data = {
            'event_type': 'page_view',
            'event_data': {'page': '/home'}
        }
        
        response = self.client.post(self.track_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            AnalyticsEvent.objects.filter(event_type='page_view').exists()
        )
    
    def test_track_product_view(self):
        """Test product view event tracking"""
        data = {
            'event_type': 'product_view',
            'event_data': {'productId': 123, 'productName': 'Test Product'}
        }
        
        response = self.client.post(self.track_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        event = AnalyticsEvent.objects.get(event_type='product_view')
        self.assertEqual(event.event_data['productId'], 123)
    
    def test_track_add_to_cart(self):
        """Test add to cart event tracking"""
        data = {
            'event_type': 'add_to_cart',
            'event_data': {'productId': 123, 'quantity': 2, 'price': 29.99}
        }
        
        response = self.client.post(self.track_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        event = AnalyticsEvent.objects.get(event_type='add_to_cart')
        self.assertEqual(event.event_data['quantity'], 2)
    
    def test_track_without_authentication(self):
        """Test event tracking without authentication (anonymous user)"""
        self.client.credentials()  # Clear credentials
        
        data = {
            'event_type': 'page_view',
            'event_data': {'page': '/home'}
        }
        
        response = self.client.post(self.track_url, data, format='json')
        
        # Should still work for anonymous users
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_event_data_stored_correctly(self):
        """Test that event data is stored correctly"""
        data = {
            'event_type': 'search_query',
            'event_data': {'query': 'test product', 'resultCount': 42}
        }
        
        response = self.client.post(self.track_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        event = AnalyticsEvent.objects.get(event_type='search_query')
        self.assertEqual(event.event_data['query'], 'test product')
        self.assertEqual(event.event_data['resultCount'], 42)


class SearchAnalyticsTests(APITestCase):
    """Test search analytics tracking"""
    
    def setUp(self):
        self.client = APIClient()
        self.track_search_url = '/api/analytics/track_search/'
        
        self.user = User.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='testpass123'
        )
        
        self.token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_track_search_query(self):
        """Test tracking search queries"""
        data = {
            'query': 'laptop',
            'result_count': 15
        }
        
        response = self.client.post(self.track_search_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            SearchAnalytics.objects.filter(query='laptop').exists()
        )
    
    def test_get_trending_searches(self):
        """Test getting trending searches"""
        # Create multiple search entries
        for i in range(5):
            SearchAnalytics.objects.create(
                query='laptop',
                result_count=10,
                user=self.user
            )
        
        for i in range(3):
            SearchAnalytics.objects.create(
                query='phone',
                result_count=20,
                user=self.user
            )
        
        trending = AnalyticsService.get_trending_searches()
        
        self.assertGreater(len(list(trending)), 0)
        self.assertEqual(trending[0]['query'], 'laptop')


class MenuAnalyticsTests(APITestCase):
    """Test menu click analytics"""
    
    def setUp(self):
        self.client = APIClient()
        self.track_menu_url = '/api/analytics/track_menu/'
        
        self.user = User.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='testpass123'
        )
        
        self.token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_track_menu_click(self):
        """Test tracking menu clicks"""
        data = {'menu_item': 'Home'}
        
        response = self.client.post(self.track_menu_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            MenuAnalytics.objects.filter(menu_item='Home').exists()
        )
    
    def test_menu_click_count_increments(self):
        """Test that click count increments for same menu item"""
        # Create initial entry
        MenuAnalytics.objects.create(
            user=self.user,
            menu_item='Profile',
            click_count=1
        )
        
        # Track another click
        AnalyticsService.track_menu_click('Profile', self.user.id)
        
        menu = MenuAnalytics.objects.get(user=self.user, menu_item='Profile')
        self.assertEqual(menu.click_count, 2)


class CartAbandonmentTests(APITestCase):
    """Test cart abandonment tracking"""
    
    def setUp(self):
        self.client = APIClient()
        self.track_abandonment_url = '/api/analytics/track_cart_abandonment/'
        
        self.user = User.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='testpass123'
        )
        
        self.token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_track_cart_abandonment(self):
        """Test tracking cart abandonment"""
        data = {
            'session_id': 'session123',
            'cart_value': 99.99,
            'items_count': 3
        }
        
        response = self.client.post(self.track_abandonment_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            CartAbandonmentEvent.objects.filter(
                cart_value=99.99
            ).exists()
        )
    
    def test_abandoned_cart_data_stored(self):
        """Test that abandoned cart data is stored correctly"""
        data = {
            'session_id': 'session123',
            'cart_value': 50.00,
            'items_count': 2
        }
        
        response = self.client.post(self.track_abandonment_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        event = CartAbandonmentEvent.objects.get(session_id='session123')
        self.assertEqual(event.cart_value, 50.00)
        self.assertEqual(event.items_count, 2)


class AnalyticsDashboardTests(APITestCase):
    """Test analytics dashboard endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.dashboard_url = '/api/analytics/dashboard/'
        
        self.user = User.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='testpass123'
        )
        
        self.token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_get_dashboard_data(self):
        """Test getting dashboard analytics data"""
        # Create some events
        for i in range(5):
            AnalyticsEvent.objects.create(
                user=self.user,
                event_type='page_view',
                ip_address='127.0.0.1'
            )
        
        response = self.client.get(self.dashboard_url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('today', response.data)
        self.assertIn('week', response.data)
        self.assertIn('trending_searches', response.data)
