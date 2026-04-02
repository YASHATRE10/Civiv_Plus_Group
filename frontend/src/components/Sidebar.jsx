import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Send, ClipboardList, BarChart3, MessageSquareHeart } from 'lucide-react';

const roleMenus = {
  CITIZEN: [
    { path: '/citizen', labelKey: 'sidebar.citizen.dashboard', icon: LayoutDashboard },
    { path: '/submit', labelKey: 'sidebar.citizen.submit', icon: Send },
    { path: '/my-complaints', labelKey: 'sidebar.citizen.myComplaints', icon: ClipboardList }
  ],
  ADMIN: [
    { path: '/admin', labelKey: 'sidebar.admin.dashboard', icon: LayoutDashboard },
    { path: '/analytics', labelKey: 'sidebar.admin.analytics', icon: BarChart3 }
  ],
  OFFICER: [{ path: '/officer', labelKey: 'sidebar.officer.panel', icon: MessageSquareHeart }]
};

export default function Sidebar({ role }) {
  const { t } = useTranslation();
  const location = useLocation();
  const items = roleMenus[role] || [];

  return (
    <aside className="glass rounded-2xl p-4 shadow-card h-fit fade-up fade-up-delay-1">
      <p className="text-xs uppercase text-slate-500 mb-3">{t('sidebar.navigation')} 🧭</p>
      <nav className="space-y-2">
        {items.map(({ path, labelKey, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition hover-lift ${
                active ? 'bg-primary text-white shadow-soft' : 'hover:bg-white/70 text-slate-600'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
