// NEXUS AXION - 100% PURE JAVASCRIPT
// Frontend Essence → Backend Environment
// Zero External Dependencies - Pure Node.js

const http = require('http');

// ===== NEXUS AXION CORE - PURE IMPLEMENTATION =====

// Global Application State (React-like but server-native)
const appState = {
  data: {
    users: [
      { id: '1', name: 'Alice', email: 'alice@example.com', created: Date.now() },
      { id: '2', name: 'Bob', email: 'bob@example.com', created: Date.now() }
    ],
    posts: [],
    stats: { visits: 0, lastAccess: null }
  },
  
  // React-like setState
  setState(updater) {
    if (typeof updater === 'function') {
      this.data = { ...this.data, ...updater(this.data) };
    } else {
      this.data = { ...this.data, ...updater };
    }
    this.notify();
  },
  
  // React-like state subscription
  subscribers: [],
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) this.subscribers.splice(index, 1);
    };
  },
  
  notify() {
    this.subscribers.forEach(callback => callback(this.data));
  }
};

// Event System (DOM-like but server-native)
const events = {
  listeners: {},
  
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },
  
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
};

// Component System (React-like but server-native)
function createComponent(name, props = {}) {
  return {
    name,
    props,
    state: { ...appState.data },
    
    render() {
      return {
        component: this.name,
        props: this.props,
        state: this.state,
        timestamp: Date.now()
      };
    }
  };
}

// Simple Router (React Router-like but server-native)
const router = {
  routes: {},
  
  get(path, handler) {
    this.routes[`GET:${path}`] = handler;
  },
  
  post(path, handler) {
    this.routes[`POST:${path}`] = handler;
  },
  
  match(method, url) {
    // Simple exact match
    const key = `${method}:${url}`;
    if (this.routes[key]) return this.routes[key];
    
    // Dynamic routes (/api/users/:id)
    for (const route in this.routes) {
      const [routeMethod, routePath] = route.split(':');
      if (routeMethod !== method) continue;
      
      const routeParts = routePath.split('/');
      const urlParts = url.split('/');
      
      if (routeParts.length !== urlParts.length) continue;
      
      const params = {};
      let match = true;
      
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].slice(1)] = urlParts[i];
        } else if (routeParts[i] !== urlParts[i]) {
          match = false;
          break;
        }
      }
      
      if (match) return (req, res) => this.routes[route](req, res, params);
    }
    
    return null;
  }
};

// ===== EVENT HANDLERS (React-like event handling) =====

events.on('user:created', (userData) => {
  console.log('Event: New user created', userData.name);
  appState.setState(state => ({
    users: [...state.users, userData],
    stats: { ...state.stats, lastAccess: Date.now() }
  }));
});

events.on('page:visit', (data) => {
  appState.setState(state => ({
    stats: { 
      visits: state.stats.visits + 1, 
      lastAccess: Date.now() 
    }
  }));
});

// ===== ROUTES (Frontend-like component rendering) =====

// Home route - renders component server-side
router.get('/', (req, res) => {
  events.emit('page:visit', { path: '/', timestamp: Date.now() });
  
  const dashboard = createComponent('Dashboard', { 
    title: 'NEXUS AXION Demo',
    version: '1.0' 
  });
  
  const rendered = dashboard.render();
  
  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end(JSON.stringify({
    message: 'NEXUS AXION - Frontend Essence in Backend',
    architecture: 'Pure JavaScript - Zero Dependencies',
    component: rendered,
    essence: 'Frontend thinking patterns server-side',
    deployment: 'Universal compatibility'
  }));
});

// API - Get current state
router.get('/api/state', (req, res) => {
  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end(JSON.stringify({
    currentState: appState.data,
    timestamp: Date.now(),
    architecture: 'Reactive state management server-side'
  }));
});

// API - Create user
router.post('/api/users', (req, res) => {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    try {
      const userData = JSON.parse(body || '{}');
      const newUser = {
        id: Date.now().toString(),
        name: userData.name || 'Anonymous',
        email: userData.email || `user${Date.now()}@example.com`,
        created: Date.now()
      };
      
      // Emit event (like React synthetic events)
      events.emit('user:created', newUser);
      
      res.writeHead(201, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      
      res.end(JSON.stringify({
        success: true,
        user: newUser,
        totalUsers: appState.data.users.length
      }));
      
    } catch (error) {
      res.writeHead(400, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
});

// API - Get specific user
router.get('/api/users/:id', (req, res, params) => {
  const user = appState.data.users.find(u => u.id === params.id);
  
  res.writeHead(user ? 200 : 404, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end(JSON.stringify(
    user ? { user } : { error: 'User not found' }
  ));
});

// Health check
router.get('/health', (req, res) => {
  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end(JSON.stringify({
    status: 'healthy',
    architecture: 'NEXUS AXION',
    concept: 'Frontend essence absorbed in backend',
    implementation: '100% Pure JavaScript',
    dependencies: 'Zero external dependencies',
    uptime: process.uptime(),
    memory: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB'
  }));
});

// ===== HTTP SERVER =====

const server = http.createServer((req, res) => {
  // Parse URL manually (no url.parse deprecation)
  const urlParts = req.url.split('?');
  const pathname = urlParts[0];
  
  console.log(`${req.method} ${pathname} - ${new Date().toISOString()}`);
  
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }
  
  // Route matching
  const handler = router.match(req.method, pathname);
  
  if (handler) {
    try {
      handler(req, res);
    } catch (error) {
      console.error('Route error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Route not found',
      availableRoutes: Object.keys(router.routes)
    }));
  }
});

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`NEXUS AXION Server running on port ${PORT}`);
  console.log(`Architecture: Frontend Essence → Backend Environment`);
  console.log(`Implementation: 100% Pure JavaScript`);
  console.log(`Dependencies: Zero external libraries`);
  console.log(`Concept: Unified logic layer without frontend/backend separation`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = { server, appState, events, router };