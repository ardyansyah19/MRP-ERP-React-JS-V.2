import { BrowserRouter, Routes, Route, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, ClipboardList, LogOut, Factory } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Items, Boms, Orders } from './pages/Masters';

const menu = [
  { to: '/', label: 'Dashboard & MRP', icon: LayoutDashboard },
  { to: '/items', label: 'Master Barang', icon: Package },
  { to: '/boms', label: 'Bill of Materials', icon: Layers },
  { to: '/orders', label: 'Order Produksi', icon: ClipboardList },
];

function Layout() {
  const nav = useNavigate();
  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />;
  const name = localStorage.getItem('name') || 'User';
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 p-5 md:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 p-2.5 text-white shadow-lg"><Factory size={22} /></div>
          <div><h1 className="font-bold leading-tight text-white">MRP ERP</h1><p className="text-xs text-indigo-300">Manufacturing Suite</p></div>
        </div>
        <nav className="flex-1 space-y-1">
          {menu.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 font-bold text-white">{name[0]}</div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-white">{name}</p></div>
          <button title="Keluar" className="text-slate-400 hover:text-white" onClick={() => { localStorage.clear(); nav('/login'); }}><LogOut size={18} /></button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <nav className="flex gap-1 overflow-x-auto bg-slate-900 p-2 md:hidden">
          {menu.map(({ to, label }) => <NavLink key={to} to={to} end className={({ isActive }) => `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}>{label}</NavLink>)}
        </nav>
        <main className="pop mx-auto max-w-6xl p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/items" element={<Items />} />
          <Route path="/boms" element={<Boms />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
