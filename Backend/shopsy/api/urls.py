from django.urls import path
from .views import product_list_view
from .views import add_product,categories_list,detail

urlpatterns = [
    path('products/', product_list_view, name='product-list'),
    path('products/add/', add_product, name='add-product'),
     path('categories/', categories_list, name='categories-list'),
     path('detail/<int:id>/', detail, name='detail'),
]