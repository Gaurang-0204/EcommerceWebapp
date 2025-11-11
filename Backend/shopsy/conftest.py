"""
pytest configuration and global fixtures

This file is automatically discovered by pytest and provides
fixtures that can be used across all test files.
"""

import os
import sys
import django
import pytest
from decimal import Decimal

# Add project root to Python path
sys.path.insert(0, os.path.dirname(__file__))

# ✅ FIX: Use 'shopsy.settings' instead of 'config.settings.test'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shopsy.settings')

# Initialize Django
django.setup()

# Import models after Django setup
from inventory.models import Product, Inventory


# =============================================================================
# DATABASE FIXTURES
# =============================================================================

@pytest.fixture(scope='function')
def db():
    """Ensure database is available for tests"""
    pass


# =============================================================================
# MODEL FIXTURES
# =============================================================================

@pytest.fixture
def sample_product(db):
    """Create a sample product for testing"""
    product = Product.objects.create(
        name='Sample Product',
        description='A sample product for testing',
        price=Decimal('99.99'),
        color='Blue',
    )
    return product


@pytest.fixture
def sample_inventory(db, sample_product):
    """Create sample inventory linked to sample_product"""
    inventory = Inventory.objects.create(
        product=sample_product,
        quantity_available=100,
        quantity_reserved=0,
        quantity_sold=0,
        low_stock_threshold=10,
    )
    return inventory


@pytest.fixture
def multiple_products(db):
    """Create multiple products for testing"""
    products = []
    for i in range(3):
        product = Product.objects.create(
            name=f'Product {i+1}',
            description=f'Description {i+1}',
            price=Decimal(f'{(i+1)*10}.99'),
            color=['Red', 'Blue', 'Green'][i],
        )
        products.append(product)
    return products


@pytest.fixture
def out_of_stock_inventory(db, sample_product):
    """Create inventory that is out of stock"""
    inventory = Inventory.objects.create(
        product=sample_product,
        quantity_available=0,
        quantity_reserved=0,
        quantity_sold=50,
        low_stock_threshold=10,
        status='out_of_stock',
    )
    return inventory


@pytest.fixture
def low_stock_inventory(db, sample_product):
    """Create inventory with low stock"""
    inventory = Inventory.objects.create(
        product=sample_product,
        quantity_available=5,
        quantity_reserved=0,
        quantity_sold=95,
        low_stock_threshold=10,
        status='low_stock',
    )
    return inventory


# =============================================================================
# API CLIENT FIXTURES
# =============================================================================

@pytest.fixture
def api_client():
    """Django REST Framework API client"""
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def authenticated_client(api_client):
    """Authenticated API client (for future use)"""
    return api_client


# =============================================================================
# PYTEST CONFIGURATION HOOKS
# =============================================================================

def pytest_configure(config):
    """Configure pytest settings"""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "unit: marks tests as unit tests"
    )
