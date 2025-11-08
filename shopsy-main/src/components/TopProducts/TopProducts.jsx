/**
 * @fileoverview Top Products Component - Featured Product Showcase
 * 
 * Displays top-rated products organized by category with product details,
 * ratings, and purchase options. This component is critical for product
 * discovery and conversion optimization.
 * 
 * ENTERPRISE OPTIMIZATION ROADMAP:
 * This component is currently fetching products from a Django backend API.
 * Multiple advanced features need to be implemented to transform this into
 * an enterprise-grade, high-performance component.
 * 
 * CURRENT ARCHITECTURE:
 * - Frontend: React component with axios for API calls
 * - Backend: Django REST API (http://127.0.0.1:8000)
 * - Data Flow: Component mount → API call → Display products
 * 
 * CURRENT ISSUES IDENTIFIED:
 * 1. ❌ No caching - API called on every component mount
 * 2. ❌ No real-time inventory updates
 * 3. ❌ No AI-powered product recommendations
 * 4. ❌ Basic loading state (just "Loading...")
 * 5. ❌ No error handling UI
 * 6. ❌ Hardcoded star rating (always 4 stars)
 * 7. ❌ No analytics tracking for product views/clicks
 * 8. ❌ Images not optimized (no lazy loading, no WebP)
 * 9. ❌ No performance monitoring
 * 10. ❌ Direct axios calls (should use microservices abstraction)
 * 
 * @component
 * @version 1.0.0 - MVP (Current)
 * @version 2.0.0 - Planned (Enterprise Features)
 * 
 * @requires React
 * @requires axios
 * @requires react-router-dom
 * @requires react-icons/fa
 * 
 * @example
 * ```
 * // In Home.jsx
 * import { Suspense, lazy } from 'react'
 * const LazyTopProducts = lazy(() => import('./TopProducts'))
 * 
 * <Suspense fallback={<ProductsSkeleton />}>
 *   <LazyTopProducts handleOrderPopup={handleOrderPopup} />
 * </Suspense>
 * ```
 */

import React, { useEffect, useState } from "react";
import Img1 from "../../assets/shirt/shirt.png";
import Img2 from "../../assets/shirt/shirt2.png";
import Img3 from "../../assets/shirt/shirt3.png";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// =============================================================================
// TODO: IMPORT ADVANCED FEATURE MODULES (Future Implementation)
// =============================================================================

// -------------------------------------------------------------------------
// 1. AI RECOMMENDATION SYSTEM (+1.5 points)
// -------------------------------------------------------------------------
// TODO: Import AI-powered recommendation engine
// import RecommendationEngine from '@/services/ai/RecommendationEngine'
// import PersonalizedProducts from '@/components/AI/PersonalizedProducts'
// import CollaborativeFilter from '@/services/ai/CollaborativeFilter'
// 
// IMPLEMENTATION STEPS - AI RECOMMENDATIONS:
// 
// A) Backend ML Service (Python + Flask/FastAPI):
// ```
// # services/ml-service/recommendation_engine.py
// import numpy as np
// from sklearn.metrics.pairwise import cosine_similarity
// import pandas as pd
// 
// class ProductRecommender:
//     def __init__(self):
//         self.user_item_matrix = None
//         self.product_similarity = None
//     
//     def train(self, purchase_history):
//         """Train collaborative filtering model"""
//         # Build user-item matrix
//         self.user_item_matrix = pd.crosstab(
//             purchase_history['user_id'],
//             purchase_history['product_id'],
//             values=purchase_history['rating'],
//             aggfunc='mean'
//         ).fillna(0)
//         
//         # Calculate product similarity
//         self.product_similarity = cosine_similarity(
//             self.user_item_matrix.T
//         )
//     
//     def get_similar_products(self, product_id, n=5):
//         """Get products similar to given product"""
//         idx = self.product_ids.index(product_id)
//         similar_scores = list(enumerate(self.product_similarity[idx]))
//         similar_scores = sorted(similar_scores, key=lambda x: x, reverse=True)[1]
//         return [self.product_ids[i] for i in similar_scores[1:n+1]]
//     
//     def get_recommendations_for_user(self, user_id, n=5):
//         """Get personalized recommendations for user"""
//         # Collaborative filtering based on similar users
//         user_purchases = self.user_item_matrix.loc[user_id]
//         similar_users = self.find_similar_users(user_id)
//         recommendations = self.aggregate_recommendations(similar_users)
//         return recommendations[:n]
// 
// # API endpoint
// @app.route('/api/ml/recommendations/<user_id>', methods=['GET'])
// def get_recommendations(user_id):
//     recommender = ProductRecommender()
//     recommender.load_model()
//     recommendations = recommender.get_recommendations_for_user(user_id, n=5)
//     return jsonify(recommendations)
// ```
// 
// B) Frontend Integration:
// ```
// // services/ai/RecommendationService.js
// class RecommendationService {
//   static async getPersonalizedRecommendations(userId) {
//     const response = await axios.get(
//       `${ML_SERVICE_URL}/api/ml/recommendations/${userId}`
//     )
//     return response.data
//   }
//   
//   static async getSimilarProducts(productId) {
//     const response = await axios.get(
//       `${ML_SERVICE_URL}/api/ml/similar-products/${productId}`
//     )
//     return response.data
//   }
//   
//   static async trackProductView(userId, productId) {
//     // Track for improving recommendations
//     await axios.post(`${ML_SERVICE_URL}/api/ml/track-view`, {
//       user_id: userId,
//       product_id: productId,
//       timestamp: Date.now()
//     })
//   }
// }
// ```
// 
// C) Component Integration:
// ```
// const [recommendedProducts, setRecommendedProducts] = useState([])
// 
// useEffect(() => {
//   const userId = localStorage.getItem('userId')
//   if (userId) {
//     RecommendationService.getPersonalizedRecommendations(userId)
//       .then(setRecommendedProducts)
//   }
// }, [])
// 
// // Show "Users who bought X also bought Y" section
// <PersonalizedRecommendations products={recommendedProducts} />
// ```
// 
// FILES TO CREATE:
// Backend (Python):
// - services/ml-service/recommendation_engine.py
// - services/ml-service/collaborative_filter.py
// - services/ml-service/user_behavior_tracker.py
// - services/ml-service/model_trainer.py
// 
// Frontend (React):
// - services/ai/RecommendationService.js
// - components/AI/PersonalizedRecommendations.jsx
// - components/AI/SimilarProducts.jsx
// - hooks/useRecommendations.js
// 
// INTEGRATION POINTS:
// - Show personalized products at bottom of page
// - Track product clicks for ML model
// - Update recommendations in real-time

