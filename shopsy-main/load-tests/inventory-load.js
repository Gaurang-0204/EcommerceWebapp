import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },    // Ramp up to 50 users
    { duration: '1m30s', target: 50 },  // Stay at 50
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% of requests < 500ms
    http_req_failed: ['rate<0.1'],      // Error rate < 10%
  },
};

export default function () {
  const BASE_URL = 'http://localhost:8000/api/v1';

  group('Product List', () => {
    const res = http.get(`${BASE_URL}/products/`);
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
  });

  group('Inventory Check', () => {
    const res = http.get(`${BASE_URL}/inventory/check_stock/?product_ids=prod-1`);
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
  });

  group('SSE Stream', () => {
    const res = http.get(`${BASE_URL}/events/inventory/?product_id=prod-1`, {
      timeout: '5s',
    });
    check(res, {
      'status is 200': (r) => r.status === 200,
      'content type is event-stream': (r) => r.headers['Content-Type'].includes('text/event-stream'),
    });
  });

  sleep(1);
}
