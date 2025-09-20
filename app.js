// NEXUS AXION - API AS COMPONENTS ARCHITECTURE
// Auto-generation of UI components from API endpoints
// Pure JavaScript - Zero external dependencies

const http = require('http');

// ===== CORE NEXUS SYSTEM - API ESSENCE ABSORBED =====

// API Schema Definition System
class APISchema {
    constructor(method, path, config = {}) {
        this.method = method.toUpperCase();
        this.path = path;
        this.params = this.extractParams(path);
        this.body = config.body || null;
        this.response = config.response || null;
        this.validation = config.validation || {};
        this.meta = config.meta || {};
    }
    
    extractParams(path) {
        const params = [];
        const matches = path.match(/:(\w+)/g);
        if (matches) {
            matches.forEach(match => {
                params.push(match.slice(1));
            });
        }
        return params;
    }
    
    generateId() {
        return `${this.method}_${this.path.replace(/[/:]/g, '_')}`;
    }
}

// Component Auto-Generator from API
class APIComponentGenerator {
    constructor() {
        this.components = new Map();
        this.schemas = new Map();
    }
    
    // Define API endpoint and auto-generate component
    defineAPI(method, path, config = {}) {
        const schema = new APISchema(method, path, config);
        const componentId = schema.generateId();
        
        this.schemas.set(componentId, schema);
        
        // Auto-generate component based on HTTP method
        let component;
        switch (method.toUpperCase()) {
            case 'GET':
                component = this.generateDisplayComponent(schema);
                break;
            case 'POST':
                component = this.generateFormComponent(schema);
                break;
            case 'PUT':
                component = this.generateEditComponent(schema);
                break;
            case 'DELETE':
                component = this.generateDeleteComponent(schema);
                break;
            default:
                component = this.generateGenericComponent(schema);
        }
        
        this.components.set(componentId, component);
        return component;
    }
    
    // GET endpoint → Display component with loading/error states
    generateDisplayComponent(schema) {
        return {
            type: 'display',
            schema: schema,
            state: {
                data: null,
                loading: false,
                error: null
            },
            
            async fetch(params = {}) {
                this.state.loading = true;
                this.state.error = null;
                
                try {
                    let url = schema.path;
                    // Replace path parameters
                    schema.params.forEach(param => {
                        if (params[param]) {
                            url = url.replace(`:${param}`, params[param]);
                        }
                    });
                    
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    this.state.data = await response.json();
                    this.state.loading = false;
                    
                    return this.render();
                } catch (error) {
                    this.state.error = error.message;
                    this.state.loading = false;
                    return this.render();
                }
            },
            
            render() {
                if (this.state.loading) {
                    return this.renderLoading();
                }
                if (this.state.error) {
                    return this.renderError();
                }
                if (this.state.data) {
                    return this.renderData();
                }
                return this.renderEmpty();
            },
            
            renderLoading() {
                return `
                    <div class="api-component loading" data-endpoint="${schema.method} ${schema.path}">
                        <div class="spinner"></div>
                        <p>Loading ${schema.path}...</p>
                    </div>
                `;
            },
            
            renderError() {
                return `
                    <div class="api-component error" data-endpoint="${schema.method} ${schema.path}">
                        <div class="error-icon">⚠️</div>
                        <p>Error: ${this.state.error}</p>
                        <button onclick="this.parentElement.component.fetch()">Retry</button>
                    </div>
                `;
            },
            
            renderData() {
                const data = this.state.data;
                let content = '';
                
                if (Array.isArray(data)) {
                    content = `
                        <div class="data-list">
                            ${data.map(item => `
                                <div class="data-item">
                                    ${this.renderObject(item)}
                                </div>
                            `).join('')}
                        </div>
                    `;
                } else {
                    content = this.renderObject(data);
                }
                
                return `
                    <div class="api-component success" data-endpoint="${schema.method} ${schema.path}">
                        <div class="component-header">
                            <h3>${schema.method} ${schema.path}</h3>
                            <button onclick="this.closest('.api-component').component.fetch()">🔄</button>
                        </div>
                        ${content}
                    </div>
                `;
            },
            
            renderObject(obj) {
                return `
                    <div class="object-display">
                        ${Object.entries(obj).map(([key, value]) => `
                            <div class="field">
                                <span class="key">${key}:</span>
                                <span class="value">${typeof value === 'object' ? JSON.stringify(value) : value}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            },
            
            renderEmpty() {
                return `
                    <div class="api-component empty" data-endpoint="${schema.method} ${schema.path}">
                        <p>No data available</p>
                        <button onclick="this.parentElement.component.fetch()">Load Data</button>
                    </div>
                `;
            }
        };
    }
    
