from django.test import TestCase
from decimal import Decimal
from inventory.models import Product, Inventory, InventoryEvent
from django.core.exceptions import ValidationError
import uuid

class ProductModelTest(TestCase):
    """Test Product model"""
    
    def setUp(self):
        """Create test product"""
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price=Decimal('99.99'),
            color='Red',
        )
    
    def test_product_creation(self):
        """Test product is created successfully"""
        self.assertEqual(self.product.name, 'Test Product')
        self.assertEqual(self.product.price, Decimal('99.99'))
        self.assertIsNotNone(self.product.id)
    
    def test_product_string_representation(self):
        """Test product __str__ method"""
        self.assertEqual(str(self.product), 'Test Product')


class InventoryModelTest(TestCase):
    """Test Inventory model"""
    
    def setUp(self):
        """Create test product and inventory"""
        self.product = Product.objects.create(
            name='Laptop',
            description='Test Laptop',
            price=Decimal('999.99'),
        )
        self.inventory = Inventory.objects.create(
            product=self.product,
            quantity_available=10,
            low_stock_threshold=3,
        )
    
    def test_inventory_creation(self):
        """Test inventory is created"""
        self
