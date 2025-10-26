#!/usr/bin/env node
/**
 * 🌌 NEXUS AXION 2.0 - E-commerce Application COMPLÈTE
 * Architecture Tri-Modulaire en Mono-Fichier
 * 
 * Déploiement:
 * 1. npm install (aucune dépendance requise!)
 * 2. node app.js
 * 3. Accéder via http://localhost:3000
 * 
 * Production: Deploy sur Render.com
 */

const http = require('http');
const url = require('url');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;

// ============================================
// 📦 MODULE 1: FRONTEND MODERNE
// ============================================

const FrontendModule = {
  name: 'FrontendModule',
  
  pages: {
    home: (state = {}) => `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NEXUS Store - E-commerce</title>
        <style>${FrontendModule.styles}</style>
      </head>
      <body>
        ${FrontendModule.header(state)}
        
        <main class="container">
          <section class="hero">
            <h1>🛍️ Bienvenue sur NEXUS Store</h1>
            <p>Architecture tri-modulaire NEXUS AXION 2.0</p>
          </section>
          
          <section class="products">
            <h2>📦 Nos Produits</h2>
            <div class="grid">
              ${state.products ? state.products.map(p => `
                <div class="card">
                  <div class="icon">📱</div>
                  <h3>${p.name}</h3>
                  <p class="price">${p.price}€</p>
                  <p>${p.description}</p>
                  <button onclick="addToCart('${p.id}')">Ajouter au panier</button>
                </div>
              `).join('') : '<p>Chargement...</p>'}
            </div>
          </section>
        </main>
        
        ${FrontendModule.footer()}
        <script>${FrontendModule.script(state)}</script>
      </body>
      </html>
    `,
    
    cart: (state = {}) => `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Panier - NEXUS Store</title>
        <style>${FrontendModule.styles}</style>
      </head>
      <body>
        ${FrontendModule.header(state)}
        
        <main class="container">
          <h1>🛒 Votre Panier</h1>
          
          ${state.cart && state.cart.length > 0 ? `
            <div class="cart-items">
              ${state.cart.map(item => `
                <div class="cart-item">
                  <div>
                    <h3>${item.name}</h3>
                    <p>${item.price}€</p>
                  </div>
                  <div class="qty">
                    <button onclick="updateQty('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQty('${item.id}', ${item.quantity + 1})">+</button>
                  </div>
                  <button onclick="removeItem('${item.id}')">❌</button>
                </div>
              `).join('')}
              
              <div class="total">
                <h3>Total: ${state.total}€</h3>
                <button onclick="checkout()">Commander</button>
              </div>
            </div>
          ` : `
            <div class="empty">
              <p>Panier vide</p>
              <a href="/">Continuer mes achats</a>
            </div>
          `}
        </main>
        
        ${FrontendModule.footer()}
        <script>${FrontendModule.script(state)}</script>
      </body>
      </html>
    `,
    
    login: (state = {}) => `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Connexion - NEXUS Store</title>
        <style>${FrontendModule.styles}</style>
      </head>
      <body>
        ${FrontendModule.header(state)}
        
        <main class="container">
          <div class="form-box">
            <h1>🔐 Connexion</h1>
            ${state.error ? `<div class="error">${state.error}</div>` : ''}
            
            <form id="loginForm">
              <input type="email" name="email" placeholder="Email" required>
              <input type="password" name="password" placeholder="Mot de passe" required>
              <button type="submit">Se connecter</button>
            </form>
            
            <p>Pas de compte ? <a href="/register">S'inscrire</a></p>
          </div>
        </main>
        
        ${FrontendModule.footer()}
        <script>
          document.getElementById('loginForm').onsubmit = async (e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                email: data.get('email'),
                password: data.get('password')
              })
            });
            const result = await res.json();
            if (result.success) {
              window.location.href = '/dashboard';
            } else {
              alert('❌ ' + result.error);
            }
          };
        </script>
      </body>
      </html>
    `,
    
    register: (state = {}) => `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inscription - NEXUS Store</title>
        <style>${FrontendModule.styles}</style>
      </head>
      <body>
        ${FrontendModule.header(state)}
        
        <main class="container">
          <div class="form-box">
            <h1>📝 Inscription</h1>
            
            <form id="registerForm">
              <input type="text" name="name" placeholder="Nom complet" required>
              <input type="email" name="email" placeholder="Email" required>
              <input type="password" name="password" placeholder="Mot de passe" required>
              <button type="submit">S'inscrire</button>
            </form>
            
            <p>Déjà un compte ? <a href="/login">Se connecter</a></p>
          </div>
        </main>
        
        ${FrontendModule.footer()}
        <script>
          document.getElementById('registerForm').onsubmit = async (e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            const res = await fetch('/api/auth/register', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                name: data.get('name'),
                email: data.get('email'),
                password: data.get('password')
              })
            });
            const result = await res.json();
            if (result.success) {
              alert('✅ Inscription réussie !');
              window.location.href = '/login';
            } else {
              alert('❌ ' + result.error);
            }
          };
        </script>
      </body>
      </html>
    `,
    
    dashboard: (state = {}) => `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - NEXUS Store</title>
        <style>${FrontendModule.styles}</style>
      </head>
      <body>
        ${FrontendModule.header(state)}
        
        <main class="container">
          <h1>📊 Dashboard</h1>
          
          <div class="stats">
            <div class="stat">
              <h3>Commandes</h3>
              <p>${state.stats?.orders || 0}</p>
            </div>
            <div class="stat">
              <h3>Produits</h3>
              <p>${state.stats?.products || 0}</p>
            </div>
            <div class="stat">
              <h3>Utilisateurs</h3>
              <p>${state.stats?.users || 0}</p>
            </div>
            <div class="stat">
              <h3>Cache Hit</h3>
              <p>${state.stats?.cacheHitRate || '0%'}</p>
            </div>
          </div>
          
          <div class="info">
            <h2>⚙️ Système NEXUS AXION 2.0</h2>
            <pre>${JSON.stringify(state.systemInfo, null, 2)}</pre>
          </div>
        </main>
        
        ${FrontendModule.footer()}
      </body>
      </html>
    `
  },
  
  header: (state) => `
    <header>
      <div class="container">
        <a href="/" class="logo">🌌 NEXUS Store</a>
        <nav>
          <a href="/">Accueil</a>
          <a href="/cart">Panier ${state.cartCount ? `(${state.cartCount})` : ''}</a>
          ${state.user ? `
            <a href="/dashboard">Dashboard</a>
            <a href="/logout">Déconnexion</a>
          ` : `
            <a href="/login">Connexion</a>
          `}
        </nav>
      </div>
    </header>
  `,
  
  footer: () => `
    <footer>
      <p>🌌 NEXUS AXION 2.0 - Architecture Tri-Modulaire</p>
    </footer>
  `,
  
  script: (state) => `
    async function addToCart(productId) {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({productId})
      });
      const result = await res.json();
      if (result.success) {
        alert('✅ Ajouté au panier !');
        location.reload();
      } else {
        alert('❌ ' + result.error);
      }
    }
    
    async function updateQty(productId, quantity) {
      if (quantity < 1) return removeItem(productId);
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({productId, quantity})
      });
      if (res.ok) location.reload();
    }
    
    async function removeItem(productId) {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({productId})
      });
      if (res.ok) location.reload();
    }
    
    async function checkout() {
      const res = await fetch('/api/orders/create', {method: 'POST'});
      const result = await res.json();
      if (result.success) {
        alert('✅ Commande créée ! ID: ' + result.orderId);
        location.href = '/dashboard';
      } else {
        alert('❌ ' + result.error);
      }
    }
  `,
  
  styles: `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: #333;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    
    /* Header */
    header {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    header .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      text-decoration: none;
      color: #667eea;
    }
    nav { display: flex; gap: 20px; }
    nav a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      transition: color 0.3s;
    }
    nav a:hover { color: #667eea; }
    
    /* Hero */
    .hero {
      background: white;
      border-radius: 20px;
      padding: 60px 40px;
      text-align: center;
      margin: 40px 0;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .hero h1 {
      font-size: 48px;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    /* Products */
    .products {
      background: white;
      border-radius: 20px;
      padding: 40px;
      margin: 40px 0;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .products h2 { margin-bottom: 30px; font-size: 32px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
    }
    .card {
      background: #f8f9fa;
      border-radius: 15px;
      padding: 25px;
      text-align: center;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    .icon { font-size: 64px; margin-bottom: 15px; }
    .card h3 { margin-bottom: 10px; }
    .price {
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
      margin: 10px 0;
    }
    
    button, .btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
      text-decoration: none;
      display: inline-block;
    }
    button:hover, .btn:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 20px rgba(102,126,234,0.4);
    }
    
    /* Cart */
    .cart-items {
      background: white;
      border-radius: 20px;
      padding: 40px;
      margin: 40px 0;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    .qty {
      display: flex;
      gap: 15px;
      align-items: center;
    }
    .qty button {
      width: 35px;
      height: 35px;
      padding: 0;
      border-radius: 50%;
    }
    .total {
      text-align: right;
      padding: 30px 20px 0;
      border-top: 2px solid #667eea;
      margin-top: 20px;
    }
    .total h3 { font-size: 28px; margin-bottom: 20px; }
    
    .empty {
      background: white;
      border-radius: 20px;
      padding: 80px 40px;
      text-align: center;
      margin: 40px 0;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .empty p { font-size: 20px; margin-bottom: 30px; color: #666; }
    
    /* Forms */
    .form-box {
      background: white;
      border-radius: 20px;
      padding: 50px;
      max-width: 500px;
      margin: 60px auto;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .form-box h1 { text-align: center; margin-bottom: 40px; }
    .form-box input {
      width: 100%;
      padding: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 16px;
      margin-bottom: 15px;
    }
    .form-box input:focus {
      outline: none;
      border-color: #667eea;
    }
    .form-box button { width: 100%; margin-top: 10px; }
    .form-box p { text-align: center; margin-top: 20px; color: #666; }
    .form-box a { color: #667eea; text-decoration: none; font-weight: 600; }
    
    .error {
      background: #fee;
      color: #c33;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
      text-align: center;
    }
    
    /* Dashboard */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 40px 0;
    }
    .stat {
      background: white;
      border-radius: 15px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    .stat h3 { color: #666; margin-bottom: 15px; }
    .stat p { font-size: 36px; font-weight: bold; color: #667eea; }
    
    .info {
      background: white;
      border-radius: 15px;
      padding: 30px;
      margin: 20px 0;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    .info pre {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      overflow-x: auto;
      font-size: 14px;
    }
    
    /* Footer */
    footer {
      background: rgba(255,255,255,0.95);
      margin-top: 60px;
      padding: 30px 0;
      text-align: center;
      color: #666;
    }
    
    @media (max-width: 768px) {
      header .container { flex-direction: column; gap: 15px; }
      nav { flex-wrap: wrap; justify-content: center; }
      .hero h1 { font-size: 32px; }
      .grid { grid-template-columns: 1fr; }
      .form-box { padding: 30px 20px; }
    }
  `
};

