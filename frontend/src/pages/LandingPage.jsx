import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const highlights = [
    {
      emoji: '📍',
      title: t('landing.highlights.tracking.title'),
      description: t('landing.highlights.tracking.description')
    },
    {
      emoji: '🧭',
      title: t('landing.highlights.transparency.title'),
      description: t('landing.highlights.transparency.description')
    },
    {
      emoji: '📊',
      title: t('landing.highlights.reporting.title'),
      description: t('landing.highlights.reporting.description')
    }
  ];

  return (
    <div className="min-h-screen px-4 py-8 md:py-12 page-enter">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="glass rounded-2xl p-6 md:p-10 shadow-soft border border-white/50 fade-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{t('landing.badge')} ✨</p>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mt-2 leading-tight">
            {t('landing.title')} 🏛️
          </h1>
          <p className="mt-4 text-slate-600 max-w-3xl text-base md:text-lg">
            {t('landing.description')}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="rounded-xl bg-primary text-white px-5 py-3 font-semibold shadow-soft hover-lift btn-shine"
              >
                {t('landing.openDashboard')}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl bg-primary text-white px-5 py-3 font-semibold shadow-soft hover-lift btn-shine"
                >
                  {t('landing.login')}
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-secondary text-white px-5 py-3 font-semibold shadow-soft hover-lift btn-shine"
                >
                  {t('landing.createAccount')}
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map((item, index) => (
            <article
              key={item.title}
              className={`glass rounded-2xl p-6 shadow-card border border-white/50 hover-lift fade-up ${
                index === 0 ? 'fade-up-delay-1' : index === 1 ? 'fade-up-delay-2' : 'fade-up-delay-3'
              }`}
            >
              <h2 className="text-lg font-heading font-semibold text-slate-900">{item.emoji} {item.title}</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="glass rounded-2xl p-6 md:p-8 shadow-card border border-white/50 fade-up fade-up-delay-2">
          <h2 className="text-2xl font-heading font-semibold text-slate-900">{t('landing.howItWorks')} ⚙️</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="rounded-xl bg-white/70 p-4 hover-lift">
              <p className="text-sm font-semibold text-primary">{t('landing.steps.oneTitle')} 📝</p>
              <p className="text-sm text-slate-700 mt-1">{t('landing.steps.oneDescription')}</p>
            </div>
            <div className="rounded-xl bg-white/70 p-4 hover-lift">
              <p className="text-sm font-semibold text-primary">{t('landing.steps.twoTitle')} 🛠️</p>
              <p className="text-sm text-slate-700 mt-1">{t('landing.steps.twoDescription')}</p>
            </div>
            <div className="rounded-xl bg-white/70 p-4 hover-lift">
              <p className="text-sm font-semibold text-primary">{t('landing.steps.threeTitle')} ✅</p>
              <p className="text-sm text-slate-700 mt-1">{t('landing.steps.threeDescription')}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}