// -------------------------------------------------------------------------
// 2. REAL-TIME INVENTORY (+1 point) - WebSocket Integration
// -------------------------------------------------------------------------
// TODO: Import WebSocket service for real-time stock updates
// import { useWebSocket } from '@/hooks/useWebSocket'
// import InventoryListener from '@/services/realtime/InventoryListener'
// import StockBadge from '@/components/Inventory/StockBadge'
// 
// IMPLEMENTATION STEPS - REAL-TIME INVENTORY:
// 
// A) Backend WebSocket Server (Django Channels):
// ```
// # backend/consumers/inventory_consumer.py
// import json
// from channels.generic.websocket import AsyncWebsocketConsumer
// from django.core.cache import cache
// import asyncio
// 
// class InventoryConsumer(AsyncWebsocketConsumer):
//     async def connect(self):
//         await self.channel_layer.group_add("inventory_updates", self.channel_name)
//         await self.accept()
//     
//     async def disconnect(self, close_code):
//         await self.channel_layer.group_discard("inventory_updates", self.channel_name)
//     
//     async def inventory_update(self, event):
//         """Send inventory update to WebSocket"""
//         await self.send(text_data=json.dumps({
//             'type': 'inventory_update',
//             'product_id': event['product_id'],
//             'stock': event['stock'],
//             'timestamp': event['timestamp']
//         }))
//     
//     async def low_stock_alert(self, event):
//         """Send low stock alert"""
//         await self.send(text_data=json.dumps({
//             'type': 'low_stock',
//             'product_id': event['product_id'],
//             'stock': event['stock'],
//             'threshold': event['threshold']
//         }))
// 
// # When inventory changes (in views or celery tasks)
// from channels.layers import get_channel_layer
// from asgiref.sync import async_to_sync
// 
// def update_inventory(product_id, new_stock):
//     # Update database
//     product = Product.objects.get(id=product_id)
//     product.stock = new_stock
//     product.save()
//     
//     # Broadcast via WebSocket
//     channel_layer = get_channel_layer()
//     async_to_sync(channel_layer.group_send)(
//         "inventory_updates",
//         {
//             "type": "inventory_update",
//             "product_id": product_id,
//             "stock": new_stock,
//             "timestamp": time.time()
//         }
//     )
//     
//     # Check for low stock
//     if new_stock < LOW_STOCK_THRESHOLD:
//         async_to_sync(channel_layer.group_send)(
//             "inventory_updates",
//             {
//                 "type": "low_stock_alert",
//                 "product_id": product_id,
//                 "stock": new_stock,
//                 "threshold": LOW_STOCK_THRESHOLD
//             }
//         )
// ```
// 
// B) Race Condition Prevention (Redis-based locking):
// ```
// import redis
// from contextlib import contextmanager
// 
// redis_client = redis.Redis(host='localhost', port=6379, db=0)
// 
// @contextmanager
// def inventory_lock(product_id, timeout=5):
//     """Distributed lock to prevent race conditions"""
//     lock_key = f"inventory_lock:{product_id}"
//     lock_acquired = redis_client.set(lock_key, "1", nx=True, ex=timeout)
//     
//     if not lock_acquired:
//         raise InventoryLockException("Product inventory is being updated")
//     
//     try:
//         yield
//     finally:
//         redis_client.delete(lock_key)
// 
// def purchase_product(product_id, quantity):
//     """Thread-safe product purchase with optimistic locking"""
//     with inventory_lock(product_id):
//         # Get current stock with version
//         product = Product.objects.select_for_update().get(id=product_id)
//         
//         if product.stock < quantity:
//             raise InsufficientStockException()
//         
//         # Update stock atomically
//         product.stock = F('stock') - quantity
//         product.version = F('version') + 1  # Optimistic locking
//         product.save()
//         
//         # Broadcast update
//         update_inventory(product_id, product.stock)
//         
//         return product
// ```
// 
// C) Frontend WebSocket Hook:
// ```
// // hooks/useInventoryWebSocket.js
// import { useEffect, useState } from 'react'
// import { io } from 'socket.io-client'
// 
// export const useInventoryWebSocket = () => {
//   const [inventoryUpdates, setInventoryUpdates] = useState({})
//   const [socket, setSocket] = useState(null)
//   
//   useEffect(() => {
//     const ws = io('ws://localhost:8000/ws/inventory/')
//     
//     ws.on('connect', () => {
//       console.log('Connected to inventory WebSocket')
//     })
//     
//     ws.on('inventory_update', (data) => {
//       setInventoryUpdates(prev => ({
//         ...prev,
//         [data.product_id]: data.stock
//       }))
//     })
//     
//     ws.on('low_stock', (data) => {
//       // Show notification
//       showNotification(`Only ${data.stock} left for product ${data.product_id}!`)
//     })
//     
//     setSocket(ws)
//     
//     return () => ws.close()
//   }, [])
//   
//   return { inventoryUpdates, socket }
// }
// ```
// 
// D) Component Integration:
// ```
// const { inventoryUpdates } = useInventoryWebSocket()
// 
// // Update product stock in real-time
// const currentStock = inventoryUpdates[product.id] || product.stock
// 
// <StockBadge 
//   stock={currentStock} 
//   lowStockThreshold={10}
//   className={currentStock < 10 ? 'text-red-500 animate-pulse' : 'text-green-500'}
// />
// ```
// 
// FILES TO CREATE:
// Backend (Django):
// - backend/consumers/inventory_consumer.py
// - backend/routing.py (WebSocket routing)
// - backend/utils/inventory_lock.py
// - backend/tasks/inventory_sync.py (Celery)
// 
// Frontend (React):
// - hooks/useInventoryWebSocket.js
// - services/realtime/InventoryService.js
// - components/Inventory/StockBadge.jsx
// - components/Inventory/LowStockAlert.jsx
// 
// INTEGRATION POINTS:
// - Show real-time stock count
// - Disable "Order Now" when out of stock
// - Show "Low Stock" badge
// - Animate stock changes