// ============================================
// ⚙️ MODULE 2: BACKEND PUISSANT
// ============================================

const BackendModule = {
  name: 'BackendModule',
  
  security: {
    rateLimit: new Map(),
    auditLog: [],
    
    checkRateLimit(clientId, max = 100) {
      const now = Date.now();
      const client = this.rateLimit.get(clientId) || { count: 0, reset: now + 60000 };
      if (now > client.reset) {
        client.count = 0;
        client.reset = now + 60000;
      }
      client.count++;
      this.rateLimit.set(clientId, client);
      return client.count <= max;
    },
    
    audit(action, data) {
      this.auditLog.push({
        timestamp: new Date().toISOString(),
        action,
        data
      });
    }
  },
  
  modules: {
    auth: {
      users: new Map(),
      sessions: new Map(),
      
      register(data) {
        const { name, email, password } = data;
        if (this.users.has(email)) {
          return { success: false, error: 'Email déjà utilisé' };
        }
        const userId = crypto.randomBytes(16).toString('hex');
        this.users.set(email, {
          id: userId,
          name,
          email,
          password: crypto.createHash('sha256').update(password).digest('hex'),
          createdAt: Date.now()
        });
        return { success: true, userId };
      },
      
      login(data) {
        const { email, password } = data;
        const user = this.users.get(email);
        if (!user) {
          return { success: false, error: 'Identifiants invalides' };
        }
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password !== hash) {
          return { success: false, error: 'Identifiants invalides' };
        }
        const sessionId = crypto.randomBytes(32).toString('hex');
        this.sessions.set(sessionId, {
          userId: user.id,
          email: user.email,
          name: user.name,
          createdAt: Date.now()
        });
        return { success: true, sessionId, user: { id: user.id, name: user.name, email: user.email } };
      },
      
      validateSession(sessionId) {
        return this.sessions.has(sessionId) ? this.sessions.get(sessionId) : null;
      },
      
      logout(sessionId) {
        this.sessions.delete(sessionId);
        return { success: true };
      }
    },
    
    products: {
      catalog: new Map([
        ['prod_001', { id: 'prod_001', name: 'iPhone 15 Pro', price: 1199, description: 'Puce A17 Pro', stock: 50 }],
        ['prod_002', { id: 'prod_002', name: 'MacBook Air M3', price: 1299, description: 'Ultra-léger', stock: 30 }],
        ['prod_003', { id: 'prod_003', name: 'iPad Pro', price: 899, description: 'Avec M2', stock: 40 }],
        ['prod_004', { id: 'prod_004', name: 'AirPods Pro', price: 279, description: 'Réduction bruit', stock: 100 }],
        ['prod_005', { id: 'prod_005', name: 'Apple Watch Ultra', price: 899, description: 'Montre extrême', stock: 25 }],
        ['prod_006', { id: 'prod_006', name: 'Magic Keyboard', price: 149, description: 'Clavier premium', stock: 60 }]
      ]),
      
      getAll() {
        return { success: true, products: Array.from(this.catalog.values()) };
      },
      
      getById(id) {
        const product = this.catalog.get(id);
        if (!product) return { success: false, error: 'Produit introuvable' };
        return { success: true, product };
      }
    },
    
    cart: {
      carts: new Map(),
      
      getCart(sessionId) {
        if (!this.carts.has(sessionId)) {
          this.carts.set(sessionId, { items: [], total: 0 });
        }
        return this.carts.get(sessionId);
      },
      
      addItem(sessionId, productId) {
        const productResult = BackendModule.modules.products.getById(productId);
        if (!productResult.success) return productResult;
        
        const cart = this.getCart(sessionId);
        const existing = cart.items.find(item => item.id === productId);
        
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.items.push({
            id: productId,
            name: productResult.product.name,
            price: productResult.product.price,
            quantity: 1
          });
        }
        
        this.updateTotal(cart);
        return { success: true, cart };
      },
      
      updateItem(sessionId, productId, quantity) {
        const cart = this.getCart(sessionId);
        const item = cart.items.find(i => i.id === productId);
        if (!item) return { success: false, error: 'Item introuvable' };
        if (quantity <= 0) return this.removeItem(sessionId, productId);
        item.quantity = quantity;
        this.updateTotal(cart);
        return { success: true, cart };
      },
      
      removeItem(sessionId, productId) {
        const cart = this.getCart(sessionId);
        cart.items = cart.items.filter(i => i.id !== productId);
        this.updateTotal(cart);
        return { success: true, cart };
      },
      
      updateTotal(cart) {
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
      
      clearCart(sessionId) {
        this.carts.set(sessionId, { items: [], total: 0 });
        return { success: true };
      }
    },
    
    orders: {
      orders: new Map(),
      
      createOrder(sessionId) {
        const cart = BackendModule.modules.cart.getCart(sessionId);
        if (cart.items.length === 0) {
          return { success: false, error: 'Panier vide' };
        }
        const orderId = `order_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
        const order = {
          id: orderId,
          sessionId,
          items: [...cart.items],
          total: cart.total,
          status: 'pending',
          createdAt: Date.now()
        };
        this.orders.set(orderId, order);
        BackendModule.modules.cart.clearCart(sessionId);
        return { success: true, orderId, order };
      },
      
      getAllOrders() {
        return { success: true, orders: Array.from(this.orders.values()) };
      }
    },
    
    analytics: {
      events: [],
      
      track(event, props) {
        this.events.push({ event, props, timestamp: Date.now() });
        return { success: true };
      },
      
      getStats() {
        const counts = {};
        this.events.forEach(e => {
          counts[e.event] = (counts[e.event] || 0) + 1;
        });
        return { totalEvents: this.events.length, eventCounts: counts };
      }
    }
  }
};

// ============================================
// 🔌 MODULE 3: CONNECTEUR INTELLIGENT
// ============================================

const ConnectorModule = {
  name: 'ConnectorModule',
  
  cache: {
    L1: new Map(),
    L2: new Map(),
    L3: new Map(),
    stats: { hits: { L1: 0, L2: 0, L3: 0 }, misses: 0 },
    
    get(key) {
      if (this.L1.has(key)) {
        const entry = this.L1.get(key);
        if (this.isValid(entry, 60000)) {
          this.stats.hits.L1++;
          return entry.value;
        }
      }
      if (this.L2.has(key)) {
        const entry = this.L2.get(key);
        if (this.isValid(entry, 300000)) {
          this.stats.hits.L2++;
          this.L1.set(key, entry);
          return entry.value;
        }
      }
      if (this.L3.has(key)) {
        const entry = this.L3.get(key);
        if (this.isValid(entry, 3600000)) {
          this.stats.hits.L3++;
          this.L2.set(key, entry);
          return entry.value;
        }
      }
      this.stats.misses++;
      return null;
    },
    
    set(key, value, level = 'L1') {
      this[level].set(key, { value, createdAt: Date.now() });
    },
    
    isValid(entry, ttl) {
      return (Date.now() - entry.createdAt) < ttl;
    },
    
    getStats() {
      const total = this.stats.hits.L1 + this.stats.hits.L2 + this.stats.hits.L3 + this.stats.misses;
      const hitRate = total > 0 ? ((this.stats.hits.L1 + this.stats.hits.L2 + this.stats.hits.L3) / total * 100).toFixed(2) : 0;
      return {
        hitRate: `${hitRate}%`,
        hits: this.stats.hits,
        misses: this.stats.misses,
        sizes: { L1: this.L1.size, L2: this.L2.size, L3: this.L3.size }
      };
    }
  },
  
  sessions: {
    getSessionId(req) {
      const cookies = this.parseCookies(req.headers.cookie || '');
      return cookies.sessionId || null;
    },
    
    parseCookies(cookieString) {
      const cookies = {};
      cookieString.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name) cookies[name] = value;
      });
      return cookies;
    },
    
    createCookie(name, value, maxAge = 86400) {
      return `${name}=${value}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax`;
    }
  }
};

// ============================================
// 🌟 SYSTÈME UNIFIÉ NEXUS AXION 2.0
// ============================================

const NexusAxion = {
  version: '2.0.0',
  
  frontend: FrontendModule,
  backend: BackendModule,
  connector: ConnectorModule,
  
  async handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const sessionId = this.connector.sessions.getSessionId(req);
    
    // Track analytics
    this.backend.modules.analytics.track('page_view', { path: pathname });
    
    // API Routes
    if (pathname.startsWith('/api/')) {
      return this.handleAPI(req, res, parsedUrl, sessionId);
    }
    
    // Page Routes
    return this.handlePage(req, res, pathname, sessionId);
  },
  
  async handlePage(req, res, pathname, sessionId) {
    let page, state = {};
    
    // Get user session
    const session = sessionId ? this.backend.modules.auth.validateSession(sessionId) : null;
    if (session) {
      state.user = { name: session.name, email: session.email };
    }
    
    // Get cart info
    const cart = this.backend.modules.cart.getCart(sessionId || 'guest');
    state.cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Route handling
    switch (pathname) {
      case '/':
        const productsResult = this.backend.modules.products.getAll();
        state.products = productsResult.products;
        page = this.frontend.pages.home(state);
        break;
        
      case '/cart':
        state.cart = cart.items;
        state.total = cart.total;
        page = this.frontend.pages.cart(state);
        break;
        
      case '/login':
        page = this.frontend.pages.login(state);
        break;
        
      case '/register':
        page = this.frontend.pages.register(state);
        break;
        
      case '/dashboard':
        if (!session) {
          res.writeHead(302, { 'Location': '/login' });
          return res.end();
        }
        
        state.stats = {
          orders: this.backend.modules.orders.orders.size,
          products: this.backend.modules.products.catalog.size,
          users: this.backend.modules.auth.users.size,
          cacheHitRate: this.connector.cache.getStats().hitRate
        };
        
        state.systemInfo = {
          version: this.version,
          architecture: 'Tri-Modulaire',
          modules: {
            frontend: 'Active',
            backend: 'Active',
            connector: 'Active'
          },
          cache: this.connector.cache.getStats(),
          analytics: this.backend.modules.analytics.getStats()
        };
        
        page = this.frontend.pages.dashboard(state);
        break;
        
      case '/logout':
        if (sessionId) {
          this.backend.modules.auth.logout(sessionId);
        }
        res.writeHead(302, { 
          'Location': '/',
          'Set-Cookie': this.connector.sessions.createCookie('sessionId', '', 0)
        });
        return res.end();
        
      default:
        page = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>404 - NEXUS Store</title>
            <style>${this.frontend.styles}</style>
          </head>
          <body>
            ${this.frontend.header(state)}
            <main class="container">
              <div class="empty">
                <h1>404</h1>
                <p>Page introuvable</p>
                <a href="/">Retour à l'accueil</a>
              </div>
            </main>
            ${this.frontend.footer()}
          </body>
          </html>
        `;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page);
  },
  
  async handleAPI(req, res, parsedUrl, sessionId) {
    const pathname = parsedUrl.pathname;
    
    // Rate limiting
    const clientId = req.socket.remoteAddress;
    if (!this.backend.security.checkRateLimit(clientId)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: false, error: 'Rate limit exceeded' }));
    }
    
    // Parse body for POST requests
    let body = {};
    if (req.method === 'POST') {
      body = await this.parseBody(req);
    }
    
    let result;
    
    // API endpoint routing
    switch (pathname) {
      // Auth endpoints
      case '/api/auth/register':
        result = this.backend.modules.auth.register(body);
        this.backend.security.audit('AUTH_REGISTER', { email: body.email, success: result.success });
        break;
        
      case '/api/auth/login':
        result = this.backend.modules.auth.login(body);
        this.backend.security.audit('AUTH_LOGIN', { email: body.email, success: result.success });
        if (result.success) {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': this.connector.sessions.createCookie('sessionId', result.sessionId)
          });
          return res.end(JSON.stringify(result));
        }
        break;
        
      // Cart endpoints
      case '/api/cart/add':
        if (!sessionId) sessionId = 'guest';
        result = this.backend.modules.cart.addItem(sessionId, body.productId);
        this.backend.security.audit('CART_ADD', { productId: body.productId, sessionId });
        break;
        
      case '/api/cart/update':
        if (!sessionId) sessionId = 'guest';
        result = this.backend.modules.cart.updateItem(sessionId, body.productId, body.quantity);
        this.backend.security.audit('CART_UPDATE', { productId: body.productId, quantity: body.quantity });
        break;
        
      case '/api/cart/remove':
        if (!sessionId) sessionId = 'guest';
        result = this.backend.modules.cart.removeItem(sessionId, body.productId);
        this.backend.security.audit('CART_REMOVE', { productId: body.productId });
        break;
        
      // Orders endpoints
      case '/api/orders/create':
        if (!sessionId) {
          result = { success: false, error: 'Authentification requise' };
        } else {
          result = this.backend.modules.orders.createOrder(sessionId);
          this.backend.security.audit('ORDER_CREATE', { orderId: result.orderId, sessionId });
        }
        break;
        
      case '/api/orders/list':
        result = this.backend.modules.orders.getAllOrders();
        break;
        
      // Products endpoints
      case '/api/products/list':
        result = this.backend.modules.products.getAll();
        break;
        
      default:
        result = { success: false, error: 'API endpoint introuvable' };
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  },
  
  parseBody(req) {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve({});
        }
      });
    });
  },
  
  initialize() {
    console.log('\n🚀 Initialisation NEXUS AXION 2.0...\n');
    
    // Create demo user
    const demoUser = this.backend.modules.auth.register({
      name: 'Demo User',
      email: 'demo@nexus.com',
      password: 'demo123'
    });
    
    console.log('✅ Utilisateur démo créé:');
    console.log('   Email: demo@nexus.com');
    console.log('   Mot de passe: demo123');
    console.log('');
    console.log('✅ Catalogue produits:', this.backend.modules.products.catalog.size, 'produits');
    console.log('✅ Modules initialisés: Frontend, Backend, Connecteur');
    console.log('');
    console.log('🌟 NEXUS AXION 2.0 prêt!\n');
  }
};

