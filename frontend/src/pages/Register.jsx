import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ChartColumnIncreasing, Handshake, UserRoundPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      role: 'CITIZEN'
    }
  });
  const selectedRole = watch('role');

  const onSubmit = async (values) => {
    try {
      setError('');
      await registerUser(values);
      setSuccess(t('register.registrationSuccess'));
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(err.response?.data?.message || t('register.registrationFailed'));
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 md:p-8 page-enter">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-card border border-white/50 bg-white/80 dark:bg-slate-900/75 backdrop-blur-md">
        <div className="grid md:grid-cols-2">
          <aside className="hidden md:flex flex-col justify-center p-10 lg:p-14 bg-gradient-to-br from-secondary via-emerald-500 to-primary text-white">
            <p className="text-sm uppercase tracking-wider text-white/80">{t('register.join')}</p>
            <h2 className="mt-3 text-4xl font-heading font-bold leading-tight">{t('register.title')}</h2>
            <p className="mt-5 text-white/95 leading-relaxed max-w-md">
              {t('register.description')}
            </p>

            <div className="mt-7 space-y-3 text-sm">
              <p className="rounded-xl bg-white/15 border border-white/25 px-4 py-3 flex items-center gap-2"><UserRoundPlus size={16} /> {t('register.easyOnboarding')}</p>
              <p className="rounded-xl bg-white/15 border border-white/25 px-4 py-3 flex items-center gap-2"><Handshake size={16} /> {t('register.transparentWorkflow')}</p>
              <p className="rounded-xl bg-white/15 border border-white/25 px-4 py-3 flex items-center gap-2"><ChartColumnIncreasing size={16} /> {t('register.betterInsights')}</p>
            </div>

            <Link to="/login" className="mt-8 inline-flex items-center justify-center rounded-xl bg-white text-primary px-6 py-3 font-semibold hover:bg-slate-100 transition w-fit">
              {t('register.alreadyAccount')}
            </Link>
          </aside>

          <section className="p-6 sm:p-10 md:p-12 lg:p-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">{t('register.accountCreation')}</p>
            <h1 className="mt-2 text-4xl font-heading font-semibold text-slate-900 dark:text-slate-100">{t('register.createAccount')}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{t('register.registerDescription')}</p>

            <form className="mt-7 space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80"
                  placeholder={t('register.fullName')}
                  {...register('name', {
                    required: t('register.validation.nameRequired'),
                    minLength: { value: 2, message: t('register.validation.nameMin') },
                    maxLength: { value: 60, message: t('register.validation.nameMax') }
                  })}
                />
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80"
                  placeholder={t('register.email')}
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
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80"
                  placeholder={t('register.phone')}
                  {...register('phone', {
                    required: t('register.validation.phoneRequired'),
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: t('register.validation.phoneInvalid')
                    }
                  })}
                />
                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80"
                  placeholder={t('register.password')}
                  {...register('password', {
                    required: t('register.validation.passwordRequired'),
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/,
                      message: t('register.validation.passwordInvalid')
                    }
                  })}
                />
                {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('register.selectRole')}</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setValue('role', 'CITIZEN', { shouldValidate: true, shouldDirty: true })}
                    className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                      selectedRole === 'CITIZEN'
                        ? 'bg-primary text-white border-primary shadow-soft'
                        : 'bg-slate-100/90 dark:bg-slate-800/80 border-slate-200 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {t('register.citizen')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('role', 'OFFICER', { shouldValidate: true, shouldDirty: true })}
                    className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                      selectedRole === 'OFFICER'
                        ? 'bg-primary text-white border-primary shadow-soft'
                        : 'bg-slate-100/90 dark:bg-slate-800/80 border-slate-200 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {t('register.officer')}
                  </button>
                </div>
                <input type="hidden" {...register('role', { required: t('register.validation.roleRequired') })} />
                {errors.role && <p className="text-xs text-rose-600 mt-1">{errors.role.message}</p>}
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}
              {success && <p className="text-sm text-emerald-700">{success}</p>}

              <button
                className="w-full rounded-lg bg-primary text-white py-3 font-medium hover:opacity-95 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('register.creating') : t('register.create')}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