// -------------------------------------------------------------------------
// 3. ADMIN ANALYTICS DASHBOARD (+1 point)
// -------------------------------------------------------------------------
// TODO: Track product views and clicks for analytics
// import { useAnalytics } from '@/hooks/useAnalytics'
// import AnalyticsTracker from '@/services/analytics/AnalyticsTracker'
// 
// IMPLEMENTATION STEPS - ANALYTICS:
// 
// A) Event Tracking Service:
// ```
// // services/analytics/AnalyticsService.js
// class AnalyticsService {
//   static trackProductView(productId, category) {
//     return axios.post(`${ANALYTICS_SERVICE_URL}/api/analytics/track`, {
//       event_type: 'product_view',
//       product_id: productId,
//       category: category,
//       timestamp: Date.now(),
//       user_id: this.getUserId(),
//       session_id: this.getSessionId()
//     })
//   }
//   
//   static trackProductClick(productId, position) {
//     return axios.post(`${ANALYTICS_SERVICE_URL}/api/analytics/track`, {
//       event_type: 'product_click',
//       product_id: productId,
//       position: position, // Position in grid
//       timestamp: Date.now(),
//       user_id: this.getUserId()
//     })
//   }
//   
//   static trackAddToCart(productId, quantity, price) {
//     return axios.post(`${ANALYTICS_SERVICE_URL}/api/analytics/track`, {
//       event_type: 'add_to_cart',
//       product_id: productId,
//       quantity: quantity,
//       price: price,
//       timestamp: Date.now(),
//       user_id: this.getUserId()
//     })
//   }
// }
// ```
// 
// B) Analytics Dashboard Backend (Node.js/Python):
// ```
// # services/analytics-service/aggregator.py
// from datetime import datetime, timedelta
// import pandas as pd
// 
// class AnalyticsAggregator:
//     def get_top_products_by_views(self, days=7):
//         """Get most viewed products in last N days"""
//         cutoff = datetime.now() - timedelta(days=days)
//         
//         views = AnalyticsEvent.objects.filter(
//             event_type='product_view',
//             timestamp__gte=cutoff
//         ).values('product_id').annotate(
//             view_count=Count('id')
//         ).order_by('-view_count')[:10]
//         
//         return list(views)
//     
//     def get_conversion_rate(self, product_id):
//         """Calculate view-to-purchase conversion rate"""
//         views = AnalyticsEvent.objects.filter(
//             product_id=product_id,
//             event_type='product_view'
//         ).count()
//         
//         purchases = AnalyticsEvent.objects.filter(
//             product_id=product_id,
//             event_type='purchase_complete'
//         ).count()
//         
//         return (purchases / views * 100) if views > 0 else 0
//     
//     def get_real_time_metrics(self):
//         """Get last 1 hour metrics"""
//         cutoff = datetime.now() - timedelta(hours=1)
//         
//         return {
//             'active_users': self.get_active_users(cutoff),
//             'page_views': self.get_page_views(cutoff),
//             'revenue': self.get_revenue(cutoff),
//             'conversion_rate': self.get_conversion_rate_realtime(cutoff)
//         }
// ```
// 
// C) Component Integration:
// ```
// const { trackEvent } = useAnalytics()
// 
// useEffect(() => {
//   // Track component view
//   trackEvent('top_products_view', {
//     categories: Object.keys(categories),
//     product_count: Object.keys(categories).length
//   })
// }, [categories])
// 
// const handleProductClick = (product, index) => {
//   // Track product click
//   trackEvent('product_click', {
//     product_id: product.id,
//     product_name: product.name,
//     category: category,
//     position: index,
//     section: 'top_products'
//   })
//   
//   navigate(`/ProductDetails/${product.id}`)
// }
// ```
// 
// FILES TO CREATE:
// Backend (Analytics Service):
// - services/analytics-service/event_tracker.py
// - services/analytics-service/aggregator.py
// - services/analytics-service/realtime_metrics.py
// - admin/AnalyticsDashboard.jsx
// 
// Frontend:
// - hooks/useAnalytics.js
// - services/analytics/AnalyticsService.js
// - services/analytics/EventTracker.js
// 
// INTEGRATION POINTS:
// - Track on component mount (view event)
// - Track on product click
// - Track on "Order Now" click
// - Send data to analytics service

// -------------------------------------------------------------------------
// 4. PERFORMANCE OPTIMIZATION (+1 point)
// -------------------------------------------------------------------------
// TODO: Implement comprehensive caching and optimization
// import { useQuery, useQueryClient } from 'react-query'
// import { memo, useMemo, useCallback } from 'react'
// import { LazyLoadImage } from 'react-lazy-load-image-component'
// 
// IMPLEMENTATION STEPS - PERFORMANCE:
// 
// A) React Query for Caching:
// ```
// // hooks/useTopProducts.js
// import { useQuery } from 'react-query'
// 
// export const useTopProducts = () => {
//   return useQuery(
//     'topProducts',
//     async () => {
//       const response = await axios.get(
//         'http://127.0.0.1:8000/api/products-by-category/'
//       )
//       
//       // Transform data
//       const limitedCategories = Object.keys(response.data).slice(0, 3)
//       const filteredData = {}
//       
//       limitedCategories.forEach(category => {
//         filteredData[category] = response.data[category]
//       })
//       
//       return filteredData
//     },
//     {
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       cacheTime: 10 * 60 * 1000, // 10 minutes
//       refetchOnWindowFocus: false,
//       retry: 3,
//       onError: (error) => {
//         console.error('Failed to fetch products:', error)
//       }
//     }
//   )
// }
// ```
// 
// B) Backend Redis Caching:
// ```
// # backend/views.py
// from django.core.cache import cache
// from django.views.decorators.cache import cache_page
// import json
// 
// @cache_page(60 * 5)  # Cache for 5 minutes
// def products_by_category(request):
//     # Try to get from Redis first
//     cache_key = 'products_by_category'
//     cached_data = cache.get(cache_key)
//     
//     if cached_data:
//         return JsonResponse(cached_data)
//     
//     # Fetch from database with optimized query
//     products = Product.objects.select_related('category').prefetch_related('images')
//     
//     # Group by category
//     data = {}
//     for product in products:
//         category = product.category.name
//         if category not in data:
//             data[category] = []
//         data[category].append({
//             'id': product.id,
//             'name': product.name,
//             'price': product.price,
//             'image': product.image.url,
//             'rating': product.rating
//         })
//     
//     # Cache in Redis for 5 minutes
//     cache.set(cache_key, data, 60 * 5)
//     
//     return JsonResponse(data)
// 
// # Invalidate cache on product update
// from django.db.models.signals import post_save
// 
// @receiver(post_save, sender=Product)
// def invalidate_product_cache(sender, instance, **kwargs):
//     cache.delete('products_by_category')
// ```
// 
// C) Image Optimization:
// ```
// import { LazyLoadImage } from 'react-lazy-load-image-component'
// import 'react-lazy-load-image-component/src/effects/blur.css'
// 
// <LazyLoadImage
//   src={`${BASE_URL}${product.image}`}
//   alt={product?.name}
//   effect="blur"
//   threshold={100}
//   placeholderSrc="/placeholder-product.jpg"
//   className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
//   onClick={() => handleProductClick(product.id)}
// />
// ```
// 
// D) Component Memoization:
// ```
// const TopProducts = memo(({ handleOrderPopup }) => {
//   // Component code
// }, (prevProps, nextProps) => {
//   return prevProps.handleOrderPopup === nextProps.handleOrderPopup
// })
// ```
// 
// E) Performance Monitoring:
// ```
// import { useEffect } from 'react'
// 
// useEffect(() => {
//   // Measure component render time
//   const startTime = performance.now()
//   
//   return () => {
//     const endTime = performance.now()
//     console.log(`TopProducts render time: ${endTime - startTime}ms`)
//     
//     // Send to monitoring service
//     if (endTime - startTime > 100) {
//       MonitoringService.logSlowRender('TopProducts', endTime - startTime)
//     }
//   }
// }, [])
// ```
// 
// FILES TO CREATE:
// - hooks/useTopProducts.js
// - hooks/useImageOptimization.js
// - services/cache/RedisService.js
// - utils/performance/PerformanceMonitor.js
// - utils/performance/ImageOptimizer.js
// 
// OPTIMIZATIONS TO APPLY:
// - React Query for API caching
// - Redis for backend caching
// - Image lazy loading
// - Component memoization
// - Debounced event handlers
// - Virtual scrolling (if many products)

