from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
from rest_framework import status
from .models import Product, Category

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

