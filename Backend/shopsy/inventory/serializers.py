from rest_framework import serializers
from .models import Product, Inventory, InventoryEvent

class ProductSerializer(serializers.ModelSerializer):
    """Serialize Product model"""
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'color', 'created_at']
        read_only_fields = ['id', 'created_at']


class InventorySerializer(serializers.ModelSerializer):
    """Serialize Inventory model"""
    
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(
        source='product.price',
        read_only=True,
        max_digits=10,
        decimal_places=2
    )
    
    class Meta:
        model = Inventory
        fields = [
            'id',
            'product_name',
            'product_price',
            'quantity_available',
            'quantity_reserved',
            'quantity_sold',
            'quantity_total',
            'status',
            'is_out_of_stock',
            'is_low_stock',
            'low_stock_threshold',
            'last_updated',
        ]
        read_only_fields = [
            'id',
            'quantity_sold',
            'quantity_total',
            'status',
            'is_out_of_stock',
            'is_low_stock',
            'last_updated',
        ]


class InventoryEventSerializer(serializers.ModelSerializer):
    """Serialize Inventory Event model"""
    
    product_name = serializers.CharField(source='inventory.product.name', read_only=True)
    
    class Meta:
        model = InventoryEvent
        fields = [
            'id',
            'product_name',
            'event_type',
            'previous_quantity',
            'new_quantity',
            'quantity_changed',
            'metadata',
            'created_at',
        ]
        read_only_fields = fields


class ProductWithInventorySerializer(serializers.ModelSerializer):
    """Combine Product and Inventory data"""
    
    inventory = InventorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'color', 'inventory', 'created_at']
