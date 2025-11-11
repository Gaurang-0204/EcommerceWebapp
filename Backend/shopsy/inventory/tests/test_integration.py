from django.test import TestCase
from rest_framework.test import APIClient
from decimal import Decimal
from inventory.models import Product, Inventory, InventoryEvent
import json

class InventoryWorkflowTest(TestCase):
    """Test complete inventory workflows"""
    
    def setUp(self):
        """Setup test data"""
        self.client = APIClient()
        self.product = Product.objects.create(
            name='E-Reader',
            description='Digital reading device',
            price=Decimal('149.99'),
            color='Black',
        )
        self.inventory = Inventory.objects.create(
            product=self.product,
            quantity_available=20,
            low_stock_threshold=5,
        )
    
    def test_complete_order_workflow(self):
        """Test complete order workflow: reserve -> confirm -> release"""
        # Step 1: Reserve stock
        self.inventory.reserve_stock(10)
        self.assertEqual(self.inventory.quantity_available, 10)
        self.assertEqual(self.inventory.quantity_reserved, 10)
        
        # Step 2: Check low stock status
        self.inventory.quantity_available = 4
        self.inventory.update_status()
        self.assertTrue(self.inventory.is_low_stock)
        
        # Step 3: Release half
        self.inventory.release_stock(5)
        self.assertEqual(self.inventory.quantity_available, 9)
        self.assertEqual(self.inventory.quantity_reserved, 5)
        
        # Step 4: Confirm sale
        self.inventory.confirm_sale(5)
        self.assertEqual(self.inventory.quantity_sold, 5)
        self.assertEqual(self.inventory.quantity_reserved, 0)
    
    def test_out_of_stock_workflow(self):
        """Test stock going out and coming back in"""
        # Go out of stock
        self.inventory.quantity_available = 0
        self.inventory.update_status()
        self.assertEqual(self.inventory.status, 'out_of_stock')
        
        # Restock
        self.inventory.quantity_available = 15
        self.inventory.update_status()
        self.assertEqual(self.inventory.status, 'in_stock')
    
    def test_event_creation_on_status_change(self):
        """Test that events are created when status changes"""
        initial_event_count = InventoryEvent.objects.count()
        
        # Trigger status change
        self.inventory.quantity_available = 0
        self.inventory.save()
        
        # Should have new event
        new_event_count = InventoryEvent.objects.count()
        self.assertGreater(new_event_count, initial_event_count)
    
    def test_api_reserve_then_release(self):
        """Test reserve then release via API"""
        # Reserve via API
        response = self.client.post(
            f'/api/v1/inventory/{self.inventory.id}/reserve_stock/',
            {'quantity': 5}
        )
        self.assertEqual(response.status_code, 200)
        
        self.inventory.refresh_from_db()
        self.assertEqual(self.inventory.quantity_reserved, 5)
        
        # Release via API
        response = self.client.post(
            f'/api/v1/inventory/{self.inventory.id}/release_stock/',
            {'quantity': 5}
        )
        self.assertEqual(response.status_code, 200)
        
        self.inventory.refresh_from_db()
        self.assertEqual(self.inventory.quantity_reserved, 0)
