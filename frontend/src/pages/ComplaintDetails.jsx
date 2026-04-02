import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Loader from '../components/Loader';
import { STATUS_COLORS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function ComplaintDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadComplaint = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/complaints');
        setComplaint(data.find((item) => Number(item.id) === Number(id)));
      } catch (err) {
        setError(err.response?.data?.message || t('complaintDetails.failedLoad'));
      } finally {
        setLoading(false);
      }
    };
    loadComplaint();
  }, [id]);

  const reopenComplaint = async () => {
    await api.put('/complaints/status', { complaintId: complaint.id, status: 'REOPENED' });
    setComplaint({ ...complaint, status: 'REOPENED' });
  };

  if (loading) return <Loader />;
  if (error) return <div className="glass rounded-2xl p-6 shadow-card text-rose-600">{error}</div>;
  if (!complaint) return <div className="glass rounded-2xl p-6">{t('complaintDetails.notFound')}</div>;

  return (
    <div className="glass rounded-2xl p-6 shadow-card space-y-4">
      <h2 className="text-2xl font-heading font-semibold">{t('complaintDetails.title', { id: complaint.id })}</h2>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[complaint.status]}`}>{t(`status.${complaint.status}`, { defaultValue: complaint.status.replace('_', ' ') })}</span>
      <div>
        <p className="font-semibold">{complaint.title}</p>
        <p className="text-slate-600 mt-2">{complaint.description}</p>
      </div>
      <div className="text-sm text-slate-600 space-y-1">
        <p>{t('complaintDetails.category')}: {t(`categories.${complaint.category}`, { defaultValue: complaint.category.replace('_', ' ') })}</p>
        <p>{t('complaintDetails.location')}: {complaint.location}</p>
        <p>{t('complaintDetails.priority')}: {complaint.priority}</p>
      </div>
      {complaint.imageUrl && <img src={`http://localhost:8080${complaint.imageUrl}`} alt="complaint" className="rounded-xl h-64 object-cover" />}
      {user?.role === 'CITIZEN' && complaint.status === 'RESOLVED' && (
        <div className="flex gap-3">
          <Link to={`/feedback/${complaint.id}`} className="px-4 py-2 rounded-lg bg-primary text-white">{t('complaintDetails.rateService')}</Link>
          <button onClick={reopenComplaint} className="px-4 py-2 rounded-lg bg-rose-100 text-rose-700">{t('complaintDetails.reopen')}</button>
        </div>
      )}
    </div>
  );
}
