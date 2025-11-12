from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnalyticsViewSet, track_event, stream_analytics

router = DefaultRouter()
router.register('', AnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('track/', track_event, name='track_event'),
    path('stream/', stream_analytics, name='stream_analytics'),
    path('', include(router.urls)),
]
