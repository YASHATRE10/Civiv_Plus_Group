import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      setError('');
      setSuccess('');
      setResetToken('');
      const { data } = await api.post('/auth/forgot-password', values);
      setSuccess(data.message || t('forgotPassword.generated'));
      setResetToken(data.resetToken || '');
    } catch (err) {
      setError(err.response?.data?.message || t('forgotPassword.failed'));
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="glass w-full max-w-md rounded-3xl shadow-soft p-8">
        <h1 className="text-3xl font-heading font-semibold gradient-text">{t('forgotPassword.title')}</h1>
        <p className="mt-2 text-sm text-slate-500">{t('forgotPassword.description')}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70"
              placeholder="Email"
              {...register('email', {
                required: t('forgotPassword.validation.emailRequired'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('forgotPassword.validation.emailInvalid')
                }
              })}
            />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}
          {success && <p className="text-sm text-emerald-700">{success}</p>}

          <button disabled={isSubmitting} className="w-full rounded-xl bg-primary text-white py-3 font-medium hover:opacity-95">
            {isSubmitting ? t('forgotPassword.generating') : t('forgotPassword.generate')}
          </button>
        </form>

        {resetToken && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p className="font-medium">{t('forgotPassword.useToken')}</p>
            <p className="mt-1 break-all">{resetToken}</p>
            <Link to={`/reset-password?token=${encodeURIComponent(resetToken)}`} className="mt-2 inline-block text-primary font-medium">
              {t('forgotPassword.continueReset')}
            </Link>
          </div>
        )}

        <p className="mt-4 text-sm text-slate-600">
          {t('forgotPassword.backTo')} <Link to="/login" className="text-primary font-medium">{t('landing.login')}</Link>
        </p>
      </div>
    </div>
  );
}