// ============================================
// 🎬 DÉMARRAGE SERVEUR
// ============================================

// Initialize system
NexusAxion.initialize();

// Create HTTP server
const server = http.createServer((req, res) => {
  NexusAxion.handleRequest(req, res).catch(err => {
    console.error('❌ Error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
});

// Start server
server.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🌌 NEXUS AXION 2.0 - E-COMMERCE APPLICATION');
  console.log('='.repeat(60));
  console.log(`\n🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL locale: http://localhost:${PORT}`);
  console.log(`\n✨ Architecture Tri-Modulaire:`);
  console.log(`   📦 Module Frontend: Pages SPA + Composants + Styles`);
  console.log(`   ⚙️  Module Backend: Auth + Products + Cart + Orders + Analytics`);
  console.log(`   🔌 Module Connecteur: Cache L1/L2/L3 + Sessions + API Router`);
  console.log(`\n🎯 Features:`);
  console.log(`   ✅ Authentification (register/login/logout)`);
  console.log(`   ✅ Catalogue produits (6 produits)`);
  console.log(`   ✅ Panier d'achat (add/update/remove)`);
  console.log(`   ✅ Gestion commandes`);
  console.log(`   ✅ Dashboard avec métriques`);
  console.log(`   ✅ Cache intelligent multi-niveau`);
  console.log(`   ✅ Rate limiting & Audit logs`);
  console.log(`\n📊 Endpoints API:`);
  console.log(`   POST /api/auth/register - Inscription`);
  console.log(`   POST /api/auth/login - Connexion`);
  console.log(`   POST /api/cart/add - Ajouter au panier`);
  console.log(`   POST /api/cart/update - Modifier quantité`);
  console.log(`   POST /api/cart/remove - Retirer du panier`);
  console.log(`   POST /api/orders/create - Créer commande`);
  console.log(`   GET /api/orders/list - Lister commandes`);
  console.log(`   GET /api/products/list - Lister produits`);
  console.log(`\n✅ Prêt pour tests et déploiement sur Render!`);
  console.log('='.repeat(60));
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM reçu, arrêt gracieux...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT reçu, arrêt gracieux...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});