import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ChartColumnIncreasing, Handshake, UserRoundPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
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
      setSuccess('Registration successful. Please login.');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 md:p-8 page-enter">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-card border border-white/50 bg-white/80 dark:bg-slate-900/75 backdrop-blur-md">
        <div className="grid md:grid-cols-2">
          <aside className="hidden md:flex flex-col justify-center p-10 lg:p-14 bg-gradient-to-br from-secondary via-emerald-500 to-primary text-white">
            <p className="text-sm uppercase tracking-wider text-white/80">Join CivicPulse</p>
            <h2 className="mt-3 text-4xl font-heading font-bold leading-tight">Be Part Of Smarter Governance</h2>
            <p className="mt-5 text-white/95 leading-relaxed max-w-md">
              Create your account to report issues, collaborate with authorities, and improve local services for everyone.
            </p>

            <div className="mt-7 space-y-3 text-sm">
              <p className="rounded-xl bg-white/15 border border-white/25 px-4 py-3 flex items-center gap-2"><UserRoundPlus size={16} /> Easy onboarding for citizens and officers</p>
              <p className="rounded-xl bg-white/15 border border-white/25 px-4 py-3 flex items-center gap-2"><Handshake size={16} /> Transparent assignment workflow</p>
              <p className="rounded-xl bg-white/15 border border-white/25 px-4 py-3 flex items-center gap-2"><ChartColumnIncreasing size={16} /> Better city insights through data</p>
            </div>

            <Link to="/login" className="mt-8 inline-flex items-center justify-center rounded-xl bg-white text-primary px-6 py-3 font-semibold hover:bg-slate-100 transition w-fit">
              Already have an account? Sign in
            </Link>
          </aside>

          <section className="p-6 sm:p-10 md:p-12 lg:p-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Account Creation</p>
            <h1 className="mt-2 text-4xl font-heading font-semibold text-slate-900 dark:text-slate-100">Create Your Account</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Register to submit grievances, track tasks, and receive updates.</p>

            <form className="mt-7 space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80"
                  placeholder="Full Name"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    maxLength: { value: 60, message: 'Name must be at most 60 characters' }
                  })}
                />
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80"
                  placeholder="Email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email'
                    }
                  })}
                />
                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <input
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80"
                  placeholder="Phone"
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Phone must be exactly 10 digits'
                    }
                  })}
                />
                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80"
                  placeholder="Password"
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/,
                      message: 'Use 8-64 chars with uppercase, lowercase, number and special character'
                    }
                  })}
                />
                {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Select role</p>
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
                    Citizen
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
                    Officer
                  </button>
                </div>
                <input type="hidden" {...register('role', { required: 'Role is required' })} />
                {errors.role && <p className="text-xs text-rose-600 mt-1">{errors.role.message}</p>}
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}
              {success && <p className="text-sm text-emerald-700">{success}</p>}

              <button
                className="w-full rounded-lg bg-primary text-white py-3 font-medium hover:opacity-95 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
