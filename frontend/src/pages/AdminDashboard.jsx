import { useEffect, useMemo, useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js';
import api from '../services/api';
import Loader from '../components/Loader';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement);

export default function AdminDashboard({ chartOnly = false }) {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [reports, setReports] = useState({ categories: [], monthly: [], sla: [] });
  const [filters, setFilters] = useState({ search: '', status: 'ALL' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [complaintsRes, usersRes, categoriesRes, monthlyRes, slaRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/auth/users'),
        api.get('/reports/categories'),
        api.get('/reports/monthly'),
        api.get('/reports/sla')
      ]);
      setComplaints(complaintsRes.data);
      setOfficers(usersRes.data.filter((u) => u.role === 'OFFICER'));
      setReports({
        categories: categoriesRes.data,
        monthly: monthlyRes.data,
        sla: slaRes.data
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const assignComplaint = async (complaintId, officerId, priority) => {
    await api.put('/complaints/assign', {
      complaintId,
      officerId: Number(officerId),
      priority,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    loadData();
  };

  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((c) => (filters.status === 'ALL' ? true : c.status === filters.status))
      .filter((c) => c.title.toLowerCase().includes(filters.search.toLowerCase()))
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
  }, [complaints, filters]);

  const cardData = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'PENDING').length,
    resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
    avgTime:
      reports.sla.length > 0
        ? Math.round(reports.sla.reduce((acc, item) => acc + item.days, 0) / reports.sla.length)
        : 0
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="glass rounded-2xl p-6 shadow-card">
        <h2 className="text-2xl font-heading font-semibold">Admin Command Center</h2>
        <p className="mt-3 text-sm text-rose-600">{error}</p>
        <button onClick={loadData} className="mt-4 rounded-xl bg-primary px-4 py-2 text-white">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-heading font-semibold">Admin Command Center</h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Complaints" value={cardData.total} />
        <StatCard title="Pending" value={cardData.pending} color="text-accent" />
        <StatCard title="Resolved" value={cardData.resolved} color="text-secondary" />
        <StatCard title="Avg Resolution (days)" value={cardData.avgTime} color="text-primary" />
        <StatCard title="Active Officers" value={officers.length} color="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartPanel title="Complaints by Category">
          <Pie
            data={{
              labels: reports.categories.map((i) => i.category.replace('_', ' ')),
              datasets: [{ data: reports.categories.map((i) => i.count), backgroundColor: ['#2563EB', '#10B981', '#F59E0B', '#0EA5E9', '#F43F5E'] }]
            }}
          />
        </ChartPanel>
        <ChartPanel title="Monthly Complaints">
          <Bar
            data={{
              labels: reports.monthly.map((i) => i.month),
              datasets: [{ label: 'Complaints', data: reports.monthly.map((i) => i.count), backgroundColor: '#2563EB' }]
            }}
          />
        </ChartPanel>
        <ChartPanel title="Resolution Time Trend">
          <Line
            data={{
              labels: reports.sla.map((i) => `#${i.id}`),
              datasets: [{ label: 'Days', data: reports.sla.map((i) => i.days), borderColor: '#10B981', tension: 0.35 }]
            }}
          />
        </ChartPanel>
        <div className="glass rounded-2xl p-4 shadow-card">
          <h3 className="font-semibold mb-4">Problem Zones Heat Cards</h3>
          <div className="grid grid-cols-2 gap-3">
            {['North', 'South', 'East', 'West'].map((zone, idx) => (
              <div key={zone} className={`rounded-xl p-4 text-white ${['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][idx]}`}>
                <p className="text-xs uppercase opacity-80">{zone} Zone</p>
                <p className="text-2xl font-semibold">{Math.max(1, complaints.filter((c) => c.location.toLowerCase().includes(zone.toLowerCase())).length)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!chartOnly && (
        <div className="glass rounded-2xl p-4 shadow-card overflow-x-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between mb-4">
            <h3 className="font-semibold">Manage Complaints</h3>
            <div className="flex gap-2">
              <input
                placeholder="Search"
                className="rounded-lg border border-slate-200 px-3 py-2"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
              <select
                className="rounded-lg border border-slate-200 px-3 py-2"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REOPENED">Reopened</option>
              </select>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2">ID</th><th>Title</th><th>Status</th><th>Date</th><th>Assign</th><th>Priority</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <AdminRow key={c.id} complaint={c} officers={officers} onAssign={assignComplaint} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminRow({ complaint, officers, onAssign }) {
  const [officerId, setOfficerId] = useState(complaint.assignedOfficerId || '');
  const [priority, setPriority] = useState(complaint.priority || 'MEDIUM');

  return (
    <tr className="border-b last:border-b-0">
      <td className="py-3">#{complaint.id}</td>
      <td>{complaint.title}</td>
      <td>{complaint.status.replace('_', ' ')}</td>
      <td>{new Date(complaint.submissionDate).toLocaleDateString()}</td>
      <td>
        <select className="rounded-lg border px-2 py-1" value={officerId} onChange={(e) => setOfficerId(e.target.value)}>
          <option value="">Select officer</option>
          {officers.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </td>
      <td>
        <select className="rounded-lg border px-2 py-1" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </td>
      <td>
        <button disabled={!officerId || complaint.status === 'RESOLVED'} onClick={() => onAssign(complaint.id, officerId, priority)} className="px-3 py-1 rounded-lg bg-primary text-white disabled:opacity-50" title={complaint.status === 'RESOLVED' ? 'Cannot reassign resolved complaints' : ''}>Assign</button>
      </td>
    </tr>
  );
}

function StatCard({ title, value, color = 'text-slate-800' }) {
  return (
    <div className="glass rounded-2xl p-4 shadow-card">
      <p className="text-xs uppercase text-slate-500">{title}</p>
      <p className={`text-3xl font-semibold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

function ChartPanel({ title, children }) {
  return (
    <div className="glass rounded-2xl p-4 shadow-card">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}