// -------------------------------------------------------------------------
// 5. MICROSERVICES ARCHITECTURE (+1.5 points)
// -------------------------------------------------------------------------
// TODO: Abstract API calls into microservices
// import ProductService from '@/services/microservices/ProductService'
// import InventoryService from '@/services/microservices/InventoryService'
// import RecommendationService from '@/services/microservices/RecommendationService'
// 
// IMPLEMENTATION STEPS - MICROSERVICES:
// 
// A) Service Architecture:
// ```
// Frontend (React)
//     ↓
// API Gateway (Kong/NGINX)
//     ↓
// ├── Product Service (Port 8001)
// ├── Inventory Service (Port 8002)
// ├── Recommendation Service (Port 8003)
// ├── Analytics Service (Port 8004)
// └── Notification Service (Port 8005)
// ```
// 
// B) API Gateway Client:
// ```
// // services/microservices/APIGateway.js
// import axios from 'axios'
// 
// class APIGateway {
//   constructor() {
//     this.baseURL = process.env.REACT_APP_API_GATEWAY_URL
//     this.client = axios.create({
//       baseURL: this.baseURL,
//       timeout: 10000,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//     
//     // Add auth interceptor
//     this.client.interceptors.request.use(config => {
//       const token = localStorage.getItem('accessToken')
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//       return config
//     })
//     
//     // Add retry logic
//     this.client.interceptors.response.use(
//       response => response,
//       error => this.handleError(error)
//     )
//   }
//   
//   async handleError(error) {
//     // Circuit breaker pattern
//     if (error.response?.status === 503) {
//       // Service unavailable - use fallback
//       return this.getFallbackResponse(error.config)
//     }
//     
//     // Retry with exponential backoff
//     if (error.config.retryCount < 3) {
//       error.config.retryCount = error.config.retryCount || 0
//       error.config.retryCount++
//       
//       const delay = Math.pow(2, error.config.retryCount) * 1000
//       await new Promise(resolve => setTimeout(resolve, delay))
//       
//       return this.client.request(error.config)
//     }
//     
//     throw error
//   }
// }
// ```
// 
// C) Product Service:
// ```
// // services/microservices/ProductService.js
// class ProductService {
//   static async getTopProducts() {
//     try {
//       const response = await APIGateway.get('/api/v1/products/top')
//       return response.data
//     } catch (error) {
//       // Fallback to cached data
//       return CacheService.get('top_products_fallback')
//     }
//   }
//   
//   static async getProductsByCategory(limit = 3) {
//     const response = await APIGateway.get(
//       `/api/v1/products/by-category?limit=${limit}`
//     )
//     return response.data
//   }
// }
// ```
// 
// D) Docker Compose (for local development):
// ```
// # docker-compose.yml
// version: '3.8'
// 
// services:
//   api-gateway:
//     image: kong:latest
//     ports:
//       - "8000:8000"
//       - "8001:8001"
//     environment:
//       KONG_DATABASE: postgres
//       KONG_PG_HOST: db
//   
//   product-service:
//     build: ./services/product-service
//     ports:
//       - "8001:8000"
//     environment:
//       DATABASE_URL: postgresql://user:pass@db:5432/products
//   
//   inventory-service:
//     build: ./services/inventory-service
//     ports:
//       - "8002:8000"
//     depends_on:
//       - redis
//   
//   recommendation-service:
//     build: ./services/recommendation-service
//     ports:
//       - "8003:5000"
//     volumes:
//       - ./ml-models:/models
//   
//   redis:
//     image: redis:alpine
//     ports:
//       - "6379:6379"
//   
//   db:
//     image: postgres:14
//     environment:
//       POSTGRES_PASSWORD: password
// ```
// 
// FILES TO CREATE:
// - services/microservices/APIGateway.js
// - services/microservices/ProductService.js
// - services/microservices/InventoryService.js
// - services/microservices/RecommendationService.js
// - utils/microservices/CircuitBreaker.js
// - utils/microservices/RetryHandler.js
// - docker-compose.yml
// - Dockerfile (for each service)
// 
// INTEGRATION POINTS:
// - Replace direct axios calls with service methods
// - Add circuit breaker for failed services
// - Implement fallback strategies

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

