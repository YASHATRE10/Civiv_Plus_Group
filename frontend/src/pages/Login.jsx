import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { BellRing, MapPinned, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      setError('');
      const user = await login(values);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'OFFICER') navigate('/officer');
      else navigate('/citizen');
    } catch (err) {
      setError(err.response?.data?.message || t('auth.invalidCredentials'));
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 md:p-8 page-enter">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-card border border-white/50 bg-white/80 dark:bg-slate-900/75 backdrop-blur-md">
        <div className="grid md:grid-cols-2">
          <section className="p-6 sm:p-10 md:p-12 lg:p-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">{t('login.access')}</p>
            <h1 className="mt-2 text-4xl font-heading font-semibold text-slate-900 dark:text-slate-100">{t('login.welcomeBack')}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{t('login.description')}</p>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 bg-slate-100/90 dark:bg-slate-800/80"
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  {...register('email', {
                    required: t('register.validation.emailRequired'),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t('register.validation.emailInvalid')
                    }
                  })}
                />
                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 bg-slate-100/90 dark:bg-slate-800/80"
                  placeholder={t('login.passwordPlaceholder')}
                  {...register('password', {
                    required: t('register.validation.passwordRequired'),
                    minLength: {
                      value: 6,
                      message: t('auth.passwordMin')
                    }
                  })}
                />
                {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <input type="checkbox" className="rounded" /> {t('login.rememberMe')}
                </label>
                <Link to="/forgot-password" className="text-primary font-medium">{t('login.forgotPassword')}</Link>
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary text-white py-3 font-medium hover:opacity-95 transition"
              >
                {isSubmitting ? t('login.signingIn') : t('login.signIn')}
              </button>
            </form>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-3 py-2 flex items-center gap-2">
                <MapPinned size={14} className="text-primary" /> {t('login.localTracking')}
              </div>
              <div className="rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-3 py-2 flex items-center gap-2">
                <BellRing size={14} className="text-primary" /> {t('login.realtimeNotifications')}
              </div>
              <div className="rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-3 py-2 flex items-center gap-2">
                <ShieldCheck size={14} className="text-primary" /> {t('login.secureAccess')}
              </div>
            </div>
          </section>

          <aside className="hidden md:flex flex-col justify-center p-10 lg:p-14 bg-gradient-to-br from-primary via-blue-500 to-secondary text-white">
            <p className="text-sm uppercase tracking-wider text-white/80">{t('login.portal')}</p>
            <h2 className="mt-3 text-4xl font-heading font-bold leading-tight">{t('login.buildCity')}</h2>
            <p className="mt-5 text-white/90 leading-relaxed max-w-md">
              {t('login.asideDescription')}
            </p>

            <div className="mt-7 space-y-3 text-sm">
              <p className="rounded-xl bg-white/15 border border-white/25 px-4 py-3">{t('login.submit247')}</p>
              <p className="rounded-xl bg-white/15 border border-white/25 px-4 py-3">{t('login.trackUpdates')}</p>
              <p className="rounded-xl bg-white/15 border border-white/25 px-4 py-3">{t('login.feedbackAfterResolution')}</p>
            </div>

            <Link to="/register" className="mt-8 inline-flex items-center justify-center rounded-xl bg-white text-primary px-6 py-3 font-semibold hover:bg-slate-100 transition w-fit">
              {t('login.createAccount')}
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
