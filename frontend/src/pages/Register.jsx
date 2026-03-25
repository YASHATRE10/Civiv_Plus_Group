import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

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
    <div className="min-h-screen grid place-items-center p-4">
      <div className="glass w-full max-w-lg rounded-3xl shadow-soft p-8">
        <h1 className="text-3xl font-heading font-semibold gradient-text">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">Sign up to start raising grievances</p>
        <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="md:col-span-2">
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70" placeholder="Full Name" {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
              maxLength: { value: 60, message: 'Name must be at most 60 characters' }
            })} />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input type="email" className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70" placeholder="Email" {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email'
              }
            })} />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70" placeholder="Phone" {...register('phone', {
              required: 'Phone is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Phone must be exactly 10 digits'
              }
            })} />
            {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <input type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70" placeholder="Password" {...register('password', {
              required: 'Password is required',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/,
                message: 'Use 8-64 chars with uppercase, lowercase, number and special character'
              }
            })} />
            {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white/70" {...register('role', { required: true })}>
              <option value="CITIZEN">Citizen</option>
              <option value="OFFICER">Officer</option>
            </select>
          </div>
          {error && <p className="text-sm text-rose-600 md:col-span-2">{error}</p>}
          {success && <p className="text-sm text-emerald-700 md:col-span-2">{success}</p>}
          <button className="md:col-span-2 rounded-xl bg-primary text-white py-3 font-medium" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Already registered? <Link to="/login" className="text-primary font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
