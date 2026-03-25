import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api from '../services/api';

export default function ResetPassword() {
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
        setError('Passwords do not match');
        return;
      }

      await api.post('/auth/reset-password', {
        token: values.token,
        newPassword: values.newPassword
      });
      setSuccess('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="glass w-full max-w-md rounded-3xl shadow-soft p-8">
        <h1 className="text-3xl font-heading font-semibold gradient-text">Reset password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter reset token and your new password.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70"
              placeholder="Reset token"
              {...register('token', {
                required: 'Token is required',
                minLength: {
                  value: 20,
                  message: 'Invalid reset token'
                }
              })}
            />
            {errors.token && <p className="text-xs text-rose-600 mt-1">{errors.token.message}</p>}
          </div>

          <div>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70"
              placeholder="New password"
              {...register('newPassword', {
                required: 'Password is required',
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/,
                  message: 'Use 8-64 chars with uppercase, lowercase, number and special character'
                }
              })}
            />
            {errors.newPassword && <p className="text-xs text-rose-600 mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70"
              placeholder="Confirm new password"
              {...register('confirmPassword', { required: 'Confirm your password' })}
            />
            {errors.confirmPassword && <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}
          {success && <p className="text-sm text-emerald-700">{success}</p>}

          <button disabled={isSubmitting} className="w-full rounded-xl bg-primary text-white py-3 font-medium hover:opacity-95">
            {isSubmitting ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Back to <Link to="/login" className="text-primary font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
