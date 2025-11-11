from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'inventory', views.InventoryViewSet, basename='inventory')

urlpatterns = [
    
    
    # Real-time inventory events (SSE)
    path('events/inventory/', views.inventory_events_view, name='inventory-events'),
    
    # Polling endpoint (for SSE fallback)
    path('polling/inventory/changes/', views.inventory_changes_poll, name='inventory-changes'),

    path('', include(router.urls)),
]
