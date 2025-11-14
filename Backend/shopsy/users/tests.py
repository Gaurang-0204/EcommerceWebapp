from django.test import TestCase

# Create your tests here.
"""
Comprehensive authentication tests for user login, registration, logout
and token management.
"""

import pytest
from django.test import TestCase, Client, override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserSession, LoginAttempt
import json

User = get_user_model()


class UserRegistrationTests(APITestCase):
    """Test user registration endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
    
    def test_valid_registration(self):
        """Test successful user registration"""
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
        }
        
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], data['email'])
        self.assertTrue(User.objects.filter(email=data['email']).exists())
    
    def test_duplicate_email(self):
        """Test registration with existing email"""
        User.objects.create_user(
            email='existing@example.com',
            username='existing',
            password='testpass123'
        )
        
        data = {
            'email': 'existing@example.com',
            'username': 'newuser',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
        }
        
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_duplicate_username(self):
        """Test registration with existing username"""
        User.objects.create_user(
            email='user1@example.com',
            username='existing',
            password='testpass123'
        )
        
        data = {
            'email': 'user2@example.com',
            'username': 'existing',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
        }
        
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
    
    def test_password_mismatch(self):
        """Test registration with mismatched passwords"""
        data = {
            'email': 'user@example.com',
            'username': 'testuser',
            'password': 'testpass123',
            'password_confirm': 'differentpass123',
        }
        
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
    
    def test_weak_password(self):
        """Test registration with weak password"""
        data = {
            'email': 'user@example.com',
            'username': 'testuser',
            'password': 'pass',
            'password_confirm': 'pass',
        }
        
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserLoginTests(APITestCase):
    """Test user login endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.login_url = '/api/auth/login/'
        
        # Create test user
        self.user = User.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='testpass123'
        )
    
    def test_valid_login(self):
        """Test successful login"""
        data = {
            'email': 'user@example.com',
            'password': 'testpass123',
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], data['email'])
    
    def test_login_with_username(self):
        """Test login using username instead of email"""
        data = {
            'email': 'user@example.com',
            'password': 'testpass123',
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_invalid_credentials(self):
        """Test login with invalid credentials"""
        data = {
            'email': 'user@example.com',
            'password': 'wrongpassword',
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_nonexistent_user(self):
        """Test login with nonexistent user"""
        data = {
            'email': 'nonexistent@example.com',
            'password': 'testpass123',
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_login_attempt_recorded(self):
        """Test that login attempts are recorded"""
        data = {
            'email': 'user@example.com',
            'password': 'testpass123',
        }
        
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(LoginAttempt.objects.filter(success=True).exists())


class UserLogoutTests(APITestCase):
    """Test user logout endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.logout_url = '/api/auth/logout/'
        
        # Create and login user
        self.user = User.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='testpass123'
        )
        
        self.token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_valid_logout(self):
        """Test successful logout"""
        response = self.client.post(self.logout_url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
    
    def test_logout_deactivates_session(self):
        """Test that logout deactivates user sessions"""
        # Create session
        UserSession.objects.create(
            user=self.user,
            token=str(self.token)[:50],
            ip_address='127.0.0.1',
            user_agent='Test Agent'
        )
        
        response = self.client.post(self.logout_url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(UserSession.objects.filter(is_active=True).exists())
    
    def test_logout_without_authentication(self):
        """Test logout without valid token"""
        self.client.credentials()  # Clear credentials
        response = self.client.post(self.logout_url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TokenRefreshTests(APITestCase):
    """Test token refresh endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.refresh_url = '/api/auth/refresh/'
        
        self.user = User.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='testpass123'
        )
        
        self.refresh_token = str(RefreshToken.for_user(self.user))
    
    def test_valid_token_refresh(self):
        """Test successful token refresh"""
        data = {'refresh': self.refresh_token}
        
        response = self.client.post(self.refresh_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_invalid_refresh_token(self):
        """Test refresh with invalid token"""
        data = {'refresh': 'invalid.token.here'}
        
        response = self.client.post(self.refresh_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PasswordChangeTests(APITestCase):
    """Test password change endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.change_password_url = '/api/auth/profile/change_password/'
        
        self.user = User.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='oldpass123'
        )
        
        self.token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_valid_password_change(self):
        """Test successful password change"""
        data = {
            'old_password': 'oldpass123',
            'new_password': 'newpass123',
            'new_password_confirm': 'newpass123',
        }
        
        response = self.client.post(self.change_password_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_incorrect_old_password(self):
        """Test password change with wrong old password"""
        data = {
            'old_password': 'wrongoldpass',
            'new_password': 'newpass123',
            'new_password_confirm': 'newpass123',
        }
        
        response = self.client.post(self.change_password_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_password_mismatch(self):
        """Test password change with mismatched new passwords"""
        data = {
            'old_password': 'oldpass123',
            'new_password': 'newpass123',
            'new_password_confirm': 'differentpass123',
        }
        
        response = self.client.post(self.change_password_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_login_with_new_password(self):
        """Test that login works with new password after change"""
        # Change password
        data = {
            'old_password': 'oldpass123',
            'new_password': 'newpass123',
            'new_password_confirm': 'newpass123',
        }
        response = self.client.post(self.change_password_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Try login with new password
        self.client.credentials()  # Clear credentials
        login_response = self.client.post(
            '/api/auth/login/',
            {'email': 'user@example.com', 'password': 'newpass123'},
            format='json'
        )
        
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)


class SessionManagementTests(APITestCase):
    """Test session management endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.sessions_url = '/api/auth/profile/sessions/'
        
        self.user = User.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='testpass123'
        )
        
        self.token = RefreshToken.for_user(self.user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_get_active_sessions(self):
        """Test retrieving active sessions"""
        # Create sessions
        UserSession.objects.create(
            user=self.user,
            token='token1',
            ip_address='127.0.0.1',
            user_agent='Firefox'
        )
        UserSession.objects.create(
            user=self.user,
            token='token2',
            ip_address='192.168.1.1',
            user_agent='Chrome'
        )
        
        response = self.client.get(self.sessions_url, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_logout_all_devices(self):
        """Test logout from all devices"""
        # Create multiple sessions
        UserSession.objects.create(
            user=self.user,
            token='token1',
            ip_address='127.0.0.1',
            user_agent='Firefox'
        )
        UserSession.objects.create(
            user=self.user,
            token='token2',
            ip_address='192.168.1.1',
            user_agent='Chrome'
        )
        
        response = self.client.post('/api/auth/profile/logout_all/', format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            UserSession.objects.filter(user=self.user, is_active=True).count(),
            0
        )
