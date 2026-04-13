
// ============================================================
// TOMATO FULL-STACK MVP
// Single-file React app: Auth + Consumer + Seller flows
// Stack: React, Tailwind (via CDN), Lucide-React, CSS animations
// ============================================================

import { useState, useEffect, useContext, createContext, useRef, useCallback } from "react";
import {
  Flame, ShoppingCart, Search, Store, Star, MapPin, Clock,
  Plus, Minus, X, CheckCircle, Package, ChevronRight, LogOut,
  ToggleLeft, ToggleRight, Bell, TrendingUp, Users, DollarSign,
  Utensils, Coffee, ShoppingBag, BookOpen, Cpu, Zap, ArrowRight,
  Bike, BadgeCheck, Eye, EyeOff, Loader2, PartyPopper, Receipt,
  ChevronDown, Filter, Grid3x3, List, AlertCircle, Trash2, Edit3,
  BarChart2, Home, Settings, Menu as MenuIcon
} from "lucide-react";

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const INITIAL_SHOPS = [
  {
    id: 1, name: "Ravi's Kitchen", category: "Food", rating: 4.9,
    distance: "300m", eta: "12 min", open: true, sellerId: "seller1",
    image: "🍛", tagline: "Home-style meals, anytime",
    products: [
      { id: 101, name: "Chicken Biryani", price: 80, category: "Food", available: true, emoji: "🍛" },
      { id: 102, name: "Paneer Butter Masala", price: 70, category: "Food", available: true, emoji: "🧆" },
      { id: 103, name: "Egg Fried Rice", price: 60, category: "Food", available: true, emoji: "🍳" },
      { id: 104, name: "Dal Tadka + Rice", price: 55, category: "Food", available: false, emoji: "🥘" },
      { id: 105, name: "Veg Thali", price: 65, category: "Food", available: true, emoji: "🍱" },
    ]
  },
  {
    id: 2, name: "Night Owl Snacks", category: "Snacks", rating: 4.7,
    distance: "500m", eta: "8 min", open: true, sellerId: "seller2",
    image: "🦉", tagline: "Open till 4am, always",
    products: [
      { id: 201, name: "Maggi Noodles", price: 30, category: "Snacks", available: true, emoji: "🍜" },
      { id: 202, name: "Kurkure (3 packs)", price: 30, category: "Snacks", available: true, emoji: "🌽" },
      { id: 203, name: "Red Bull 250ml", price: 120, category: "Drinks", available: true, emoji: "🥤" },
      { id: 204, name: "Oreo Pack", price: 35, category: "Snacks", available: true, emoji: "🍪" },
      { id: 205, name: "Lays Classic", price: 20, category: "Snacks", available: false, emoji: "🥔" },
    ]
  },
  {
    id: 3, name: "Campus Grocery", category: "Groceries", rating: 4.8,
    distance: "700m", eta: "15 min", open: true, sellerId: "seller3",
    image: "🛒", tagline: "Daily essentials, no markup",
    products: [
      { id: 301, name: "Bread (400g)", price: 35, category: "Groceries", available: true, emoji: "🍞" },
      { id: 302, name: "Milk 500ml", price: 30, category: "Groceries", available: true, emoji: "🥛" },
      { id: 303, name: "Eggs (6 pack)", price: 48, category: "Groceries", available: true, emoji: "🥚" },
      { id: 304, name: "Instant Coffee", price: 45, category: "Groceries", available: true, emoji: "☕" },
      { id: 305, name: "Peanut Butter", price: 95, category: "Groceries", available: true, emoji: "🫙" },
    ]
  },
  {
    id: 4, name: "Stationery Hub", category: "Stationery", rating: 4.6,
    distance: "900m", eta: "10 min", open: false, sellerId: "seller4",
    image: "📚", tagline: "Assignment essentials",
    products: [
      { id: 401, name: "A4 Ruled Notebook", price: 45, category: "Stationery", available: true, emoji: "📓" },
      { id: 402, name: "Ball Pen (5 pack)", price: 25, category: "Stationery", available: true, emoji: "🖊️" },
      { id: 403, name: "Highlighters Set", price: 60, category: "Stationery", available: false, emoji: "🖍️" },
      { id: 404, name: "Sticky Notes", price: 35, category: "Stationery", available: true, emoji: "🗒️" },
    ]
  },
  {
    id: 5, name: "TechBuddy Store", category: "Electronics", rating: 4.5,
    distance: "1km", eta: "18 min", open: true, sellerId: "seller5",
    image: "💡", tagline: "Cables, adapters & more",
    products: [
      { id: 501, name: "USB-C Cable 1m", price: 120, category: "Electronics", available: true, emoji: "🔌" },
      { id: 502, name: "Earphones (wired)", price: 150, category: "Electronics", available: true, emoji: "🎧" },
      { id: 503, name: "Phone Stand", price: 80, category: "Electronics", available: true, emoji: "📱" },
      { id: 504, name: "Power Bank 5000mAh", price: 499, category: "Electronics", available: false, emoji: "🔋" },
    ]
  },
];

