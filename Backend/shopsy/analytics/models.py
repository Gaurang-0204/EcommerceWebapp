from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import JSONField as PostgresJSONField

User = get_user_model()


class AnalyticsEvent(models.Model):
    """Track all user interactions and events"""
    
    EVENT_TYPES = [
        ('user_login', 'User Login'),
        ('user_logout', 'User Logout'),
        ('user_registered', 'User Registered'),
        ('profile_updated', 'Profile Updated'),
        ('password_changed', 'Password Changed'),
        ('cart_view', 'Cart Viewed'),
        ('product_view', 'Product Viewed'),
        ('product_click', 'Product Clicked'),
        ('search_query', 'Search Query'),
        ('add_to_cart', 'Add to Cart'),
        ('remove_from_cart', 'Remove from Cart'),
        ('checkout_started', 'Checkout Started'),
        ('checkout_completed', 'Checkout Completed'),
        ('menu_click', 'Menu Clicked'),
        ('page_view', 'Page Viewed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analytics_events', null=True, blank=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES, db_index=True)
    event_data = models.JSONField(default=dict, blank=True)
    page_url = models.URLField(blank=True)
    referrer = models.URLField(blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    session_id = models.CharField(max_length=255, blank=True, db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['event_type', '-timestamp']),
            models.Index(fields=['session_id', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.event_type} - {self.user or 'Anonymous'} - {self.timestamp}"


class AnalyticsSummary(models.Model):
    """Daily analytics summary (computed from events)"""
    date = models.DateField(db_index=True, unique=True)
    total_users = models.IntegerField(default=0)
    total_events = models.IntegerField(default=0)
    unique_sessions = models.IntegerField(default=0)
    page_views = models.IntegerField(default=0)
    user_logins = models.IntegerField(default=0)
    user_registrations = models.IntegerField(default=0)
    products_viewed = models.IntegerField(default=0)
    products_added_to_cart = models.IntegerField(default=0)
    checkouts_completed = models.IntegerField(default=0)
    cart_abandonment_rate = models.FloatField(default=0.0)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"Analytics - {self.date}"


class SearchAnalytics(models.Model):
    """Track search queries"""
    query = models.CharField(max_length=255, db_index=True)
    result_count = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['query', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.query} - {self.result_count} results"


class MenuAnalytics(models.Model):
    """Track menu navigation patterns"""
    menu_item = models.CharField(max_length=255, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    click_count = models.IntegerField(default=1)
    last_clicked = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'menu_item']
    
    def __str__(self):
        return f"{self.menu_item} - {self.click_count} clicks"


class CartAbandonmentEvent(models.Model):
    """Track cart abandonment"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=255, db_index=True)
    cart_value = models.DecimalField(max_digits=10, decimal_places=2)
    items_count = models.IntegerField(default=0)
    abandoned_at = models.DateTimeField(auto_now_add=True, db_index=True)
    recovered = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-abandoned_at']
    
    def __str__(self):
        return f"Abandoned cart - {self.cart_value}"
