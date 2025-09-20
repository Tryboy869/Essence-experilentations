
// NEXUS AXION - PROTOTYPE COMPLET
// Architecture Frontend Essence → Backend Environment
// Pure JavaScript - Minimal Dependencies

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// ===== NEXUS AXION CORE - FRONTEND ESSENCE ABSORBED =====

// PRIMITIVE 1: Server-Side Reactive State (React-like state management)
class NexusReactiveState {
    constructor(initialState = {}) {
        this.state = { ...initialState };
        this.subscribers = new Set();
        this.history = [];
        this.maxHistory = 50;
    }
    
    setState(updater) {
        const prevState = { ...this.state };
        
        if (typeof updater === 'function') {
            this.state = { ...this.state, ...updater(this.state) };
        } else {
            this.state = { ...this.state, ...updater };
        }
        
        // History tracking (Redux DevTools-like)
        this.history.push({
            timestamp: Date.now(),
            prevState,
            nextState: { ...this.state },
            action: typeof updater === 'function' ? 'FUNCTION_UPDATE' : 'OBJECT_UPDATE'
        });
        
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        
        // Reactive propagation
        this.notifySubscribers(prevState, this.state);
        return this.state;
    }
    
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    
    notifySubscribers(prev, next) {
        this.subscribers.forEach(callback => {
            try {
                callback(next, prev);
            } catch (error) {
                console.error('Subscriber error:', error);
            }
        });
    }
    
    getState() {
        return { ...this.state };
    }
    
    getHistory() {
        return [...this.history];
    }
}

// PRIMITIVE 2: Server-Side Component System (React-like components)
class NexusComponent {
    constructor(props = {}) {
        this.props = { ...props };
        this.state = new NexusReactiveState();
        this.effects = [];
        this.mounted = false;
        this.id = Math.random().toString(36).substr(2, 9);
    }
    
    mount() {
        this.mounted = true;
        this.componentDidMount && this.componentDidMount();
        this.runEffects();
        return this;
    }
    
    unmount() {
        this.mounted = false;
        this.componentWillUnmount && this.componentWillUnmount();
        this.cleanupEffects();
    }
    
    useEffect(effect, dependencies = []) {
        this.effects.push({ 
            effect, 
            dependencies: [...dependencies], 
            cleanup: null,
            hasRun: false
        });
    }
    
    runEffects() {
        this.effects.forEach((effectObj) => {
            if (!effectObj.hasRun) {
                const cleanup = effectObj.effect();
                effectObj.cleanup = typeof cleanup === 'function' ? cleanup : null;
                effectObj.hasRun = true;
            }
        });
    }
    
    cleanupEffects() {
        this.effects.forEach(({ cleanup }) => {
            if (cleanup) cleanup();
        });
        this.effects = [];
    }
    
    // Virtual rendering system (JSX-like but server-native)
    render() {
        return {
            type: 'component',
            id: this.id,
            props: this.props,
            state: this.state.getState(),
            mounted: this.mounted
        };
    }
}

// PRIMITIVE 3: Server-Side Event System (DOM-like events)
class NexusEventSystem {
    constructor() {
        this.events = new Map();
        this.middlewares = [];
        this.globalHandlers = new Set();
    }
    
    use(middleware) {
        this.middlewares.push(middleware);
    }
    
    on(eventType, handler, options = {}) {
        if (!this.events.has(eventType)) {
            this.events.set(eventType, new Set());
        }
        this.events.get(eventType).add({ handler, options, id: Math.random().toString(36) });
    }
    
    off(eventType, handler) {
        const handlers = this.events.get(eventType);
        if (handlers) {
            handlers.forEach(h => {
                if (h.handler === handler) {
                    handlers.delete(h);
                }
            });
        }
    }
    
