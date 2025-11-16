from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from django.db.models import Q
import logging
import hashlib

from .models import UserSession, LoginAttempt
from .serializers import (
    CustomTokenObtainPairSerializer, UserRegistrationSerializer,
    UserDetailSerializer, UserUpdateSerializer, PasswordChangeSerializer
)
from analytics.services import AnalyticsService

User = get_user_model()
logger = logging.getLogger(__name__)
analytics = AnalyticsService()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login endpoint with analytics tracking"""
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email') or request.data.get('username')
        
        try:
            # Track login attempt
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                # Successful login
                user = User.objects.get(Q(email=email) | Q(username=email))
                
                # Log successful login
                LoginAttempt.objects.create(
                    email=user.email,
                    success=True,
                    ip_address=ip_address
                )
                
                # Create session record
                access_token = response.data.get('access')
                # ✅ FIX: Hash the token to create a unique identifier
                token_hash = hashlib.sha256(access_token.encode()).hexdigest()[:50]

                # ✅ FIX: Use get_or_create or update existing session
                session, created = UserSession.objects.update_or_create(
                    user=user,
                    token=token_hash,
                    defaults={
                        'ip_address': ip_address,
                        'user_agent': user_agent,
                        'is_active': True,
                    }
                )
                
                # Track analytics
                analytics.track_event(
                    user_id=user.id,
                    event_type='user_login',
                    event_data={'ip': ip_address},
                    request=request
                )
                
                logger.info(f'User {user.email} logged in from {ip_address}')
            else:
                # Failed login
                if email:
                    LoginAttempt.objects.create(
                        email=email,
                        success=False,
                        ip_address=ip_address
                    )
            
            return response
            
        except Exception as e:
            logger.error(f'Login error: {str(e)}')
            return Response(
                {'error': 'Login failed'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @staticmethod
    def get_client_ip(request):
        """Extract client IP from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Track analytics
        analytics.track_event(
            user_id=user.id,
            event_type='user_registered',
            request=request
        )
        
        logger.info(f'New user registered: {user.email}')
        
        return Response(
            {
                'message': 'User registered successfully',
                'user': UserDetailSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """User logout endpoint"""
    try:
        user = request.user
        
        # Remove user sessions
        UserSession.objects.filter(user=user).update(is_active=False)
        
        # Track analytics
        analytics.track_event(
            user_id=user.id,
            event_type='user_logout',
            request=request
        )
        
        logger.info(f'User {user.email} logged out')
        
        return Response(
            {'message': 'Logged out successfully'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        logger.error(f'Logout error: {str(e)}')
        return Response(
            {'error': 'Logout failed'},
            status=status.HTTP_400_BAD_REQUEST
        )


class UserViewSet(viewsets.ViewSet):
    """User profile management endpoints"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update user profile"""
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            # Track analytics
            analytics.track_event(
                user_id=request.user.id,
                event_type='profile_updated',
                request=request
            )
            
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password"""
        serializer = PasswordChangeSerializer(data=request.data)
        
        if serializer.is_valid():
            user = request.user
            
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {'old_password': 'Incorrect password'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            # Track analytics
            analytics.track_event(
                user_id=user.id,
                event_type='password_changed',
                request=request
            )
            
            return Response({'message': 'Password changed successfully'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def sessions(self, request):
        """List active user sessions"""
        sessions = UserSession.objects.filter(
            user=request.user,
            is_active=True
        ).order_by('-last_activity')
        
        data = [
            {
                'id': s.id,
                'ip_address': s.ip_address,
                'user_agent': s.user_agent,
                'created_at': s.created_at,
                'last_activity': s.last_activity
            }
            for s in sessions
        ]
        
        return Response(data)
    
    @action(detail=False, methods=['post'])
    def logout_all(self, request):
        """Logout from all devices"""
        UserSession.objects.filter(user=request.user).update(is_active=False)
        
        analytics.track_event(
            user_id=request.user.id,
            event_type='logout_all_devices',
            request=request
        )
        
        return Response({'message': 'Logged out from all devices'})
    
    @action(detail=False, methods=['get'])
    def login_attempts(self, request):
        """Get recent login attempts"""
        attempts = LoginAttempt.objects.filter(
            email=request.user.email
        ).order_by('-timestamp')[:10]
        
        data = [
            {
                'success': a.success,
                'ip_address': a.ip_address,
                'timestamp': a.timestamp
            }
            for a in attempts
        ]
        
        return Response(data)
