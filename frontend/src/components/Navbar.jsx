import { Bell, Building2, LogOut, Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) {
      return;
    }

    try {
      setLoadingNotifications(true);
      const { data } = await api.get('/notifications/my');
      setNotifications(data.items || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleNotifications = async () => {
    const next = !showNotifications;
    setShowNotifications(next);
    if (next) {
      await fetchNotifications();
    }
  };

  const markOneAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) => prev.map((item) => (
        item.id === notificationId ? { ...item, read: true } : item
      )));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Ignore UI-only update failures.
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch {
      // Ignore UI-only update failures.
    }
  };

  const formatNotificationTime = (value) => {
    if (!value) {
      return '';
    }
    return new Date(value).toLocaleString();
  };

  return (
    <header className="glass shadow-soft rounded-2xl px-4 py-3 md:px-6 flex items-center justify-between fade-up">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center relative">
          <Building2 className="text-primary" size={20} />
          <span className="absolute -right-1 -top-1 text-xs">✨</span>
        </div>
        <div>
          <h1 className="text-lg font-heading font-semibold">CivicPulse 🏙️</h1>
          <p className="text-xs text-slate-500">{t('navbar.tagline')} 🚦</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <label htmlFor="language-switcher" className="sr-only">{t('navbar.language')}</label>
          <select
            id="language-switcher"
            value={i18n.resolvedLanguage || i18n.language || 'en'}
            onChange={(event) => i18n.changeLanguage(event.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-white/80 px-2.5 py-2 pr-7 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="en">{t('navbar.english')}</option>
            <option value="hi">{t('navbar.hindi')}</option>
            <option value="mr">{t('navbar.marathi')}</option>
          </select>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 hover-lift"
          title={theme === 'dark' ? t('navbar.themeLight') : t('navbar.themeDark')}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span className="hidden sm:inline">{theme === 'dark' ? t('navbar.light') : t('navbar.dark')}</span>
        </button>
        <div className="relative" ref={panelRef}>
          <button
            type="button"
            onClick={toggleNotifications}
            className="relative p-2 rounded-lg hover:bg-white/60 transition hover-lift"
          >
          <Bell size={18} className="text-slate-600" />
            {unreadCount > 0 && (
              <>
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-secondary pulse-soft" />
                <span className="absolute -right-1 -top-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] leading-4 text-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[320px] max-h-[420px] overflow-auto rounded-2xl border border-slate-200 bg-white shadow-card z-30">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{t('navbar.notifications')}</p>
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-primary font-medium disabled:text-slate-400"
                  disabled={!notifications.some((item) => !item.read)}
                >
                  {t('navbar.markAllRead')}
                </button>
              </div>

              {loadingNotifications ? (
                <p className="p-4 text-sm text-slate-500">{t('navbar.loadingNotifications')}</p>
              ) : notifications.length === 0 ? (
                <p className="p-4 text-sm text-slate-500">{t('navbar.noNotifications')}</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map((item) => (
                    <div key={item.id} className={`p-3 ${item.read ? 'bg-white' : 'bg-emerald-50/40'}`}>
                      <p className="text-sm text-slate-700">{item.message}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500">{formatNotificationTime(item.createdAt)}</span>
                        <div className="flex items-center gap-2">
                          {item.complaintId && (
                            <Link
                              to={`/complaints/${item.complaintId}`}
                              className="text-xs text-primary font-medium"
                              onClick={() => setShowNotifications(false)}
                            >
                              {t('navbar.viewComplaint')}
                            </Link>
                          )}
                          {!item.read && (
                            <button
                              type="button"
                              onClick={() => markOneAsRead(item.id)}
                              className="text-xs text-slate-600 font-medium"
                            >
                              {t('navbar.markRead')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs uppercase text-slate-500">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 hover-lift"
        >
          <LogOut size={16} /> {t('common.logout')}
        </button>
      </div>
    </header>
  );
}
