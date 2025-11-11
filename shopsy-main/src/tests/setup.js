import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Mock environment variables
process.env.REACT_APP_API_BASE_URL = 'http://localhost:8000';
process.env.REACT_APP_ENABLE_DEBUG_LOGS = 'true';

// Mock fetch API
global.fetch = jest.fn();

// Mock EventSource for SSE testing
class MockEventSource {
  constructor(url) {
    this.url = url;
    this.handlers = {};
  }

  addEventListener(event, handler) {
    this.handlers[event] = handler;
  }

  close() {}
}

global.EventSource = MockEventSource;
