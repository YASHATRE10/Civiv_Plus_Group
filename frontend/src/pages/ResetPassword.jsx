import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export default function ResetPassword() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      token: params.get('token') || ''
    }
  });

  const onSubmit = async (values) => {
    try {
      setError('');
      setSuccess('');
      if (values.newPassword !== values.confirmPassword) {
        setError(t('resetPassword.passwordMismatch'));
        return;
      }

      await api.post('/auth/reset-password', {
        token: values.token,
        newPassword: values.newPassword
      });
      setSuccess(t('resetPassword.success'));
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || t('resetPassword.failed'));
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="glass w-full max-w-md rounded-3xl shadow-soft p-8">
        <h1 className="text-3xl font-heading font-semibold gradient-text">{t('resetPassword.title')}</h1>
        <p className="mt-2 text-sm text-slate-500">{t('resetPassword.description')}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70"
              placeholder={t('resetPassword.token')}
              {...register('token', {
                required: t('resetPassword.validation.tokenRequired'),
                minLength: {
                  value: 20,
                  message: t('resetPassword.validation.tokenInvalid')
                }
              })}
            />
            {errors.token && <p className="text-xs text-rose-600 mt-1">{errors.token.message}</p>}
          </div>

          <div>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70"
              placeholder={t('resetPassword.newPassword')}
              {...register('newPassword', {
                required: t('resetPassword.validation.passwordRequired'),
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/,
                  message: t('register.validation.passwordInvalid')
                }
              })}
            />
            {errors.newPassword && <p className="text-xs text-rose-600 mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70"
              placeholder={t('resetPassword.confirmPassword')}
              {...register('confirmPassword', { required: t('resetPassword.validation.confirmRequired') })}
            />
            {errors.confirmPassword && <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}
          {success && <p className="text-sm text-emerald-700">{success}</p>}

          <button disabled={isSubmitting} className="w-full rounded-xl bg-primary text-white py-3 font-medium hover:opacity-95">
            {isSubmitting ? t('resetPassword.resetting') : t('resetPassword.reset')}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          {t('forgotPassword.backTo')} <Link to="/login" className="text-primary font-medium">{t('landing.login')}</Link>
        </p>
      </div>
    </div>
  );
}
