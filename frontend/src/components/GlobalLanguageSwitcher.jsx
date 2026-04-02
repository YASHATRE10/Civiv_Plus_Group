import { useTranslation } from 'react-i18next';

export default function GlobalLanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div className="fixed right-4 top-4 z-50">
      <label htmlFor="global-language-switcher" className="sr-only">
        {t('navbar.language')}
      </label>
      <select
        id="global-language-switcher"
        value={i18n.resolvedLanguage || i18n.language || 'en'}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        className="appearance-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2 pr-8 text-xs sm:text-sm font-medium text-slate-700 shadow-card backdrop-blur-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="en">{t('navbar.english')}</option>
        <option value="hi">{t('navbar.hindi')}</option>
        <option value="mr">{t('navbar.marathi')}</option>
      </select>
    </div>
  );
}