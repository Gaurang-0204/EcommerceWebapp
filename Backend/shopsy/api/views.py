from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
from rest_framework import status
from .models import Product, Category
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework import status

@api_view(['GET'])
def product_list_view(request):
    products = Product.objects.filter(is_active=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# @api_view(['POST'])
# def add_product(request):
#     """
#     API endpoint to add a new product to the database, including image upload.
#     """
#     try:
#         # Get category from the request
#         category_name = request.data.get('category')
#         if not category_name:
#             return Response({"error": "Category is required."}, status=status.HTTP_400_BAD_REQUEST)
        
#         # Validate category
#         category = Category.objects.filter(name=category_name).first()
#         if not category:
#             return Response({"error": f"Category '{category_name}' does not exist."}, status=status.HTTP_400_BAD_REQUEST)

#         # Copy request data and add category ID
#         product_data = request.data.copy()
#         product_data['category'] = category.id

#         # Pass data and files to the serializer
#         serializer = ProductSerializer(data=product_data, files=request.FILES)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def add_product(request):
    """
    API endpoint to add a new product to the database, including image upload.
    """
    try:
        # Get category from the request
        category_name = request.data.get('category')
        if not category_name:
            return Response({"error": "Category is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate category
        category = Category.objects.filter(name=category_name).first()
        if not category:
            return Response({"error": f"Category '{category_name}' does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Copy request data and add category ID
        product_data = request.data.copy()
        product_data['category'] = category.id

        # Pass data and files to the serializer (request.FILES is handled automatically)
        serializer = ProductSerializer(data=product_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def categories_list(request):
    categories = Category.objects.all()
    data = [{"id": category.id, "name": category.name} for category in categories]
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def detail(request, id):
    try:
        product = Product.objects.get(id=id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)
    

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework import status

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow any user to access the registration endpoint
def register(request):
    """
    Register a new user by accepting POST data with user credentials
    and returning a user object on successful registration.
    """
    if request.method == 'POST':
        # Ensure 'role' is set to 'user' by default if not provided in the request
        data = request.data.copy()
        if 'role' not in data:
            data['role'] = 'user'  # Default role is 'user'
        
        # Use the modified data with default 'role'
        serializer = RegisterSerializer(data=data)

        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "user": UserSerializer(user).data,
                    "message": "User registered successfully",
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .models import CustomUser
from .serializers import LoginSerializer, UserSerializer

# Helper function to generate tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Login view
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow any user to access the login endpoint
def login_view(request):
    """
    Handles user login by validating credentials and returning JWT tokens
    along with the user's role.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    # Ensure both username and password are provided
    if not username or not password:
        return Response(
            {"message": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Authenticate the user
    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {"message": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Check if the user is active
    if not user.is_active:
        return Response(
            {"message": "This account is inactive. Please contact support."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Generate tokens for the user
    tokens = get_tokens_for_user(user)

    # Get the user's role (ensure the attribute exists)
    user_role = getattr(user, 'role', None)
    if not user_role:
        return Response(
            {"message": "User role is not defined. Please contact the administrator."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # Return the tokens and user role
    return Response(
        {
            "tokens": tokens,
            "user": {"role": user_role},
            "message": "Login successful"
        },
        status=status.HTTP_200_OK
    )


class AdminView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'admin':
            return Response({"message": "Welcome, Admin!"})
        return Response({"message": "Access Denied"}, status=status.HTTP_403_FORBIDDEN)

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'user':
            return Response({"message": "Welcome, User!"})
        return Response({"message": "Access Denied"}, status=status.HTTP_403_FORBIDDEN)
    

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this view
def get_user_data(request):
    user = request.user  # Fetch the currently logged-in user

    # Ensure the user is an instance of the CustomUser model and handle missing fields gracefully
    try:
        return Response({
            "name": user.get_full_name(),  # Full name of the user
            "email": user.email,  # Email address
            "street": getattr(user, 'street', None),  # Street address
            "city": getattr(user, 'city', None),  # City
            "state": getattr(user, 'state', None),  # State
            "pincode": getattr(user, 'pincode', None),  # Pincode
        })
    except Exception as e:
        return Response({"error": f"Error retrieving user data: {str(e)}"}, status=400)






from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from .serializers import OrderSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this endpoint
def create_order(request):
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        # Automatically associate the order with the logged-in user
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Order
from .serializers import UserSerializer, OrderSerializer

# @api_view(['GET', 'PUT'])
# @permission_classes([IsAuthenticated])
# def user_detail(request):
#     if request.method == 'GET':
#         serializer = UserSerializer(request.user)
#         return Response(serializer.data)
#     elif request.method == 'PUT':
#         serializer = UserSerializer(request.user, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=400)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Ensure permission_classes is before api_view
# def user_orders(request):
#     try:
#         orders = Order.objects.filter(user=request.user)
#         if not orders.exists():
#             return Response({"message": "No orders found."}, status=404)

#         serializer = OrderSerializer(orders, many=True)
#         return Response(serializer.data, status=200)
    
#     except Exception as e:
#         return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure user is logged in
def get_user_orders(request):
    user = request.user  # Get the logged-in user
    orders = Order.objects.filter(user=user)  # Fetch orders for this user
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import CustomUser

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CustomUser

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    try:
        user = CustomUser.objects.get(username=request.user.username)
        data = {
            'username': user.username,
            'role': user.role,
            'city': user.city,
            'street': user.street,
            'pincode': user.pincode,
            'state': user.state,
        }
        return Response(data)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)



from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserProfileUpdateSerializer

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def update_user_profile(request):
    try:
        user = CustomUser.objects.get(username=request.user.username)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)  # partial=True allows partial updates

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category
from .serializers import CategorySerializer

@api_view(['POST'])
def create_category(request):
    if request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        
        # Check if the submitted data is valid
        if serializer.is_valid():
            serializer.save()  # Save the category to the database
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return created category data
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return validation errors if any



from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Category, Product
from .serializers import ProductSerializer, CategorySerializer

@api_view(['GET'])
def products_by_category(request):
    categories = Category.objects.all()[:3]  # Fetch only 3 categories
    category_data = {}

    for category in categories:
        product = Product.objects.filter(category=category).first()  # Get only 1 product per category
        if product:
            category_data[category.name] = ProductSerializer(product).data  # Serialize product

    return Response(category_data)


from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET'])
def search_products(request):
    query = request.GET.get('q', '')
    if query:
        products = Product.objects.filter(name__icontains=query)  # Case-insensitive search
    else:
        products = Product.objects.all()

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