/**
 * Base URL for API endpoints
 * 
 * TODO: Move to environment variables
 * SECURITY: Should not be hardcoded in production
 * 
 * SUGGESTED IMPLEMENTATION:
 * ```
 * const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000"
 * 
 * // Or use microservices
 * const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL
 * ```
 * 
 * FILES TO CREATE:
 * - .env.development
 * - .env.production
 * - config/api.js (centralized API config)
 * 
 * @constant {string}
 */
// Note: These imported images appear unused - can be removed to reduce bundle size
// const Img1 = "../../assets/shirt/shirt.png";
// const Img2 = "../../assets/shirt/shirt2.png";
// const Img3 = "../../assets/shirt/shirt3.png";

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * TopProducts Component
 * 
 * TODO: Add React.memo for performance optimization
 * TODO: Add PropTypes for type checking
 * 
 * SUGGESTED IMPLEMENTATION:
 * ```
 * import PropTypes from 'prop-types'
 * 
 * const TopProducts = memo(({ handleOrderPopup }) => {
 *   // Component code
 * })
 * 
 * TopProducts.propTypes = {
 *   handleOrderPopup: PropTypes.func.isRequired
 * }
 * ```
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.handleOrderPopup - Callback to open order popup
 * @returns {JSX.Element} TopProducts component
 */
