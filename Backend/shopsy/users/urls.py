from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView, register_user, logout_user, UserViewSet
)

router = DefaultRouter()
router.register('', UserViewSet, basename='user')

urlpatterns = [
    # Authentication endpoints
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'),
    path('logout/', logout_user, name='logout'),
    
    # User profile endpoints
    path('profile/', include(router.urls)),
]