const MOCK_ORDERS = [
  { id: "ORD001", customer: "Arjun S.", hostel: "Block C-204", items: [{ name: "Chicken Biryani", qty: 2, price: 80 }], total: 175, status: "pending", time: "2 min ago" },
  { id: "ORD002", customer: "Priya K.", hostel: "Block A-108", items: [{ name: "Paneer Butter Masala", qty: 1, price: 70 }, { name: "Veg Thali", qty: 1, price: 65 }], total: 150, status: "pending", time: "5 min ago" },
  { id: "ORD003", customer: "Rahul M.", hostel: "Block D-312", items: [{ name: "Egg Fried Rice", qty: 1, price: 60 }], total: 75, status: "accepted", time: "12 min ago" },
];

const MOCK_USERS = [
  { id: "u1", name: "Arjun Sharma", email: "arjun@hostel.in", role: "consumer", hostel: "Block C-204", avatar: "AS" },
  { id: "s1", name: "Ravi Kumar", email: "ravi@seller.in", role: "seller", shopId: 1, avatar: "RK" },
];

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────
const AppContext = createContext(null);

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [shops, setShops] = useState(INITIAL_SHOPS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState("auth"); // auth | consumer | seller

  const login = useCallback((userData) => {
    setUser(userData);
    setPage(userData.role === "seller" ? "seller" : "consumer");
  }, []);

  const logout = useCallback(() => {
    setUser(null); setCart([]); setPage("auth");
  }, []);

  const addToCart = useCallback((product, shopName) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1, shopName }];
    });
  }, []);

  const removeFromCart = useCallback((id) => setCart(prev => prev.filter(i => i.id !== id)), []);
  const updateQty = useCallback((id, delta) => setCart(prev =>
    prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0)
  ), []);

  const addProduct = useCallback((shopId, product) => {
    setShops(prev => prev.map(s => s.id === shopId
      ? { ...s, products: [...s.products, { ...product, id: Date.now(), available: true }] }
      : s
    ));
  }, []);

  const toggleProductAvail = useCallback((shopId, productId) => {
    setShops(prev => prev.map(s => s.id === shopId
      ? { ...s, products: s.products.map(p => p.id === productId ? { ...p, available: !p.available } : p) }
      : s
    ));
  }, []);

  const acceptOrder = useCallback((orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "accepted" } : o));
  }, []);

  const placeOrder = useCallback((cartItems, total) => {
    const newOrder = {
      id: `ORD${Date.now()}`, customer: user?.name || "Student",
      hostel: user?.hostel || "Unknown", items: cartItems.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      total, status: "pending", time: "just now"
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  }, [user]);

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = cart.reduce((a, i) => a + i.price * i.qty, 0);

  return (
    <AppContext.Provider value={{
      user, login, logout, shops, cart, cartOpen, setCartOpen,
      addToCart, removeFromCart, updateQty, cartCount, cartTotal,
      orders, addProduct, toggleProductAvail, acceptOrder, placeOrder, page
    }}>
      {children}
    </AppContext.Provider>
  );
}