const TopProducts = ({ handleOrderPopup }) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  /**
   * Product categories state
   * 
   * TODO: Replace with React Query for caching
   * OPTIMIZATION: Use useQuery hook for automatic caching and refetching
   * 
   * SUGGESTED IMPLEMENTATION:
   * ```
   * const { data: categories, isLoading, error } = useQuery(
   *   'topProducts',
   *   ProductService.getTopProducts,
   *   {
   *     staleTime: 5 * 60 * 1000,
   *     cacheTime: 10 * 60 * 1000
   *   }
   * )
   * ```
   * 
   * @type {[Object, Function]}
   */
  const [categories, setCategories] = useState({});

  /**
   * Loading state
   * 
   * TODO: Add more granular loading states
   * IMPROVEMENT: Track which specific part is loading
   * 
   * SUGGESTED STATES:
   * ```
   * const [loadingState, setLoadingState] = useState({
   *   fetching: true,
   *   processing: false,
   *   error: null
   * })
   * ```
   * 
   * @type {[boolean, Function]}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Base URL constant
   * Moved from global scope for better encapsulation
   * 
   * @type {string}
   */
  const BASE_URL = "http://127.0.0.1:8000";

  /**
   * Navigation hook
   * 
   * TODO: Add useCallback wrapper for performance
   * 
   * @type {Function}
   */
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // TODO: ADD ADVANCED FEATURE STATE
  // ---------------------------------------------------------------------------

  // TODO: WebSocket state for real-time inventory
  // const { inventoryUpdates, isConnected } = useInventoryWebSocket()

  // TODO: AI recommendations state
  // const [recommendedProducts, setRecommendedProducts] = useState([])

  // TODO: Analytics tracking
  // const { trackEvent } = useAnalytics()

  // TODO: Performance monitoring
  // const [renderTime, setRenderTime] = useState(0)

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Handle product card click navigation
   * 
   * TODO: Add analytics tracking
   * TODO: Add useCallback for performance
   * TODO: Track position in grid for analytics
   * 
   * SUGGESTED IMPLEMENTATION:
   * ```
   * const handleProductClick = useCallback((product, index, category) => {
   *   // Track product click for analytics
   *   trackEvent('product_click', {
   *     product_id: product.id,
   *     product_name: product.name,
   *     category: category,
   *     position: index,
   *     section: 'top_products',
   *     price: product.price,
   *     timestamp: Date.now()
   *   })
   *   
   *   // Track for ML recommendations
   *   RecommendationService.trackProductView(
   *     localStorage.getItem('userId'),
   *     product.id
   *   )
   *   
   *   // Navigate to product details
   *   navigate(`/ProductDetails/${product.id}`)
   * }, [navigate, trackEvent])
   * ```
   * 
   * @function handleProductClick
   * @param {number} id - Product ID
   * @returns {void}
   */
  const handleProductClick = (id) => {
    navigate(`/ProductDetails/${id}`); // Navigate to the ProductDetails page
  };

  // ---------------------------------------------------------------------------
  // TODO: ADD ADVANCED EVENT HANDLERS
  // ---------------------------------------------------------------------------

  // TODO: Handle "Order Now" button click
  // const handleOrderNowClick = useCallback((product) => {
  //   // Check inventory first
  //   const currentStock = inventoryUpdates[product.id] || product.stock
  //   
  //   if (currentStock === 0) {
  //     showNotification('Product is out of stock', 'error')
  //     return
  //   }
  //   
  //   // Track add to cart event
  //   trackEvent('add_to_cart_click', {
  //     product_id: product.id,
  //     source: 'top_products',
  //     price: product.price
  //   })
  //   
  //   // Open order popup
  //   handleOrderPopup()
  // }, [inventoryUpdates, handleOrderPopup, trackEvent])

  // ---------------------------------------------------------------------------
  // LIFECYCLE EFFECTS
  // ---------------------------------------------------------------------------

  /**
   * Fetch products on component mount
   * 
   * TODO: Replace with React Query or microservice
   * ISSUES:
   * - No retry logic
   * - No caching
   * - No error handling UI
   * - Makes API call on every mount (even if data hasn't changed)
   * 
   * SUGGESTED IMPLEMENTATION:
   * ```
   * useEffect(() => {
   *   const fetchProducts = async () => {
   *     try {
   *       setLoading(true)
   *       
   *       // Use microservice instead of direct axios
   *       const data = await ProductService.getTopProducts(3)
   *       
   *       setCategories(data)
   *       setLoading(false)
   *       
   *       // Track successful load
   *       trackEvent('top_products_loaded', {
   *         category_count: Object.keys(data).length,
   *         load_time: performance.now() - startTime
   *       })
   *     } catch (error) {
   *       console.error("Error fetching products:", error)
   *       setLoading(false)
   *       setError(error.message)
   *       
   *       // Track error
   *       trackEvent('top_products_error', {
   *         error: error.message,
   *         timestamp: Date.now()
   *       })
   *       
   *       // Try to use cached fallback data
   *       const cachedData = CacheService.get('top_products_fallback')
   *       if (cachedData) {
   *         setCategories(cachedData)
   *       }
   *     }
   *   }
   *   
   *   fetchProducts()
   * }, [])
   * ```
   * 
   * PERFORMANCE OPTIMIZATION:
   * Use React Query instead:
   * ```
   * const { data: categories, isLoading, error } = useQuery(
   *   ['topProducts', 3],
   *   () => ProductService.getTopProducts(3),
   *   {
   *     staleTime: 5 * 60 * 1000, // 5 minutes
   *     cacheTime: 10 * 60 * 1000, // 10 minutes
   *     retry: 3,
   *     retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
   *   }
   * )
   * ```
   */
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products-by-category/")
      .then(response => {
        const limitedCategories = Object.keys(response.data).slice(0, 3); // Take only 3 categories
        const filteredData = {};

        limitedCategories.forEach(category => {
          filteredData[category] = response.data[category]; // Pick only 1 product per category
        });

        setCategories(filteredData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  // ---------------------------------------------------------------------------
  // TODO: ADD ADVANCED FEATURE EFFECTS
  // ---------------------------------------------------------------------------

  // TODO: Track component view for analytics
  // useEffect(() => {
  //   trackEvent('top_products_view', {
  //     timestamp: Date.now(),
  //     categories: Object.keys(categories),
  //     product_count: Object.values(categories).flat().length
  //   })
  // }, [categories])

  // TODO: Performance monitoring
  // useEffect(() => {
  //   const startTime = performance.now()
  //   
  //   return () => {
  //     const renderTime = performance.now() - startTime
  //     setRenderTime(renderTime)
  //     
  //     if (renderTime > 100) {
  //       MonitoringService.logSlowRender('TopProducts', renderTime)
  //     }
  //   }
  // }, [])

  // TODO: Fetch AI recommendations
  // useEffect(() => {
  //   const userId = localStorage.getItem('userId')
  //   if (userId) {
  //     RecommendationService.getPersonalizedRecommendations(userId)
  //       .then(setRecommendedProducts)
  //   }
  // }, [])

  // ---------------------------------------------------------------------------
  // RENDER LOGIC
  // ---------------------------------------------------------------------------

  /**
   * Loading state UI
   * 
   * TODO: Replace with proper loading skeleton
   * CURRENT: Just displays "Loading..." text
   * IMPROVEMENT: Show skeleton cards matching product layout
   * 
   * SUGGESTED IMPLEMENTATION:
   * ```
   * if (loading) {
   *   return (
   *     <div className="container">
   *       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 md:gap-5">
   *         {.map(i => ([1]
   *           <ProductCardSkeleton key={i} />
   *         ))}
   *       </div>
   *     </div>
   *   )
   * }
   * ```
   * 
   * FILES TO CREATE:
   * - components/Skeletons/ProductCardSkeleton.jsx
   * - components/Skeletons/ProductsSkeleton.jsx
   */
  if (loading) {
    return <p>Loading...</p>;
  }

  // ---------------------------------------------------------------------------
  // TODO: ADD ERROR STATE UI
  // ---------------------------------------------------------------------------
  // if (error) {
  //   return (
  //     <div className="container py-12">
  //       <div className="text-center">
  //         <div className="text-red-500 text-6xl mb-4">⚠️</div>
  //         <h3 className="text-xl font-bold mb-2">Failed to Load Products</h3>
  //         <p className="text-gray-600 mb-4">{error}</p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="bg-primary text-white px-6 py-2 rounded-lg"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------

return (
  <div>
    <div className="container">
      {/* ================================================================= */}
      {/* HEADER SECTION */}
      {/* ================================================================= */}
      {/* 
        TODO: Make header content dynamic from CMS
        TODO: Add A/B testing for different headlines
        
        SUGGESTED IMPLEMENTATION:
        <div className="text-left mb-24">
          <p data-aos="fade-up" className="text-sm text-primary">
            {cmsContent.subtitle || "Top Rated Products for you"}
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            {cmsContent.title || "Best Products"}
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            {cmsContent.description}
          </p>
        </div>
      */}
      <div className="text-left mb-24">
        <p data-aos="fade-up" className="text-sm text-primary">
          Top Rated Products for you
        </p>
        <h1 data-aos="fade-up" className="text-3xl font-bold">Best Products</h1>
        <p data-aos="fade-up" className="text-xs text-gray-400">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit asperiores modi Sit asperiores modi
        </p>
      </div>

      {/* ================================================================= */}
      {/* PRODUCTS GRID */}
      {/* ================================================================= */}
      {/* 
        TODO: Add animation on product card appear
        TODO: Implement virtual scrolling if many products
        TODO: Add filter/sort options
        
        RESPONSIVE BREAKPOINTS:
        - Mobile: 1 column
        - Tablet: 2 columns
        - Desktop: 3 columns
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 md:gap-5 place-items-center">
        {Object.entries(categories)
          .slice(0, 3)
          .map(([category, product]) => (
            <div key={category} className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px]">
              
              {/* ========================================================= */}
              {/* PRODUCT IMAGE */}
              {/* ========================================================= */}
              {/* 
                TODO: Replace with optimized image component
                CURRENT ISSUES:
                - No lazy loading
                - No WebP format support
                - No responsive srcset
                - No loading placeholder
                
                SUGGESTED IMPLEMENTATION:
                <LazyLoadImage
                  src={`${BASE_URL}${product.image}`}
                  alt={product?.name || "Product Image"}
                  effect="blur"
                  threshold={100}
                  placeholderSrc="/placeholder-product.jpg"
                  srcSet={`
                    ${BASE_URL}${product.image_small} 300w,
                    ${BASE_URL}${product.image_medium} 600w,
                    ${BASE_URL}${product.image_large} 1200w
                  `}
                  sizes="(max-width: 640px) 300px, 600px"
                  className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                  onClick={() => handleProductClick(product.id)}
                />
                
                TODO: Add real-time stock badge overlay
                {inventoryUpdates[product.id] !== undefined && (
                  <StockBadge 
                    stock={inventoryUpdates[product.id]}
                    className="absolute top-2 right-2"
                  />
                )}
              */}
              <div className="h-[100px]">
                <img
                  src={`${BASE_URL}${product.image}`}
                  alt={product?.name || "Product Image"}
                  className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                  onClick={() => handleProductClick(product.id)}
                />
              </div>

              {/* ========================================================= */}
              {/* PRODUCT DETAILS */}
              {/* ========================================================= */}
              <div className="p-4 text-center">
                
                {/* ===================================================== */}
                {/* STAR RATING */}
                {/* ===================================================== */}
                {/* 
                  TODO: Display actual product rating from database
                  CURRENT ISSUE: Hardcoded to always show 4 stars
                  
                  SUGGESTED IMPLEMENTATION:
                  <div className="w-full flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FaStar
                        key={star}
                        className={
                          star <= Math.floor(product.rating)
                            ? 'text-yellow-500'
                            : star - 0.5 <= product.rating
                            ? 'text-yellow-500 half-star'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.review_count})
                    </span>
                  </div>
                  
                  TODO: Make stars clickable to filter by rating
                  TODO: Add microdata for SEO (schema.org)
                  <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                    <meta itemProp="ratingValue" content={product.rating} />
                    <meta itemProp="reviewCount" content={product.review_count} />
                  </div>
                */}
                <div className="w-full flex items-center justify-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                </div>

                {/* ===================================================== */}
                {/* PRODUCT NAME */}
                {/* ===================================================== */}
                {/* 
                  TODO: Add truncation for long product names
                  TODO: Add tooltip on hover to show full name
                  
                  SUGGESTED IMPLEMENTATION:
                  <h1 
                    className="text-xl font-bold truncate"
                    title={product?.name}
                  >
                    {product?.name || "Unknown Product"}
                  </h1>
                */}
                <h1 className="text-xl font-bold">{product?.name || "Unknown Product"}</h1>

                {/* ===================================================== */}
                {/* PRODUCT PRICE */}
                {/* ===================================================== */}
                {/* 
                  TODO: Add original price if on sale
                  TODO: Format price based on currency
                  TODO: Show discount percentage
                  
                  SUGGESTED IMPLEMENTATION:
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-gray-500 group-hover:text-white duration-300 text-sm">
                      ${product?.price?.toFixed(2) || "N/A"}
                    </p>
                    {product.original_price && (
                      <>
                        <p className="text-gray-400 line-through text-xs">
                          ${product.original_price.toFixed(2)}
                        </p>
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                          {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  
                  TODO: Add real-time price updates via WebSocket
                */}
                <p className="text-gray-500 group-hover:text-white duration-300 text-sm">
                  ${product?.price || "N/A"}
                </p>

                {/* ===================================================== */}
                {/* ORDER NOW BUTTON */}
                {/* ===================================================== */}
                {/* 
                  TODO: Add analytics tracking on click
                  TODO: Disable if product out of stock
                  TODO: Show loading state during order processing
                  TODO: Add to cart instead of popup (better UX)
                  
                  SUGGESTED IMPLEMENTATION:
                  <button
                    onClick={() => handleOrderNowClick(product)}
                    disabled={
                      (inventoryUpdates[product.id] || product.stock) === 0
                    }
                    className={`
                      bg-primary hover:scale-105 duration-300 text-white 
                      py-1 px-4 rounded-full mt-4 
                      group-hover:bg-white group-hover:text-primary
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${orderingProductId === product.id ? 'animate-pulse' : ''}
                    `}
                  >
                    {orderingProductId === product.id ? (
                      <span className="flex items-center gap-2">
                        <Spinner size="sm" />
                        Processing...
                      </span>
                    ) : (inventoryUpdates[product.id] || product.stock) === 0 ? (
                      'Out of Stock'
                    ) : (
                      'Order Now'
                    )}
                  </button>
                  
                  TODO: Add "Add to Wishlist" button
                  TODO: Add quick view icon
                */}
                <button
                  className="bg-primary hover:scale-105 duration-300 text-white py-1 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-primary"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* ================================================================= */}
      {/* TODO: ADD AI RECOMMENDATIONS SECTION */}
      {/* ================================================================= */}
      {/* 
        SUGGESTED IMPLEMENTATION:
        {recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recommendedProducts.slice(0, 4).map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product.id)}
                  source="ai_recommendation"
                />
              ))}
            </div>
          </div>
        )}
      */}
    </div>
  </div>
);
};

export default TopProducts;


// =============================================================================
// PERFORMANCE OPTIMIZATION WRAPPER (TODO)
// =============================================================================

/**
 * TODO: Export memoized version
 * 
 * SUGGESTED IMPLEMENTATION:
 * ```
 * import { memo } from 'react'
 * 
 * export default memo(TopProducts, (prevProps, nextProps) => {
 *   return prevProps.handleOrderPopup === nextProps.handleOrderPopup
 * })
 * ```
 */

// =============================================================================
// COMPREHENSIVE DOCUMENTATION
// =============================================================================

/**
 * COMPONENT ARCHITECTURE
 * 
 * DATA FLOW:
 * ```
 * Component Mount
 * ↓
 * useEffect triggered
 * ↓
 * Fetch from API: GET /api/products-by-category/
 * ↓
 * Transform data (limit to 3 categories)
 * ↓
 * Update state: setCategories()
 * ↓
 * Render product cards
 * ↓
 * User Interactions:
 * - Click product image → Navigate to details
 * - Click "Order Now" → Open popup (handleOrderPopup)
 * ```
 * 
 * MICROSERVICES INTEGRATION PLAN:
 * ```
 * TopProducts Component
 * ├── ProductService (Port 8001)
 * │   └── GET /api/v1/products/top
 * │   └── GET /api/v1/products/by-category
 * ├── InventoryService (Port 8002)
 * │   └── WebSocket: /ws/inventory/
 * │   └── GET /api/v1/inventory/stock/{id}
 * ├── RecommendationService (Port 8003)
 * │   └── GET /api/v1/recommendations/{userId}
 * │   └── POST /api/v1/track/view
 * ├── AnalyticsService (Port 8004)
 * │   └── POST /api/v1/track/event
 * │   └── GET /api/v1/metrics/products
 * └── CDN (Cloudflare/Cloudinary)
 *     └── Optimized product images
 * ```
 * 
 * STATE MANAGEMENT PLAN:
 * ```
 * Current (Component State):
 * - categories (object)
 * - loading (boolean)
 * 
 * Planned (Global State - Redux/Zustand):
 * - products (normalized)
 * - inventory (real-time updates)
 * - recommendations (AI-powered)
 * - cart (shopping cart)
 * - user (authentication)
 * ```
 * 
 * PERFORMANCE METRICS TO TRACK:
 * - Time to First Contentful Paint (FCP)
 * - Time to Interactive (TTI)
 * - API response time
 * - Image load time
 * - Component render time
 * - Cache hit rate
 * - WebSocket latency
 * 
 * CACHING STRATEGY:
 * ```
 * Level 1: Browser Cache (Service Worker)
 * - Cache product images (30 days)
 * - Cache API responses (5 minutes)
 * 
 * Level 2: React Query Cache
 * - staleTime: 5 minutes
 * - cacheTime: 10 minutes
 * - Background refetch on mount
 * 
 * Level 3: Backend Redis Cache
 * - Product data: 5 minutes
 * - Category data: 10 minutes
 * - Invalidate on product update
 * 
 * Level 4: CDN Cache (Cloudflare)
 * - Product images: 1 day
 * - Static assets: 1 year
 * ```
 */

/**
 * IMPLEMENTATION PRIORITY ROADMAP
 * 
 * PHASE 1: CRITICAL FIXES & PERFORMANCE (Week 1-2)
 * Priority: URGENT
 * 
 * 1. Replace axios with React Query for caching
 * 2. Add proper loading skeleton (not just "Loading...")
 * 3. Add error handling UI
 * 4. Fix hardcoded star rating (use actual product rating)
 * 5. Implement image lazy loading
 * 6. Add performance monitoring
 * 7. Move BASE_URL to environment variables
 * 
 * Expected Impact:
 * - 60% reduction in unnecessary API calls
 * - 40% faster perceived load time
 * - Better error recovery
 * 
 * PHASE 2: REAL-TIME INVENTORY (Week 3-4)
 * Priority: HIGH
 * 
 * 1. Set up Django Channels for WebSocket
 * 2. Implement inventory WebSocket consumer
 * 3. Add race condition prevention (Redis locks)
 * 4. Create frontend WebSocket hook
 * 5. Display real-time stock updates
 * 6. Add "Low Stock" badges
 * 7. Disable "Order Now" when out of stock
 * 
 * Expected Impact:
 * - Prevent overselling
 * - Better user experience
 * - Reduced customer support tickets
 * 
 * PHASE 3: AI RECOMMENDATIONS (Week 5-7)
 * Priority: HIGH
 * 
 * 1. Build ML recommendation service (Python + scikit-learn)
 * 2. Train collaborative filtering model
 * 3. Create recommendation API endpoints
 * 4. Track user behavior (views, purchases)
 * 5. Display "Recommended for You" section
 * 6. Show "Users who bought X also bought Y"
 * 7. A/B test recommendation effectiveness
 * 
 * Expected Impact:
 * - 20-30% increase in average order value
 * - Better product discovery
 * - Personalized shopping experience
 * 
 * PHASE 4: ANALYTICS DASHBOARD (Week 8-9)
 * Priority: MEDIUM
 * 
 * 1. Track all product view events
 * 2. Track product click events
 * 3. Track "Order Now" clicks
 * 4. Build analytics aggregation service
 * 5. Create admin analytics dashboard
 * 6. Show real-time metrics
 * 7. Display top products charts
 * 
 * Expected Impact:
 * - Data-driven product placement
 * - Understand user behavior
 * - Optimize conversion funnel
 * 
 * PHASE 5: MICROSERVICES ARCHITECTURE (Week 10-14)
 * Priority: MEDIUM
 * 
 * 1. Create API Gateway (Kong/NGINX)
 * 2. Build Product Service (separate repo)
 * 3. Build Inventory Service (separate repo)
 * 4. Build Recommendation Service (separate repo)
 * 5. Build Analytics Service (separate repo)
 * 6. Set up Docker containers
 * 7. Create Kubernetes manifests
 * 8. Implement circuit breaker pattern
 * 9. Add retry logic with exponential backoff
 * 10. Set up monitoring (Prometheus/Grafana)
 * 
 * Expected Impact:
 * - Independent service scaling
 * - Better fault isolation
 * - Easier maintenance
 * - Technology flexibility per service
 * 
 * PHASE 6: ADVANCED OPTIMIZATIONS (Week 15-16)
 * Priority: LOW-MEDIUM
 * 
 * 1. Implement Redis caching on backend
 * 2. Set up CDN for images (Cloudinary)
 * 3. Add service worker for offline support
 * 4. Implement virtual scrolling
 * 5. Add bundle size optimization
 * 6. Implement code splitting
 * 7. Add performance benchmarks
 * 8. Set up Lighthouse CI
 * 
 * Expected Impact:
 * - 50% faster API responses
 * - 70% faster image loads
 * - Offline functionality
 * - Smaller bundle size
 */

/**
 * FILES TO CREATE
 * 
 * Backend (Python/Django):
 * ├── services/
 * │   ├── product-service/
 * │   │   ├── views.py
 * │   │   ├── serializers.py
 * │   │   └── urls.py
 * │   ├── inventory-service/
 * │   │   ├── consumers.py (WebSocket)
 * │   │   ├── inventory_lock.py
 * │   │   └── tasks.py (Celery)
 * │   ├── recommendation-service/
 * │   │   ├── recommendation_engine.py
 * │   │   ├── collaborative_filter.py
 * │   │   └── api.py (Flask/FastAPI)
 * │   └── analytics-service/
 * │       ├── event_tracker.py
 * │       ├── aggregator.py
 * │       └── metrics.py
 * 
 * Frontend (React):
 * ├── hooks/
 * │   ├── useTopProducts.js (React Query)
 * │   ├── useInventoryWebSocket.js
 * │   ├── useRecommendations.js
 * │   └── useAnalytics.js
 * ├── services/
 * │   ├── microservices/
 * │   │   ├── APIGateway.js
 * │   │   ├── ProductService.js
 * │   │   ├── InventoryService.js
 * │   │   ├── RecommendationService.js
 * │   │   └── AnalyticsService.js
 * │   └── cache/
 * │       └── CacheService.js
 * ├── components/
 * │   ├── AI/
 * │   │   ├── PersonalizedRecommendations.jsx
 * │   │   └── SimilarProducts.jsx
 * │   ├── Inventory/
 * │   │   ├── StockBadge.jsx
 * │   │   └── LowStockAlert.jsx
 * │   └── Skeletons/
 * │       ├── ProductCardSkeleton.jsx
 * │       └── ProductsSkeleton.jsx
 * 
 * DevOps:
 * ├── docker-compose.yml
 * ├── Dockerfile (per service)
 * ├── kubernetes/
 * │   ├── product-service.yaml
 * │   ├── inventory-service.yaml
 * │   └── ingress.yaml
 * └── nginx/
 *     └── api-gateway.conf
 */
