import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api from '../services/api';
import { COMPLAINT_CATEGORIES } from '../utils/constants';
import Toast from '../components/Toast';

export default function SubmitComplaint() {
  const [preview, setPreview] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (k === 'image') {
          if (v?.[0]) formData.append('image', v[0]);
        } else {
          formData.append(k, v);
        }
      });
      await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      reset();
      setPreview('');
      setToast({ message: 'Complaint submitted successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to submit complaint', type: 'error' });
    }
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-card max-w-3xl">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <h2 className="text-2xl font-heading font-semibold">Submit Grievance</h2>
      <p className="text-sm text-slate-500">Raise an issue and help improve your city</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Complaint Title" {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>}
        </div>
        <textarea className="w-full rounded-xl border border-slate-200 px-4 py-3 min-h-28" placeholder="Description" {...register('description', { required: 'Description is required' })} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="rounded-xl border border-slate-200 px-4 py-3" {...register('category', { required: true })}>
            {COMPLAINT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
          </select>
          <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Location" {...register('location', { required: true })} />
        </div>
        <input
          type="file"
          accept="image/*"
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          {...register('image')}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPreview(URL.createObjectURL(file));
            }
          }}
        />
        {preview && <img src={preview} alt="preview" className="h-36 rounded-xl object-cover" />}
        <button disabled={isSubmitting} className="rounded-xl bg-primary text-white px-6 py-3">
          {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}
