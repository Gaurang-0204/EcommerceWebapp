from django.urls import path
from .views import product_list_view
from .views import add_product,categories_list,detail,register, login_view, AdminView, UserView,get_user_data,create_order, get_user_orders,user_profile,update_user_profile,create_category,products_by_category,search_products
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('products/', product_list_view, name='product-list'),
    path('products/add/', add_product, name='add-product'),
     path('categories/', categories_list, name='categories-list'),
     path('detail/<int:id>/', detail, name='detail'),
     path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('admin-only/', AdminView.as_view(), name='admin_view'),
    path('user-only/', UserView.as_view(), name='user_view'),
    path('user-data/', get_user_data, name='user-data'),
    path('orders/', create_order, name='create-order'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('order/', get_user_orders, name='user-orders'),
    path('user/', user_profile, name='user_profile'),
    path('update/user/', update_user_profile, name='update_user_profile'),
    path('category/', create_category, name='create_category'),
    path('products-by-category/', products_by_category, name='products_by_category'),
    path('search/', search_products, name='search-products'),

   
]
