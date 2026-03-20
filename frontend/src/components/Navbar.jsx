import { Bell, Building2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="glass shadow-soft rounded-2xl px-4 py-3 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <Building2 className="text-primary" size={20} />
        </div>
        <div>
          <h1 className="text-lg font-heading font-semibold">CivicPulse</h1>
          <p className="text-xs text-slate-500">Smart City Grievance Portal</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-white/60 transition">
          <Bell size={18} className="text-slate-600" />
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs uppercase text-slate-500">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
}