    // POST endpoint → Form component with validation
    generateFormComponent(schema) {
        return {
            type: 'form',
            schema: schema,
            state: {
                formData: {},
                submitting: false,
                success: false,
                error: null
            },
            
            async submit(formData) {
                this.state.submitting = true;
                this.state.error = null;
                this.state.success = false;
                
                try {
                    const response = await fetch(schema.path, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    const result = await response.json();
                    this.state.success = true;
                    this.state.submitting = false;
                    this.state.formData = {};
                    
                    return this.render();
                } catch (error) {
                    this.state.error = error.message;
                    this.state.submitting = false;
                    return this.render();
                }
            },
            
            render() {
                const fields = this.generateFields();
                
                return `
                    <div class="api-component form" data-endpoint="${schema.method} ${schema.path}">
                        <div class="component-header">
                            <h3>Create ${schema.path.split('/').pop()}</h3>
                        </div>
                        
                        ${this.state.success ? `
                            <div class="success-message">
                                ✅ Successfully created!
                            </div>
                        ` : ''}
                        
                        ${this.state.error ? `
                            <div class="error-message">
                                ⚠️ ${this.state.error}
                            </div>
                        ` : ''}
                        
                        <form class="api-form" onsubmit="return this.closest('.api-component').component.handleSubmit(event)">
                            ${fields}
                            <div class="form-actions">
                                <button type="submit" ${this.state.submitting ? 'disabled' : ''}>
                                    ${this.state.submitting ? 'Creating...' : 'Create'}
                                </button>
                                <button type="reset">Clear</button>
                            </div>
                        </form>
                    </div>
                `;
            },
            
            generateFields() {
                // Auto-generate form fields based on schema or common patterns
                const resource = schema.path.split('/').pop();
                
                // Common fields for different resources
                const fieldTemplates = {
                    users: ['name', 'email', 'role'],
                    posts: ['title', 'content', 'tags'],
                    products: ['name', 'price', 'description'],
                    default: ['name', 'description']
                };
                
                const fields = fieldTemplates[resource] || fieldTemplates.default;
                
                return fields.map(field => `
                    <div class="form-field">
                        <label for="${field}">${field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input 
                            type="${field === 'email' ? 'email' : field === 'price' ? 'number' : 'text'}"
                            id="${field}"
                            name="${field}"
                            required
                            ${field === 'content' || field === 'description' ? 'placeholder="Enter detailed information..."' : ''}
                        />
                    </div>
                `).join('');
            },
            
            handleSubmit(event) {
                event.preventDefault();
                const formData = new FormData(event.target);
                const data = Object.fromEntries(formData);
                this.submit(data);
                return false;
            }
        };
    }
    
    // DELETE endpoint → Confirmation component
    generateDeleteComponent(schema) {
        return {
            type: 'delete',
            schema: schema,
            state: {
                confirming: false,
                deleting: false,
                success: false,
                error: null
            },
            
            async delete(params = {}) {
                this.state.deleting = true;
                this.state.error = null;
                
                try {
                    let url = schema.path;
                    schema.params.forEach(param => {
                        if (params[param]) {
                            url = url.replace(`:${param}`, params[param]);
                        }
                    });
                    
                    const response = await fetch(url, { method: 'DELETE' });
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    this.state.success = true;
                    this.state.deleting = false;
                    this.state.confirming = false;
                    
                    return this.render();
                } catch (error) {
                    this.state.error = error.message;
                    this.state.deleting = false;
                    return this.render();
                }
            },
            
            render() {
                if (this.state.success) {
                    return `
                        <div class="api-component delete success" data-endpoint="${schema.method} ${schema.path}">
                            <div class="success-message">
                                ✅ Successfully deleted!
                            </div>
                        </div>
                    `;
                }
                
                return `
                    <div class="api-component delete" data-endpoint="${schema.method} ${schema.path}">
                        ${this.state.error ? `
                            <div class="error-message">⚠️ ${this.state.error}</div>
                        ` : ''}
                        
                        ${this.state.confirming ? `
                            <div class="confirmation-dialog">
                                <p>Are you sure you want to delete this item?</p>
                                <div class="confirmation-actions">
                                    <button 
                                        class="danger" 
                                        onclick="this.closest('.api-component').component.confirmDelete()"
                                        ${this.state.deleting ? 'disabled' : ''}
                                    >
                                        ${this.state.deleting ? 'Deleting...' : 'Yes, Delete'}
                                    </button>
                                    <button onclick="this.closest('.api-component').component.cancelDelete()">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ` : `
                            <button 
                                class="danger" 
                                onclick="this.closest('.api-component').component.startDelete()"
                            >
                                🗑️ Delete
                            </button>
                        `}
                    </div>
                `;
            },
            
            startDelete() {
                this.state.confirming = true;
                this.updateDOM();
            },
            
            cancelDelete() {
                this.state.confirming = false;
                this.updateDOM();
            },
            
            confirmDelete(params) {
                this.delete(params);
            },
            
            updateDOM() {
                // Re-render component in place
                const element = document.querySelector(`[data-endpoint="${schema.method} ${schema.path}"]`);
                if (element) {
                    element.outerHTML = this.render();
                    this.attachToDOM();
                }
            }
        };
    }
    
    generateGenericComponent(schema) {
        return {
            type: 'generic',
            schema: schema,
            render() {
                return `
                    <div class="api-component generic" data-endpoint="${schema.method} ${schema.path}">
                        <h3>${schema.method} ${schema.path}</h3>
                        <p>Generic API component</p>
                        <pre>${JSON.stringify(schema, null, 2)}</pre>
                    </div>
                `;
            }
        };
    }
    
    // Get component by endpoint
    getComponent(method, path) {
        const id = `${method.toUpperCase()}_${path.replace(/[/:]/g, '_')}`;
        return this.components.get(id);
    }
    
    // Render all components as HTML page
    renderAllComponents() {
        const componentsHTML = Array.from(this.components.values())
            .map(component => component.render())
            .join('\n');
            
        return componentsHTML;
    }
}

// ===== APPLICATION SETUP =====

// Initialize the API-to-Components system
const apiSystem = new APIComponentGenerator();

// Define your APIs - components auto-generate
const userListComponent = apiSystem.defineAPI('GET', '/api/users', {
    response: { type: 'array', items: { id: 'number', name: 'string', email: 'string' } }
});

const userDetailComponent = apiSystem.defineAPI('GET', '/api/users/:id', {
    response: { id: 'number', name: 'string', email: 'string', created: 'date' }
});

const createUserComponent = apiSystem.defineAPI('POST', '/api/users', {
    body: { name: 'string', email: 'string' },
    response: { id: 'number', name: 'string', email: 'string', created: 'date' }
});

const deleteUserComponent = apiSystem.defineAPI('DELETE', '/api/users/:id');

// Mock data store
const dataStore = {
    users: [
        { id: 1, name: 'Alice', email: 'alice@example.com', created: Date.now() },
        { id: 2, name: 'Bob', email: 'bob@example.com', created: Date.now() }
    ],
    nextId: 3
};

// ===== HTTP SERVER =====

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    
    console.log(`${method} ${url}`);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Main page - render all auto-generated components
    if (url === '/') {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>NEXUS AXION - API as Components</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        h1 {
            font-size: 3em;
            margin: 0;
            background: linear-gradient(45deg, #fff, #ffd700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
            margin-top: 10px;
        }
        .api-component {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .component-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .api-form {
            display: grid;
            gap: 15px;
        }
        .form-field {
            display: flex;
            flex-direction: column;
        }
        .form-field label {
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-field input {
            padding: 10px;
            border: none;
            border-radius: 5px;
            background: rgba(255,255,255,0.2);
            color: white;
        }
        .form-field input::placeholder {
            color: rgba(255,255,255,0.6);
        }
        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
        }
        button:hover {
            transform: scale(1.05);
        }
        button[type="submit"] {
            background: #4CAF50;
            color: white;
        }
        button.danger {
            background: #f44336;
            color: white;
        }
        .success-message {
            background: #4CAF50;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        .error-message {
            background: #f44336;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        .data-list {
            display: grid;
            gap: 10px;
        }
        .data-item {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
        }
        .object-display {
            display: grid;
            gap: 8px;
        }
        .field {
            display: flex;
            justify-content: space-between;
        }
        .key {
            font-weight: bold;
            color: #ffd700;
        }
        .loading {
            text-align: center;
            padding: 40px;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid #ffd700;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔮 NEXUS AXION</h1>
            <p class="subtitle">API as Components - Auto-Generated UI</p>
        </div>
        
        <div id="components-container">
            ${apiSystem.renderAllComponents()}
        </div>
    </div>
    
    <script>
        // Attach component instances to DOM elements
        document.addEventListener('DOMContentLoaded', function() {
            const components = document.querySelectorAll('.api-component');
            components.forEach(element => {
                const endpoint = element.getAttribute('data-endpoint');
                if (endpoint) {
                    const [method, path] = endpoint.split(' ');
                    // This would attach the actual component instance
                    console.log('Component for:', method, path);
                }
            });
        });
        
        // Global helper functions for component interactions
        window.apiSystem = {
            async fetchComponent(method, path, params) {
                // Implementation for fetching data
                console.log('Fetching:', method, path, params);
            },
            
            async submitForm(method, path, formData) {
                // Implementation for form submission
                console.log('Submitting:', method, path, formData);
            }
        };
    </script>
</body>
</html>`;
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }
    
    // API endpoints
    if (url === '/api/users' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(dataStore.users));
        return;
    }
    
    if (url.match(/^\/api\/users\/\d+$/) && method === 'GET') {
        const id = parseInt(url.split('/')[3]);
        const user = dataStore.users.find(u => u.id === id);
        
        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
        }
        return;
    }
    
    if (url === '/api/users' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const userData = JSON.parse(body);
                const newUser = {
                    id: dataStore.nextId++,
                    name: userData.name,
                    email: userData.email,
                    created: Date.now()
                };
                
                dataStore.users.push(newUser);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newUser));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    if (url.match(/^\/api\/users\/\d+$/) && method === 'DELETE') {
        const id = parseInt(url.split('/')[3]);
        const index = dataStore.users.findIndex(u => u.id === id);
        
        if (index !== -1) {
            dataStore.users.splice(index, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
        }
        return;
    }
    
    // 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🔮 NEXUS AXION - API as Components running on port ${PORT}`);
    console.log(`Auto-generated ${apiSystem.components.size} components from API definitions`);
    console.log('Architecture: API endpoints → Automatic UI components');
});

module.exports = { server, apiSystem };