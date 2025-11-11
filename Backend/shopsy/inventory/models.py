from django.db import models

# Create your models here.
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.core.cache import cache
import uuid

class Product(models.Model):
    """Product model with inventory tracking"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    color = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Inventory(models.Model):
    """Real-time inventory tracking"""
    
    STOCK_STATUS_CHOICES = (
        ('in_stock', 'In Stock'),
        ('low_stock', 'Low Stock'),
        ('out_of_stock', 'Out of Stock'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='inventory')
    
    # Stock quantities
    quantity_available = models.IntegerField(default=0)
    quantity_reserved = models.IntegerField(default=0)
    quantity_sold = models.IntegerField(default=0)
    
    # Low stock threshold
    low_stock_threshold = models.IntegerField(default=10)
    
    # Metadata
    status = models.CharField(max_length=20, choices=STOCK_STATUS_CHOICES, default='in_stock')
    last_updated = models.DateTimeField(auto_now=True)

    # ✅ ADD THIS: Store original values
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_quantity_available = self.quantity_available
        self._original_status = self.status
    
    class Meta:
        verbose_name_plural = 'Inventories'
    
    def __str__(self):
        return f"{self.product.name} - {self.quantity_available}"
    
    @property
    def quantity_total(self):
        """Total quantity (available + reserved)"""
        return self.quantity_available + self.quantity_reserved
    
    @property
    def is_out_of_stock(self):
        """Check if product is out of stock"""
        return self.quantity_available <= 0
    
    @property
    def is_low_stock(self):
        """Check if product is low stock"""
        return (0 < self.quantity_available <= self.low_stock_threshold) and not self.is_out_of_stock
    
    def update_status(self):
        """Update stock status based on quantities"""
        if self.is_out_of_stock:
            self.status = 'out_of_stock'
        elif self.is_low_stock:
            self.status = 'low_stock'
        else:
            self.status = 'in_stock'
        self.save()
    
    def reserve_stock(self, quantity):
        """Reserve stock for an order"""
        if quantity > self.quantity_available:
            raise ValueError(f"Cannot reserve {quantity} units. Only {self.quantity_available} available.")
        
        self.quantity_available -= quantity
        self.quantity_reserved += quantity
        self.update_status()
        self.save()
        return True
    
    def release_stock(self, quantity):
        """Release reserved stock"""
        if quantity > self.quantity_reserved:
            raise ValueError(f"Cannot release {quantity} units. Only {self.quantity_reserved} reserved.")
        
        self.quantity_reserved -= quantity
        self.quantity_available += quantity
        self.update_status()
        self.save()
        return True
    
    def confirm_sale(self, quantity):
        """Confirm sale and update sold quantity"""
        if quantity > self.quantity_reserved:
            raise ValueError(f"Cannot confirm {quantity} units. Only {self.quantity_reserved} reserved.")
        
        self.quantity_reserved -= quantity
        self.quantity_sold += quantity
        self.update_status()
        self.save()
        return True


class InventoryEvent(models.Model):
    """Event log for real-time inventory updates"""
    
    EVENT_TYPES = (
        ('stock_updated', 'Stock Updated'),
        ('low_stock_warning', 'Low Stock Warning'),
        ('out_of_stock', 'Out of Stock'),
        ('back_in_stock', 'Back in Stock'),
        ('stock_reserved', 'Stock Reserved'),
        ('stock_released', 'Stock Released'),
        ('sale_confirmed', 'Sale Confirmed'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    
    # Event metadata
    previous_quantity = models.IntegerField()
    new_quantity = models.IntegerField()
    quantity_changed = models.IntegerField()
    
    # Additional data as JSON
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['inventory', '-created_at']),
            models.Index(fields=['event_type', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.inventory.product.name} - {self.event_type}"


class InventorySubscription(models.Model):
    """Track SSE connections for real-time updates"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_id = models.CharField(max_length=255)
    product_id = models.CharField(max_length=255, null=True, blank=True)  # None = all products
    
    subscribed_at = models.DateTimeField(auto_now_add=True)
    last_event_id = models.CharField(max_length=50, default='0')
    
    class Meta:
        indexes = [
            models.Index(fields=['session_id', 'product_id']),
        ]
    
    def __str__(self):
        return f"Subscription: {self.session_id}"


# ============================================================================
# SIGNALS FOR AUTOMATIC EVENT CREATION
# ============================================================================

# ✅ FIXED SIGNAL
@receiver(post_save, sender=Inventory)
def create_inventory_event(sender, instance, created, **kwargs):
    """Automatically create events when inventory changes"""
    
    # Skip for new instances
    if created:
        return
    
    # Get the original quantity from instance
    original_quantity = getattr(instance, '_original_quantity_available', instance.quantity_available)
    
    # Check if quantity changed
    if original_quantity != instance.quantity_available:
        
        event_type = 'stock_updated'
        
        # Determine specific event type based on status transitions
        was_out_of_stock = original_quantity <= 0
        is_out_of_stock_now = instance.quantity_available <= 0
        
        was_low_stock = 0 < original_quantity <= instance.low_stock_threshold
        is_low_stock_now = 0 < instance.quantity_available <= instance.low_stock_threshold
        
        if is_out_of_stock_now and not was_out_of_stock:
            event_type = 'out_of_stock'
        elif not is_out_of_stock_now and was_out_of_stock:
            event_type = 'back_in_stock'
        elif is_low_stock_now and not was_low_stock:
            event_type = 'low_stock_warning'
        
        # Create event
        InventoryEvent.objects.create(
            inventory=instance,
            event_type=event_type,
            previous_quantity=original_quantity,
            new_quantity=instance.quantity_available,
            quantity_changed=instance.quantity_available - original_quantity,
        )
        
        # Update the stored original value for next save
        instance._original_quantity_available = instance.quantity_available
        
        # Clear cache
        cache.delete(f'inventory_{instance.product_id}')
        
        # Broadcast to connected clients
        broadcast_inventory_update(instance)


def broadcast_inventory_update(inventory_instance):
    """Broadcast inventory update to all connected SSE clients"""
    # We'll implement this in the service layer
    pass

