# File: inventory/management/commands/populate_inventory.py

import os
import uuid
from decimal import Decimal
from django.core.files import File
from django.core.management.base import BaseCommand
from django.conf import settings
from inventory.models import Product, Inventory

class Command(BaseCommand):
    help = 'Populate initial fashion inventory data with product images'

    def handle(self, *args, **options):
        products_data = [
            {
                'name': 'Classic White T-Shirt',
                'description': 'Soft cotton white t-shirt perfect for everyday wear.',
                'price': Decimal('499.00'),
                'color': 'White',
                'inventory_qty': 25,
                'image': 'products/white_tshirt.jpg',
            },
            {
                'name': 'Denim Jacket',
                'description': 'Stylish blue denim jacket with metal buttons and slim fit design.',
                'price': Decimal('2499.00'),
                'color': 'Blue',
                'inventory_qty': 10,
                'image': 'products/denim_jacket.jpeg',
            },
            {
                'name': 'Beige Chino Shorts',
                'description': 'Genuine leather handbag with gold-tone hardware and adjustable strap.',
                'price': Decimal('3999.00'),
                'color': 'Brown',
                'inventory_qty': 12,
                'image': 'products/Beige__Chino_Shorts.jpeg',
            },
            {
                'name': 'Skinny Blue Jeans',
                'description': 'Breathable running shoes with cushioned sole for all-day comfort.',
                'price': Decimal('2999.00'),
                'color': 'Grey',
                'inventory_qty': 20,
                'image': 'products/Skinny_Blue_Jeans.jpeg',
            },
            {
                'name': 'Black Womens Top',
                'description': 'Slim-fit formal shirt suitable for office or formal events.',
                'price': Decimal('1199.00'),
                'color': 'Light Blue',
                'inventory_qty': 18,
                'image': 'products/Black_Womens_Top.webp',
            },
            {
                'name': 'Summer Dress',
                'description': 'Floral print summer dress with lightweight, breathable fabric.',
                'price': Decimal('1799.00'),
                'color': 'Yellow Floral',
                'inventory_qty': 8,
                'image': 'products/Printed_Summer_Dress.jpeg',
            },
        ]

        for product_data in products_data:
            image_path = os.path.join(settings.MEDIA_ROOT, product_data['image'])
            inventory_qty = product_data.pop('inventory_qty')
            image_file_path = product_data.pop('image')

            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults={
                    **product_data,
                    'image': image_file_path,  # reference relative path
                }
            )

            Inventory.objects.get_or_create(
                product=product,
                defaults={'quantity_available': inventory_qty}
            )

            if created:
                self.stdout.write(f'✅ Created product: {product.name}')
            else:
                self.stdout.write(f'ℹ️ Product already exists: {product.name}')

        self.stdout.write(self.style.SUCCESS('🎉 Fashion inventory populated successfully!'))
