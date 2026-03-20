import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [notes, setNotes] = useState({});
  const [proofFiles, setProofFiles] = useState({});

  const loadComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/complaints', { params: { assignedOfficerId: user.id } });
      setComplaints(data.filter((c) => c.assignedOfficerId === user.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const updateStatus = async (complaintId, status) => {
    try {
      const payload = {
        complaintId,
        status,
        resolutionNote: notes[complaintId] || 'Updated by officer'
      };

      const selectedFile = proofFiles[complaintId];
      if (selectedFile) {
        const formData = new FormData();
        formData.append('payload', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        formData.append('proofImage', selectedFile);
        await api.put('/complaints/status', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.put('/complaints/status', payload);
      }

      setToast({ message: 'Status updated', type: 'success' });
      loadComplaints();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Update failed', type: 'error' });
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="glass rounded-2xl p-6 shadow-card text-rose-600">{error}</div>;

  return (
    <div className="space-y-4">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="glass rounded-2xl p-6 shadow-card">
        <h2 className="text-2xl font-heading font-semibold">Officer Panel</h2>
        <p className="text-sm text-slate-500">Manage assigned complaints and resolution progress</p>
      </div>
      {complaints.length === 0 ? (
        <div className="glass rounded-2xl p-8 shadow-card text-center">
          <h3 className="text-xl font-semibold text-slate-800">No complaints assigned yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            This page is working. It is empty because no complaint has been assigned to your officer account yet.
          </p>
          <button onClick={loadComplaints} className="mt-5 rounded-xl bg-primary px-4 py-2 text-white">
            Refresh
          </button>
        </div>
      ) : null}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {complaints.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            actionSlot={
              <div className="space-y-3">
                <textarea
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Add resolution note"
                  value={notes[complaint.id] || ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [complaint.id]: e.target.value }))}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setProofFiles((prev) => ({ ...prev, [complaint.id]: file }));
                  }}
                />
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(complaint.id, 'IN_PROGRESS')} className="px-3 py-2 rounded-lg text-sm bg-blue-100 text-blue-700">In Progress</button>
                  <button onClick={() => updateStatus(complaint.id, 'RESOLVED')} className="px-3 py-2 rounded-lg text-sm bg-emerald-100 text-emerald-700">Resolve</button>
                </div>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
