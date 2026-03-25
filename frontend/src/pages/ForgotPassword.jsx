import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api from '../services/api';

export default function ForgotPassword() {
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
      setSuccess(data.message || 'Reset token generated');
      setResetToken(data.resetToken || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to process request');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="glass w-full max-w-md rounded-3xl shadow-soft p-8">
        <h1 className="text-3xl font-heading font-semibold gradient-text">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your account email to get a reset token.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70"
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

          {error && <p className="text-sm text-rose-600">{error}</p>}
          {success && <p className="text-sm text-emerald-700">{success}</p>}

          <button disabled={isSubmitting} className="w-full rounded-xl bg-primary text-white py-3 font-medium hover:opacity-95">
            {isSubmitting ? 'Generating token...' : 'Generate reset token'}
          </button>
        </form>

        {resetToken && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p className="font-medium">Use this token to reset your password:</p>
            <p className="mt-1 break-all">{resetToken}</p>
            <Link to={`/reset-password?token=${encodeURIComponent(resetToken)}`} className="mt-2 inline-block text-primary font-medium">
              Continue to reset password
            </Link>
          </div>
        )}

        <p className="mt-4 text-sm text-slate-600">
          Back to <Link to="/login" className="text-primary font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