    emit(eventType, eventData = {}) {
        const event = {
            type: eventType,
            data: eventData,
            timestamp: Date.now(),
            id: Math.random().toString(36),
            defaultPrevented: false,
            propagationStopped: false,
            preventDefault() { this.defaultPrevented = true; },
            stopPropagation() { this.propagationStopped = true; }
        };
        
        // Apply middlewares
        let processedEvent = event;
        for (const middleware of this.middlewares) {
            processedEvent = middleware(processedEvent) || processedEvent;
        }
        
        // Execute specific handlers
        const handlers = this.events.get(eventType);
        if (handlers) {
            handlers.forEach(({ handler, options }) => {
                if (!processedEvent.propagationStopped) {
                    try {
                        handler(processedEvent);
                    } catch (error) {
                        console.error(`Event handler error for ${eventType}:`, error);
                    }
                }
            });
        }
        
        // Execute global handlers
        this.globalHandlers.forEach(handler => {
            try {
                handler(processedEvent);
            } catch (error) {
                console.error('Global event handler error:', error);
            }
        });
        
        return !processedEvent.defaultPrevented;
    }
    
    onAny(handler) {
        this.globalHandlers.add(handler);
    }
}

// PRIMITIVE 4: Server-Side Router (React Router-like)
class NexusRouter {
    constructor() {
        this.routes = new Map();
        this.middlewares = [];
        this.currentRoute = '/';
    }
    
    use(middleware) {
        this.middlewares.push(middleware);
    }
    
    route(path, handler, method = 'GET') {
        const key = `${method}:${path}`;
        this.routes.set(key, { handler, path, method });
    }
    
    get(path, handler) { this.route(path, handler, 'GET'); }
    post(path, handler) { this.route(path, handler, 'POST'); }
    put(path, handler) { this.route(path, handler, 'PUT'); }
    delete(path, handler) { this.route(path, handler, 'DELETE'); }
    
    match(pathname, method = 'GET') {
        const key = `${method}:${pathname}`;
        
        // Exact match first
        if (this.routes.has(key)) {
            return { handler: this.routes.get(key).handler, params: {} };
        }
        
        // Pattern matching for dynamic routes
        for (const [routeKey, route] of this.routes) {
            if (route.method !== method) continue;
            
            const routePattern = route.path.replace(/:\w+/g, '([^/]+)');
            const regex = new RegExp(`^${routePattern}$`);
            const match = pathname.match(regex);
            
            if (match) {
                const params = {};
                const paramNames = route.path.match(/:(\w+)/g);
                if (paramNames) {
                    paramNames.forEach((param, index) => {
                        params[param.slice(1)] = match[index + 1];
                    });
                }
                return { handler: route.handler, params };
            }
        }
        
        return null;
    }
    
    async handle(pathname, method, req, res) {
        const route = this.match(pathname, method);
        if (!route) {
            return this.notFound(req, res);
        }
        
        // Apply middlewares
        for (const middleware of this.middlewares) {
            const result = await middleware(req, res);
            if (result === false) return;
        }
        
        // Execute handler
        req.params = route.params;
        return await route.handler(req, res);
    }
    
    notFound(req, res) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error: 'Route not found',
            path: req.url,
            method: req.method
        }));
    }
}

// ===== APPLICATION NEXUS AXION =====

// Global application state (Redux-like store)
const appState = new NexusReactiveState({
    users: [],
    posts: [],
    currentUser: null,
    stats: {
        totalVisits: 0,
        activeUsers: 0,
        lastActivity: null
    }
});

// Global event system
const events = new NexusEventSystem();

// Router
const router = new NexusRouter();

// Example Components using NEXUS AXION architecture
class UserDashboard extends NexusComponent {
    componentDidMount() {
        console.log(`UserDashboard ${this.id} mounted`);
        
        // Subscribe to state changes (like React useEffect)
        this.stateUnsubscribe = appState.subscribe((newState, prevState) => {
            if (newState.users.length !== prevState.users.length) {
                events.emit('dashboard:usersChanged', { 
                    count: newState.users.length 
                });
            }
        });
        
        // Simulate data fetching
        this.useEffect(() => {
            const interval = setInterval(() => {
                if (this.mounted) {
                    events.emit('dashboard:tick', { timestamp: Date.now() });
                }
            }, 5000);
            
            return () => clearInterval(interval);
        }, []);
    }
    
