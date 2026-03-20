import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
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
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="glass w-full max-w-md rounded-3xl shadow-soft p-8">
        <h1 className="text-3xl font-heading font-semibold gradient-text">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Login to CivicPulse portal</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>}
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="rounded" /> Remember me
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button disabled={isSubmitting} className="w-full rounded-xl bg-primary text-white py-3 font-medium hover:opacity-95">
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          New user? <Link to="/register" className="text-primary font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
