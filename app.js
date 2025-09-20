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

// Home route - renders HTML interface server-side
router.get('/', (req, res) => {
  events.emit('page:visit', { path: '/', timestamp: Date.now() });
  
  const state = appState.data;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEXUS AXION - Frontend Essence in Backend</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        h1 {
            font-size: 2.5em;
            margin: 0;
            background: linear-gradient(45deg, #fff, #ffd700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
            margin-top: 10px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: rgba(255,255,255,0.2);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.3);
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #ffd700;
        }
        .users-list {
            background: rgba(255,255,255,0.2);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
        }
        .user {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            margin-bottom: 10px;
            border-left: 4px solid #ffd700;
        }
        .user:last-child {
            margin-bottom: 0;
        }
        .architecture-info {
            background: rgba(255,255,255,0.2);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
        }
        .feature {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
        .feature::before {
            content: "✨";
            margin-right: 10px;
        }
        .api-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .api-link {
            background: rgba(255,255,255,0.2);
            padding: 15px;
            border-radius: 10px;
            text-decoration: none;
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.3s ease;
        }
        .api-link:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        .btn {
            background: linear-gradient(45deg, #ffd700, #ffed4a);
            color: #333;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            margin: 5px;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: scale(1.05);
        }
        @media (max-width: 768px) {
            .container { padding: 20px; }
            h1 { font-size: 2em; }
            .stats { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌌 NEXUS AXION</h1>
            <p class="subtitle">Frontend Essence Absorbed in Backend Environment</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${state.users.length}</div>
                <div>Total Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${state.stats.visits}</div>
                <div>Page Visits</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB</div>
                <div>Memory Usage</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${Math.round(process.uptime())}s</div>
                <div>Uptime</div>
            </div>
        </div>

        <div class="users-list">
            <h3>👥 Current Users</h3>
            ${state.users.map(user => `
                <div class="user">
                    <div>
                        <strong>${user.name}</strong><br>
                        <small>${user.email}</small>
                    </div>
                    <div>
                        <small>ID: ${user.id}</small>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="architecture-info">
            <h3>🏗️ Architecture NEXUS AXION</h3>
            <div class="feature">Pure JavaScript - Zero Dependencies</div>
            <div class="feature">Frontend State Management Server-Side</div>
            <div class="feature">React-like Components in Backend</div>
            <div class="feature">Event-Driven Architecture</div>
            <div class="feature">Universal Deployment Compatibility</div>
        </div>

        <div class="api-links">
            <a href="/api/state" class="api-link">
                <strong>📊 API State</strong><br>
                <small>View current application state</small>
            </a>
            <a href="/health" class="api-link">
                <strong>❤️ Health Check</strong><br>
                <small>System health and metrics</small>
            </a>
            <a href="/api/users/1" class="api-link">
                <strong>👤 User API</strong><br>
                <small>Get specific user data</small>
            </a>
        </div>

        <div style="text-align: center; margin-top: 30px; opacity: 0.8;">
            <p>Concept: Single codebase thinking with frontend patterns, deployed on backend infrastructure</p>
            <p>Last Update: ${new Date(state.stats.lastAccess || Date.now()).toLocaleString()}</p>
        </div>
    </div>

    <script>
        // Pure JavaScript frontend functionality (no external deps)
        console.log('NEXUS AXION: Frontend essence running in browser');
        console.log('Backend-generated page with frontend interactivity');
        
        // Auto-refresh stats every 10 seconds
        setInterval(() => {
            fetch('/api/state')
                .then(r => r.json())
                .then(data => {
                    console.log('State updated:', data);
                    // Could update DOM here for real-time updates
                });
        }, 10000);
    </script>
</body>
</html>`;
  
  res.writeHead(200, { 
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end(html);
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