    componentWillUnmount() {
        if (this.stateUnsubscribe) {
            this.stateUnsubscribe();
        }
        console.log(`UserDashboard ${this.id} unmounted`);
    }
    
    render() {
        const state = appState.getState();
        return {
            type: 'dashboard',
            id: this.id,
            data: {
                users: state.users,
                stats: state.stats,
                timestamp: Date.now()
            },
            actions: ['refresh', 'export', 'addUser'],
            status: 'active'
        };
    }
}

// Event handlers (like React event handlers but server-side)
events.on('user:created', (event) => {
    console.log('New user created:', event.data);
    appState.setState(state => ({
        users: [...state.users, event.data],
        stats: {
            ...state.stats,
            lastActivity: Date.now()
        }
    }));
});

events.on('dashboard:tick', (event) => {
    console.log('Dashboard tick:', new Date(event.data.timestamp).toISOString());
});

// Middleware for logging (Express-like middleware)
router.use(async (req, res) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    appState.setState(state => ({
        stats: {
            ...state.stats,
            totalVisits: state.stats.totalVisits + 1,
            lastActivity: Date.now()
        }
    }));
    return true;
});

// Routes using NEXUS AXION architecture
router.get('/', async (req, res) => {
    const dashboard = new UserDashboard().mount();
    const rendered = dashboard.render();
    
    res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    
    res.end(JSON.stringify({
        message: 'NEXUS AXION - Frontend Essence in Backend Environment',
        architecture: 'unified',
        component: rendered,
        serverTime: new Date().toISOString()
    }));
    
    dashboard.unmount();
});

router.get('/api/state', async (req, res) => {
    res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    
    res.end(JSON.stringify({
        currentState: appState.getState(),
        stateHistory: appState.getHistory().slice(-5), // Last 5 state changes
        timestamp: Date.now()
    }));
});

router.post('/api/users', async (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            const userData = JSON.parse(body || '{}');
            const newUser = {
                id: Math.random().toString(36),
                name: userData.name || 'Anonymous',
                email: userData.email || `user${Date.now()}@example.com`,
                createdAt: Date.now()
            };
            
            // Emit event (like React synthetic events)
            events.emit('user:created', { data: newUser, source: 'api' });
            
            res.writeHead(201, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            
            res.end(JSON.stringify({
                success: true,
                user: newUser,
                totalUsers: appState.getState().users.length
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

router.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = appState.getState().users.find(u => u.id === id);
    
    res.writeHead(user ? 200 : 404, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    
    res.end(JSON.stringify(user ? { user } : { error: 'User not found' }));
});

// Health check endpoint
router.get('/health', async (req, res) => {
    res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    
    res.end(JSON.stringify({
        status: 'healthy',
        architecture: 'NEXUS AXION',
        essence: 'Frontend absorbed in Backend',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: Date.now()
    }));
});

// OPTIONS handler for CORS
router.route('/*', async (req, res) => {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
}, 'OPTIONS');

// Create HTTP server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    try {
        await router.handle(pathname, req.method, req, res);
    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error: 'Internal server error',
            message: error.message
        }));
    }
});

// Initialize with some demo data
appState.setState({
    users: [
        { id: '1', name: 'Alice', email: 'alice@example.com', createdAt: Date.now() - 86400000 },
        { id: '2', name: 'Bob', email: 'bob@example.com', createdAt: Date.now() - 43200000 }
    ]
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 NEXUS AXION Server running on port ${PORT}`);
    console.log(`📊 Architecture: Frontend Essence → Backend Environment`);
    console.log(`🔗 Access: http://localhost:${PORT}`);
    console.log(`💡 Concept: Single codebase with frontend thinking patterns`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = { server, appState, events, router };