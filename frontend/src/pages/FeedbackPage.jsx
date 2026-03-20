import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import api from '../services/api';
import Toast from '../components/Toast';

export default function FeedbackPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const submitFeedback = async () => {
    setLoading(true);
    try {
      await api.post('/feedback', {
        complaintId: Number(id),
        rating,
        comment
      });
      navigate('/citizen');
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to submit feedback', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-card max-w-xl space-y-4">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <h2 className="text-2xl font-heading font-semibold">Rate Resolution Service</h2>
      <p className="text-sm text-slate-500">Share your feedback to improve service quality</p>
      <RatingStars value={rating} onChange={setRating} />
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 min-h-28" placeholder="Comment" />
      <button disabled={loading} onClick={submitFeedback} className="rounded-xl bg-secondary text-white px-6 py-3">
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
}
