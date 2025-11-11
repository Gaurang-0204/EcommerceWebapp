from django.test import TestCase, Client
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
import json
from inventory.models import Product, Inventory

class ProductViewSetTest(APITestCase):
    """Test Product API endpoints"""
    
    def setUp(self):
        """Create test data"""
        self.client = APIClient()
        self.product = Product.objects.create(
            name='Test Laptop',
            description='A test laptop',
            price=Decimal('999.99'),
            color='Silver',
        )
        self.inventory = Inventory.objects.create(
            product=self.product,
            quantity_available=15,
        )
    
    def test_list_products(self):
        """Test GET /api/v1/products/"""
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
    
    def test_get_product_detail(self):
        """Test GET /api/v1/products/{id}/"""
        response = self.client.get(f'/api/v1/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Laptop')
        self.assertIn('inventory', response.data)
    
    def test_search_products(self):
        """Test search functionality"""
        response = self.client.get('/api/v1/products/?search=Laptop')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_product_inventory(self):
        """Test GET /api/v1/products/{id}/inventory/"""
        response = self.client.get(f'/api/v1/products/{self.product.id}/inventory/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['quantity_available'], 15)
        self.assertEqual(response.data['status'], 'in_stock')


class InventoryViewSetTest(APITestCase):
    """Test Inventory API endpoints"""
    
    def setUp(self):
        """Create test data"""
        self.client = APIClient()
        self.product = Product.objects.create(
            name='Mouse',
            price=Decimal('29.99'),
        )
        self.inventory = Inventory.objects.create(
            product=self.product,
            quantity_available=50,
            low_stock_threshold=5,
        )
    
    def test_check_stock_single(self):
        """Test stock check for single product"""
        response = self.client.get(
            f'/api/v1/inventory/check_stock/?product_ids={self.product.id}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['quantity_available'], 50)
    
    def test_reserve_stock_success(self):
        """Test POST /api/v1/inventory/{id}/reserve_stock/"""
        response = self.client.post(
            f'/api/v1/inventory/{self.inventory.id}/reserve_stock/',
            {'quantity': 10}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        
        # Verify inventory updated
        self.inventory.refresh_from_db()
        self.assertEqual(self.inventory.quantity_available, 40)
        self.assertEqual(self.inventory.quantity_reserved, 10)
    
    def test_reserve_stock_insufficient(self):
        """Test reserve with insufficient stock"""
        response = self.client.post(
            f'/api/v1/inventory/{self.inventory.id}/reserve_stock/',
            {'quantity': 100}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_release_stock(self):
        """Test POST /api/v1/inventory/{id}/release_stock/"""
        # First reserve
        self.inventory.reserve_stock(20)
        
        # Then release
        response = self.client.post(
            f'/api/v1/inventory/{self.inventory.id}/release_stock/',
            {'quantity': 10}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.inventory.refresh_from_db()
        self.assertEqual(self.inventory.quantity_available, 40)
        self.assertEqual(self.inventory.quantity_reserved, 10)
    
    def test_confirm_sale(self):
        """Test POST /api/v1/inventory/{id}/confirm_sale/"""
        # First reserve
        self.inventory.reserve_stock(15)
        
        # Then confirm
        response = self.client.post(
            f'/api/v1/inventory/{self.inventory.id}/confirm_sale/',
            {'quantity': 15}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.inventory.refresh_from_db()
        self.assertEqual(self.inventory.quantity_reserved, 0)
        self.assertEqual(self.inventory.quantity_sold, 15)
    
    def test_get_inventory_events(self):
        """Test GET /api/v1/inventory/{id}/events/"""
        response = self.client.get(f'/api/v1/inventory/{self.inventory.id}/events/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)


class SSEStreamTest(APITestCase):
    """Test Server-Sent Events endpoint"""
    
    def setUp(self):
        """Create test data"""
        self.client = APIClient()
        self.product = Product.objects.create(
            name='Test Product',
            price=Decimal('50.00'),
        )
        self.inventory = Inventory.objects.create(
            product=self.product,
            quantity_available=10,
        )
    
    def test_sse_stream_connection(self):
        """Test SSE stream endpoint"""
        response = self.client.get('/api/v1/events/inventory/')
        # SSE returns 200 with streaming content
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/event-stream')
    
    def test_sse_with_product_filter(self):
        """Test SSE stream with product_id filter"""
        response = self.client.get(
            f'/api/v1/events/inventory/?product_id={self.product.id}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_polling_endpoint(self):
        """Test polling endpoint"""
        from django.utils import timezone
        since = timezone.now().isoformat()
        
        response = self.client.get(
            f'/api/v1/polling/inventory/changes/?since={since}&product_id={self.product.id}'
        )

        if response.status_code != status.HTTP_200_OK:
            print(f"\n❌ Status Code: {response.status_code}")
            print(f"❌ Response Data: {response.data}")
            print(f"❌ Since parameter: {since}")
            
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('events', response.data)
