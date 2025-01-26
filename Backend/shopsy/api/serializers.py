from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'role')

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'email', 'role', 'city', 'street', 'pincode', 'state')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            role=validated_data['role'],
            city=validated_data.get('city', ''),
            street=validated_data.get('street', ''),
            pincode=validated_data.get('pincode', ''),
            state=validated_data.get('state', ''),
        )
        return user


from rest_framework import serializers
from .models import CustomUser

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            raise serializers.ValidationError("Username and password are required.")

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials.")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        return user


