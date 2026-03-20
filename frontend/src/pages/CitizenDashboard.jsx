import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { STATUS_COLORS } from '../utils/constants';
import Loader from '../components/Loader';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/complaints/user/${user.id}`);
        setComplaints(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user.id]);

  if (loading) return <Loader />;
  if (error) return <div className="glass rounded-2xl p-6 shadow-card text-rose-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-semibold">Citizen Dashboard</h2>
          <p className="text-sm text-slate-500">Track your civic grievances and service feedback</p>
        </div>
        <Link to="/submit" className="rounded-xl bg-secondary text-white px-4 py-2 w-fit">Submit Complaint</Link>
      </div>

      <div className="glass rounded-2xl p-4 shadow-card overflow-x-auto">
        <h3 className="font-semibold mb-3">My Complaints</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">ID</th><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Details</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} className="border-b last:border-b-0">
                <td className="py-3">#{c.id}</td>
                <td>{c.title}</td>
                <td>{c.category.replace('_', ' ')}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[c.status]}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </td>
                <td>{new Date(c.submissionDate).toLocaleDateString()}</td>
                <td><Link className="text-primary" to={`/complaints/${c.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
