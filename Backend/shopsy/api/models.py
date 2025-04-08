from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True, help_text="Name of the category")
    description = models.TextField(blank=True, help_text="Optional description of the category")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Timestamp when the category was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="Timestamp when the category was last updated")

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255, unique=True, help_text="Name of the product")
    description = models.TextField(help_text="Detailed description of the product")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price of the product")
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products", help_text="Product category"
    )
    available_sizes = models.CharField(max_length=255, help_text="Available sizes (comma-separated)")
    color = models.CharField(max_length=50, help_text="Color of the product")
    stock = models.PositiveIntegerField(default=0, help_text="Stock availability")
    image = models.ImageField(upload_to="products/", blank=True, null=True, help_text="Image of the product")
    is_active = models.BooleanField(default=True, help_text="Is the product active?")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Timestamp when the product was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="Timestamp when the product was last updated")

    def __str__(self):
        return self.name

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    city = models.CharField(max_length=100, blank=True, null=True)
    street = models.CharField(max_length=255, blank=True, null=True)
    pincode = models.CharField(max_length=20, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.username 
    
from django.db import models
from django.conf import settings

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items = models.TextField()  # JSON string of order items
    total_price = models.DecimalField(max_digits=20, decimal_places=2)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user}"



