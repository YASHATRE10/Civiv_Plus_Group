import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Send, ClipboardList, BarChart3, MessageSquareHeart } from 'lucide-react';

const roleMenus = {
  CITIZEN: [
    { path: '/citizen', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/submit', label: 'Submit Complaint', icon: Send },
    { path: '/my-complaints', label: 'My Complaints', icon: ClipboardList }
  ],
  ADMIN: [
    { path: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 }
  ],
  OFFICER: [{ path: '/officer', label: 'Officer Panel', icon: MessageSquareHeart }]
};

export default function Sidebar({ role }) {
  const location = useLocation();
  const items = roleMenus[role] || [];

  return (
    <aside className="glass rounded-2xl p-4 shadow-card h-fit">
      <p className="text-xs uppercase text-slate-500 mb-3">Navigation</p>
      <nav className="space-y-2">
        {items.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                active ? 'bg-primary text-white shadow-soft' : 'hover:bg-white/70 text-slate-600'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