const useApp = () => useContext(AppContext);

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const T = {
  red: "#E53E3E", redD: "#C53030", redL: "#FC8181", redGlow: "rgba(229,62,62,0.18)",
  bg: "#090909", card: "#111111", card2: "#161616", card3: "#1C1C1C",
  border: "#1E1E1E", borderHov: "#2A2A2A", borderRed: "rgba(229,62,62,0.3)",
  text: "#F5F5F5", textMuted: "#777777", textDim: "#444444",
  green: "#22C55E", greenBg: "rgba(34,197,94,0.12)",
  amber: "#F59E0B", amberBg: "rgba(245,158,11,0.12)",
};

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:${T.bg};color:${T.text};font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
    .syne{font-family:'Syne',sans-serif}
    ::-webkit-scrollbar{width:3px;height:3px}
    ::-webkit-scrollbar-track{background:${T.bg}}
    ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px}
    input,textarea,select{font-family:'DM Sans',sans-serif;color:${T.text}}
    input::placeholder,textarea::placeholder{color:${T.textDim}}
    button{font-family:'DM Sans',sans-serif;cursor:pointer}
    /* Animations */
    @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideInRight{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideInLeft{from{opacity:0;transform:translateX(-100%)}to{opacity:1;transform:translateX(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes successBounce{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    .fade-in{animation:fadeIn .4s ease both}
    .scale-in{animation:scaleIn .35s cubic-bezier(.34,1.56,.64,1) both}
    .slide-right{animation:slideInRight .35s cubic-bezier(.25,.46,.45,.94) both}
    .slide-left{animation:slideInLeft .35s cubic-bezier(.25,.46,.45,.94) both}
    .spin{animation:spin 1s linear infinite}
    .pulse-anim{animation:pulse 2s ease infinite}
    .float-anim{animation:floatUp 3s ease-in-out infinite}
    /* Stagger delays */
    .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}.d5{animation-delay:.25s}.d6{animation-delay:.3s}
    /* Card hover */
    .card-hover{transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
    .card-hover:hover{transform:translateY(-3px);border-color:${T.borderHov}!important}
    .red-hover:hover{border-color:${T.borderRed}!important;box-shadow:0 8px 32px rgba(229,62,62,.12)!important}
    /* Btn */
    .btn-red{background:${T.red};color:#fff;border:none;border-radius:14px;font-weight:600;font-size:14px;padding:12px 24px;transition:all .2s}
    .btn-red:hover{background:${T.redD};transform:translateY(-1px);box-shadow:0 6px 20px rgba(229,62,62,.3)}
    .btn-red:active{transform:translateY(0)}
    .btn-ghost{background:transparent;color:${T.textMuted};border:1px solid ${T.border};border-radius:14px;font-weight:500;font-size:14px;padding:11px 24px;transition:all .2s}
    .btn-ghost:hover{border-color:${T.borderHov};color:${T.text}}
    /* Input */
    .input-field{background:${T.card2};border:1px solid ${T.border};border-radius:12px;padding:12px 16px;font-size:14px;color:${T.text};width:100%;transition:border-color .2s,box-shadow .2s;outline:none}
    .input-field:focus{border-color:${T.red};box-shadow:0 0 0 3px rgba(229,62,62,.1)}
    /* Tag/badge */
    .badge-red{background:rgba(229,62,62,.15);color:${T.redL};font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;text-transform:uppercase;letter-spacing:.5px}
    .badge-green{background:rgba(34,197,94,.15);color:#4ade80;font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px}
    .badge-gray{background:${T.card3};color:${T.textMuted};font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px}
    /* Toggle */
    .toggle-track{width:44px;height:24px;border-radius:12px;position:relative;transition:background .2s;cursor:pointer;border:none}
    .toggle-thumb{width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;top:3px;transition:transform .2s}
    /* Overlay */
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:100;display:flex;align-items:center;justify-content:center}
    /* Divider */
    .divider{height:1px;background:${T.border};border:none;margin:0}
  `}</style>
);

// ─────────────────────────────────────────────
// REUSABLE COMPONENTS
// ─────────────────────────────────────────────
function Avatar({ initials, size = 36, color = T.red }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}22`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: size * 0.35, fontWeight: 700, fontFamily: "Syne", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function PulseIndicator({ active }) {
  return (
    <span style={{ width: 8, height: 8, borderRadius: "50%", background: active ? T.green : T.textDim, display: "inline-block", flexShrink: 0, boxShadow: active ? `0 0 8px ${T.green}` : "none" }} className={active ? "pulse-anim" : ""} />
  );
}

function StatCard({ icon: Icon, label, value, sub, color = T.red }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: "20px 24px" }} className="card-hover fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>{label}</div>
          <div className="syne" style={{ fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: "-1px" }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color={color} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

function Tag({ label, emoji }) {
  const catColors = {
    Food: { bg: "#2D1515", color: "#F87171" },
    Snacks: { bg: "#2D1E0F", color: "#FBBF24" },
    Drinks: { bg: "#0F1A2D", color: "#60A5FA" },
    Groceries: { bg: "#0F2D1A", color: "#4ADE80" },
    Stationery: { bg: "#1A1A2D", color: "#A78BFA" },
    Electronics: { bg: "#1A0F2D", color: "#C084FC" },
  };
  const c = catColors[label] || { bg: T.card3, color: T.textMuted };
  return (
    <span style={{ background: c.bg, color: c.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {emoji} {label}
    </span>
  );
}

// ─────────────────────────────────────────────
// AUTH PAGE
// ─────────────────────────────────────────────
function AuthPage() {
  const { login } = useApp();
  const [role, setRole] = useState("consumer");
  const [showPw, setShowPw] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", hostel: "" });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "consumer") {
        login({ id: "u_new", name: form.name || "Student", email: form.email, role: "consumer", hostel: form.hostel || "Block A", avatar: (form.name || "ST").slice(0, 2).toUpperCase() });
      } else {
        login({ id: "s_new", name: form.name || "Seller", email: form.email, role: "seller", shopId: 1, avatar: (form.name || "SK").slice(0, 2).toUpperCase() });
      }
    }, 1400);
  };

  const demoLogin = (demoRole) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (demoRole === "consumer") {
        login({ id: "u1", name: "Arjun Sharma", email: "arjun@hostel.in", role: "consumer", hostel: "Block C-204", avatar: "AS" });
      } else {
        login({ id: "s1", name: "Ravi Kumar", email: "ravi@seller.in", role: "seller", shopId: 1, avatar: "RK" });
      }
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, position: "relative", overflow: "hidden" }}>
      {/* BG glow */}
      <div style={{ position: "fixed", top: "-30%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "60vh", background: `radial-gradient(ellipse, rgba(229,62,62,.07) 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div className="scale-in" style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, background: T.red, borderRadius: 18, marginBottom: 16, boxShadow: `0 8px 24px rgba(229,62,62,.3)` }} className="float-anim">
            <Flame size={28} color="white" strokeWidth={2.5} />
          </div>
          <div className="syne" style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1px" }}>tomato</div>
          <div style={{ fontSize: 14, color: T.textMuted, marginTop: 4 }}>Your late-night local marketplace</div>
        </div>

        {/* Card */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 28, padding: "32px 28px" }}>
          {/* Role toggle */}
          <div style={{ display: "flex", background: T.card2, borderRadius: 16, padding: 4, marginBottom: 28, gap: 4 }}>
            {[{ v: "consumer", label: "🎓 I'm a Student", }, { v: "seller", label: "🏪 I'm a Seller" }].map(r => (
              <button key={r.v} onClick={() => setRole(r.v)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none", background: role === r.v ? T.red : "transparent", color: role === r.v ? "white" : T.textMuted, fontWeight: 600, fontSize: 14, transition: "all .2s" }}>
                {r.label}
              </button>
            ))}
          </div>

          {/* Toggle login/signup */}
          <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
            {["Login", "Sign Up"].map((l, i) => (
              <button key={l} onClick={() => setIsLogin(i === 0)} style={{ flex: 1, padding: "9px", background: "transparent", border: "none", color: (isLogin ? i === 0 : i === 1) ? T.text : T.textMuted, fontWeight: (isLogin ? i === 0 : i === 1) ? 700 : 400, fontSize: 15, borderBottom: `2px solid ${(isLogin ? i === 0 : i === 1) ? T.red : "transparent"}`, transition: "all .2s" }}>
                {l}
              </button>
            ))}
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!isLogin && (
              <input className="input-field fade-in" placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            )}
            <input className="input-field" placeholder="Email address" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            <div style={{ position: "relative" }}>
              <input className="input-field" placeholder="Password" type={showPw ? "text" : "password"} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={{ paddingRight: 44 }} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.textMuted }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {!isLogin && role === "consumer" && (
              <input className="input-field fade-in" placeholder="Hostel / PG Name (e.g. Block C-204)" value={form.hostel} onChange={e => setForm(p => ({ ...p, hostel: e.target.value }))} />
            )}
            {error && <div style={{ display: "flex", gap: 6, color: T.redL, fontSize: 13, alignItems: "center" }}><AlertCircle size={14} />{error}</div>}
            <button className="btn-red" style={{ width: "100%", padding: "14px", borderRadius: 14, fontSize: 15, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={handleSubmit} disabled={loading}>
              {loading ? <><Loader2 size={18} className="spin" /> Authenticating...</> : (isLogin ? "Login →" : "Create Account →")}
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <hr className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: T.textDim }}>or try demo</span>
            <hr className="divider" style={{ flex: 1 }} />
          </div>

          {/* Demo buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button className="btn-ghost" style={{ borderRadius: 14, fontSize: 13, padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => demoLogin("consumer")}>
              <Users size={14} /> Demo Student
            </button>
            <button className="btn-ghost" style={{ borderRadius: 14, fontSize: 13, padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => demoLogin("seller")}>
              <Store size={14} /> Demo Seller
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: T.textDim }}>
          No commission. No hidden fees. Just students helping students. 🍅
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CART DRAWER
// ─────────────────────────────────────────────
function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal, placeOrder } = useApp();
  const [payState, setPayState] = useState("idle"); // idle | processing | success
  const deliveryFee = cart.length > 0 ? 15 : 0;
  const total = cartTotal + deliveryFee;

  const handlePay = () => {
    setPayState("processing");
    setTimeout(() => {
      setPayState("success");
      setTimeout(() => { setPayState("idle"); setCartOpen(false); placeOrder(cart, total); }, 2200);
    }, 2000);
  };

  if (!cartOpen) return null;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 200, backdropFilter: "blur(4px)" }} onClick={() => setCartOpen(false)} />
      <div className="slide-right" style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "min(420px, 100vw)", background: T.card, borderLeft: `1px solid ${T.border}`, zIndex: 201, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingCart size={20} color={T.red} />
            <span className="syne" style={{ fontSize: 18, fontWeight: 700 }}>Your Cart</span>
            {cart.length > 0 && <span className="badge-red">{cart.length}</span>}
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: T.card2, border: "none", borderRadius: 10, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted }}>
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: T.textMuted }}>Cart is empty</div>
              <div style={{ fontSize: 13, color: T.textDim, marginTop: 8 }}>Add items from a shop</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cart.map((item, i) => (
                <div key={item.id} className="fade-in" style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, animationDelay: `${i * .05}s` }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>{item.shopName}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ width: 28, height: 28, borderRadius: 8, background: T.card3, border: "none", color: T.text, display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={12} /></button>
                    <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ width: 28, height: 28, borderRadius: 8, background: T.red, border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={12} /></button>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 52 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>₹{item.price * item.qty}</div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: T.textDim, marginTop: 2 }}><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fee breakdown + Pay */}
        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.textMuted, marginBottom: 8 }}>
                <span>Subtotal</span><span>₹{cartTotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.textMuted, marginBottom: 8 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><BadgeCheck size={12} color={T.green} /> Platform Fee</span>
                <span style={{ color: T.green, fontWeight: 700 }}>₹0</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.textMuted, marginBottom: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Bike size={12} /> Hyperlocal Delivery</span>
                <span>₹{deliveryFee}</span>
              </div>
              <hr className="divider" style={{ marginBottom: 10 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
                <span>Total</span><span style={{ color: T.red }}>₹{total}</span>
              </div>
            </div>
            <button className="btn-red" style={{ width: "100%", padding: 16, borderRadius: 16, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={handlePay}>
              <Zap size={18} /> Pay ₹{total} via UPI
            </button>
          </div>
        )}

        {/* Payment overlay */}
        {payState !== "idle" && (
          <div style={{ position: "absolute", inset: 0, background: T.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            {payState === "processing" ? (
              <div className="scale-in" style={{ textAlign: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", border: `3px solid ${T.border}`, borderTopColor: T.red, animation: "spin 1s linear infinite", margin: "0 auto 24px" }} />
                <div className="syne" style={{ fontSize: 20, fontWeight: 700 }}>Processing UPI...</div>
                <div style={{ fontSize: 14, color: T.textMuted, marginTop: 8 }}>Please wait. Do not close.</div>
              </div>
            ) : (
              <div className="scale-in" style={{ textAlign: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "successBounce .5s cubic-bezier(.34,1.56,.64,1)" }}>
                  <CheckCircle size={40} color={T.green} />
                </div>
                <div className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Order Placed!</div>
                <div style={{ fontSize: 14, color: T.textMuted, marginTop: 8 }}>Sit tight. Your order is on its way 🛵</div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// SHOP MENU MODAL
// ─────────────────────────────────────────────
function ShopMenu({ shop, onClose }) {
  const { addToCart, cart } = useApp();
  const [search, setSearch] = useState("");

  const filtered = shop.products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const cartQty = (id) => cart.find(i => i.id === id)?.qty || 0;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="scale-in" onClick={e => e.stopPropagation()} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 28, width: "min(560px, 95vw)", maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ fontSize: 44, lineHeight: 1 }}>{shop.image}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="syne" style={{ fontSize: 22, fontWeight: 800 }}>{shop.name}</div>
                  <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>{shop.tagline}</div>
                </div>
                <button onClick={onClose} style={{ background: T.card2, border: "none", borderRadius: 10, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, flexShrink: 0, marginLeft: 8 }}><X size={16} /></button>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                <span style={{ fontSize: 13, color: T.textMuted, display: "flex", alignItems: "center", gap: 4 }}><Star size={12} color="#FBBF24" fill="#FBBF24" />{shop.rating}</span>
                <span style={{ fontSize: 13, color: T.textMuted, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{shop.distance}</span>
                <span style={{ fontSize: 13, color: T.textMuted, display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{shop.eta}</span>
                <PulseIndicator active={shop.open} />
              </div>
            </div>
          </div>
          <div style={{ position: "relative", marginTop: 14 }}>
            <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.textMuted }} />
            <input className="input-field" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38, borderRadius: 12, fontSize: 14 }} />
          </div>
        </div>

        {/* Products */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          {filtered.map((p, i) => (
            <div key={p.id} className={`fade-in d${Math.min(i + 1, 6)}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 8px", borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : "none", opacity: p.available ? 1 : 0.45 }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>{p.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: p.available ? T.text : T.textMuted }}>{p.name}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                  <Tag label={p.category} emoji="" />
                  {!p.available && <span className="badge-gray">Out of Stock</span>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="syne" style={{ fontSize: 16, fontWeight: 700, color: T.text }}>₹{p.price}</div>
                {p.available ? (
                  cartQty(p.id) > 0 ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.red, borderRadius: 10, padding: "4px 8px" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "white", minWidth: 16, textAlign: "center" }}>{cartQty(p.id)}</span>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(p, shop.name)} style={{ background: T.red, border: "none", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: "white", transition: "all .2s" }}>
                      <Plus size={16} />
                    </button>
                  )
                ) : (
                  <div style={{ width: 34 }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONSUMER PAGE
// ─────────────────────────────────────────────
const CAT_ICONS = { Food: Utensils, Snacks: Coffee, Groceries: ShoppingBag, Stationery: BookOpen, Electronics: Cpu };
const CAT_COLORS = { Food: "#F87171", Snacks: "#FBBF24", Groceries: "#4ADE80", Stationery: "#A78BFA", Electronics: "#60A5FA" };

function ConsumerPage() {
  const { user, logout, shops, cartCount, setCartOpen } = useApp();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [selectedShop, setSelectedShop] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const categories = ["All", "Food", "Snacks", "Groceries", "Stationery", "Electronics"];

  const filtered = shops.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || s.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(9,9,9,.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}`, padding: "0 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 60, gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto" }}>
            <div style={{ width: 30, height: 30, background: T.red, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flame size={16} color="white" strokeWidth={2.5} />
            </div>
            <span className="syne" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px" }}>tomato</span>
            <span style={{ background: T.card2, color: T.textMuted, fontSize: 11, padding: "2px 8px", borderRadius: 6, marginLeft: 4, fontWeight: 600 }}>
              {user?.hostel}
            </span>
          </div>
          <button onClick={() => setCartOpen(true)} style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, color: T.text, fontSize: 14, fontWeight: 600, position: "relative" }}>
            <ShoppingCart size={16} />
            <span style={{ display: window.innerWidth > 480 ? "inline" : "none" }}>Cart</span>
            {cartCount > 0 && <span style={{ position: "absolute", top: -8, right: -8, width: 20, height: 20, borderRadius: "50%", background: T.red, color: "white", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.bg}` }}>{cartCount}</span>}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar initials={user?.avatar} size={34} />
            <button onClick={logout} style={{ background: "none", border: "none", color: T.textMuted, display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
        {/* Hero search */}
        <div className="fade-in" style={{ marginBottom: 32 }}>
          <div className="syne" style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 8 }}>
            Good evening, <span style={{ color: T.red }}>{user?.name?.split(" ")[0]}</span> 🌙
          </div>
          <div style={{ fontSize: 15, color: T.textMuted, marginBottom: 20 }}>What are you craving tonight?</div>
          <div style={{ position: "relative", maxWidth: 560 }}>
            <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: T.textDim }} />
            <input className="input-field" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search shops, food, snacks..." style={{ paddingLeft: 46, borderRadius: 16, fontSize: 15, padding: "14px 16px 14px 46px" }} />
          </div>
        </div>

        {/* Category pills */}
        <div className="fade-in" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 28, scrollbarWidth: "none" }}>
          {categories.map(cat => {
            const Icon = CAT_ICONS[cat];
            const active = catFilter === cat;
            return (
              <button key={cat} onClick={() => setCatFilter(cat)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 100, border: `1px solid ${active ? T.red : T.border}`, background: active ? `${T.red}18` : T.card, color: active ? T.red : T.textMuted, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", transition: "all .2s", flexShrink: 0 }}>
                {Icon && <Icon size={13} />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: T.textMuted }}>{filtered.length} shops found near you</span>
          <span style={{ fontSize: 12, color: T.textDim, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> Within 1km</span>
        </div>

        {/* Shop grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.textMuted }}>No shops found</div>
            <div style={{ fontSize: 13, color: T.textDim, marginTop: 6 }}>Try a different search or category</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {filtered.map((shop, i) => (
              <div key={shop.id} className={`card-hover red-hover fade-in d${Math.min(i + 1, 6)}`} onClick={() => setSelectedShop(shop)} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 22, padding: 20, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: T.card2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                    {shop.image}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <div className="syne" style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{shop.name}</div>
                      <PulseIndicator active={shop.open} />
                    </div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>{shop.tagline}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 13, color: T.textMuted, marginBottom: 14 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={12} color="#FBBF24" fill="#FBBF24" /><b style={{ color: T.text }}>{shop.rating}</b></span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} />{shop.distance}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} />{shop.eta}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Tag label={shop.category} emoji="" />
                  <span style={{ fontSize: 12, color: T.textMuted }}>{shop.products.filter(p => p.available).length} items available</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedShop && <ShopMenu shop={selectedShop} onClose={() => setSelectedShop(null)} />}
      <CartDrawer />
    </div>
  );
}

// ─────────────────────────────────────────────
// SELLER PAGE
// ─────────────────────────────────────────────
function SellerPage() {
  const { user, logout, shops, orders, addProduct, toggleProductAvail, acceptOrder } = useApp();
  const shop = shops.find(s => s.id === (user?.shopId || 1)) || shops[0];
  const myOrders = orders.filter((_, i) => i < 5);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [form, setForm] = useState({ name: "", price: "", category: "Food", emoji: "🍱" });
  const [formMsg, setFormMsg] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);

  const todaySales = myOrders.filter(o => o.status === "accepted").reduce((a, o) => a + o.total, 0);
  const pendingOrders = myOrders.filter(o => o.status === "pending").length;

  const handleAddProduct = () => {
    if (!form.name || !form.price) { setFormMsg("❌ Fill all fields."); return; }
    setAddingProduct(true);
    setTimeout(() => {
      addProduct(shop.id, { name: form.name, price: Number(form.price), category: form.category, emoji: form.emoji });
      setForm({ name: "", price: "", category: "Food", emoji: "🍱" });
      setFormMsg("✅ Product added!");
      setAddingProduct(false);
      setTimeout(() => setFormMsg(""), 3000);
    }, 600);
  };

  const EMOJIS = ["🍛", "🍜", "🍕", "🥪", "🥤", "🍪", "🛒", "📱", "🔌", "📓", "💡", "🧴"];

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: Bell, badge: pendingOrders },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex" }}>
      {/* Sidebar (desktop) */}
      <aside style={{ width: 240, background: T.card, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "24px 16px", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, paddingLeft: 8 }}>
          <div style={{ width: 30, height: 30, background: T.red, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={16} color="white" strokeWidth={2.5} />
          </div>
          <span className="syne" style={{ fontSize: 18, fontWeight: 800 }}>tomato</span>
          <span className="badge-red" style={{ fontSize: 10 }}>Seller</span>
        </div>

        {/* Shop info */}
        <div style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px", marginBottom: 24 }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>{shop?.image}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{shop?.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <PulseIndicator active={shop?.open} />
            <span style={{ fontSize: 12, color: T.textMuted }}>{shop?.open ? "Open now" : "Closed"}</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, border: "none", background: activeTab === tab.id ? `${T.red}18` : "transparent", color: activeTab === tab.id ? T.red : T.textMuted, fontWeight: activeTab === tab.id ? 600 : 400, fontSize: 14, marginBottom: 4, cursor: "pointer", transition: "all .2s", position: "relative" }}>
              <tab.icon size={17} />
              {tab.label}
              {tab.badge > 0 && <span style={{ marginLeft: "auto", background: T.red, color: "white", fontSize: 10, fontWeight: 800, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{tab.badge}</span>}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderTop: `1px solid ${T.border}` }}>
          <Avatar initials={user?.avatar} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>Seller account</div>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", color: T.textMuted }}><LogOut size={15} /></button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "28px 24px", overflowY: "auto", maxWidth: "calc(1200px - 240px)" }}>
        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <div className="fade-in">
            <div className="syne" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 6 }}>Dashboard</div>
            <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 28 }}>Welcome back, {user?.name?.split(" ")[0]} 👋</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
              <StatCard icon={DollarSign} label="Today's Sales" value={`₹${todaySales}`} sub="From accepted orders" color={T.green} />
              <StatCard icon={Bell} label="Pending Orders" value={pendingOrders} sub="Awaiting acceptance" color={T.amber} />
              <StatCard icon={Package} label="Products Listed" value={shop?.products?.length || 0} sub={`${shop?.products?.filter(p => p.available).length} available`} color="#60A5FA" />
              <StatCard icon={Star} label="Shop Rating" value={shop?.rating || "—"} sub="Based on reviews" color="#FBBF24" />
            </div>

            {/* Recent orders on dashboard */}
            <div>
              <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recent Orders</div>
              {myOrders.slice(0, 3).map((o, i) => (
                <div key={o.id} className={`fade-in d${i + 1}`} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: "16px 20px", marginBottom: 10, display: "flex", alignItems: "center", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{o.customer}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>{o.items.map(i => `${i.name} ×${i.qty}`).join(", ")}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div className="syne" style={{ fontSize: 16, fontWeight: 700 }}>₹{o.total}</div>
                    <span className={o.status === "accepted" ? "badge-green" : "badge-red"}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === "products" && (
          <div className="fade-in">
            <div className="syne" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 6 }}>Product Manager</div>
            <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 28 }}>Manage your inventory and availability</div>

            {/* Add form */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 22, padding: 24, marginBottom: 28 }}>
              <div className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}><Plus size={18} color={T.red} /> Add New Product</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <input className="input-field" placeholder="Product Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                <input className="input-field" placeholder="Price (₹)" type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <select className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ cursor: "pointer" }}>
                  {["Food", "Snacks", "Drinks", "Groceries", "Stationery", "Electronics"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 6, fontWeight: 600 }}>Pick emoji</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {EMOJIS.map(e => (
                      <button key={e} onClick={() => setForm(p => ({ ...p, emoji: e }))} style={{ width: 36, height: 36, border: `1.5px solid ${form.emoji === e ? T.red : T.border}`, borderRadius: 10, background: form.emoji === e ? `${T.red}18` : T.card2, fontSize: 18, cursor: "pointer" }}>{e}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button className="btn-red" style={{ borderRadius: 14, display: "flex", alignItems: "center", gap: 6 }} onClick={handleAddProduct} disabled={addingProduct}>
                  {addingProduct ? <><Loader2 size={14} className="spin" /> Adding...</> : <><Plus size={14} /> Add Product</>}
                </button>
                {formMsg && <span style={{ fontSize: 13, color: formMsg.startsWith("✅") ? T.green : T.redL }}>{formMsg}</span>}
              </div>
            </div>

            {/* Product list */}
            <div className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Current Inventory ({shop?.products?.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {shop?.products?.map((p, i) => (
                <div key={p.id} className={`card-hover fade-in d${Math.min(i + 1, 6)}`} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, opacity: p.available ? 1 : 0.6 }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{p.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{p.name}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                      <Tag label={p.category} emoji="" />
                    </div>
                  </div>
                  <div className="syne" style={{ fontSize: 16, fontWeight: 700 }}>₹{p.price}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: p.available ? T.green : T.textMuted, fontWeight: 600 }}>
                      {p.available ? "In Stock" : "Out of Stock"}
                    </span>
                    <button onClick={() => toggleProductAvail(shop.id, p.id)} className="toggle-track" style={{ background: p.available ? T.red : T.card3 }}>
                      <span className="toggle-thumb" style={{ transform: p.available ? "translateX(20px)" : "translateX(0)" }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <div className="fade-in">
            <div className="syne" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 6 }}>Incoming Orders</div>
            <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 28 }}>Accept orders to start fulfilling them</div>
            {myOrders.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.textMuted }}>No orders yet</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {myOrders.map((o, i) => (
                  <div key={o.id} className={`fade-in d${Math.min(i + 1, 6)}`} style={{ background: T.card, border: `1px solid ${o.status === "pending" ? T.borderRed : T.border}`, borderRadius: 22, padding: "20px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                          <span className="syne" style={{ fontSize: 14, fontWeight: 700 }}>{o.id}</span>
                          <span className={o.status === "pending" ? "badge-red" : "badge-green"}>{o.status}</span>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{o.customer}</div>
                        <div style={{ fontSize: 12, color: T.textMuted, display: "flex", gap: 4, alignItems: "center", marginTop: 2 }}><MapPin size={11} />{o.hostel}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="syne" style={{ fontSize: 20, fontWeight: 800, color: T.red }}>₹{o.total}</div>
                        <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{o.time}</div>
                      </div>
                    </div>
                    <div style={{ background: T.card2, borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
                      {o.items.map(item => (
                        <div key={item.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.textMuted, padding: "3px 0" }}>
                          <span>{item.name} × {item.qty}</span>
                          <span>₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                    {o.status === "pending" ? (
                      <button className="btn-red" style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 14 }} onClick={() => acceptOrder(o.id)}>
                        <CheckCircle size={15} /> Accept Order
                      </button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.green, fontSize: 14, fontWeight: 600 }}>
                        <CheckCircle size={15} /> Accepted — Preparing
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────

function AppInner() {
  const { page } = useApp();

  return (
    <>
      {page === "auth" && <AuthPage />}
      {page === "consumer" && <ConsumerPage />}
      {page === "seller" && <SellerPage />}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <GlobalStyles />
      <AppInner />
    </AppProvider>
  );
}

// ✅ ONLY ONE DEFAULT EXPORT
export default function TomatoMVP() {
  return <App />;
}

