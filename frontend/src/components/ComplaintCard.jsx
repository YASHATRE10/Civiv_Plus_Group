import { CalendarDays, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { STATUS_COLORS } from '../utils/constants';

export default function ComplaintCard({ complaint, actionSlot }) {
  const { t } = useTranslation();
  return (
    <div className="glass rounded-2xl p-4 shadow-card hover-lift fade-up fade-up-delay-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-800">{complaint.title}</h3>
          <p className="text-xs text-slate-500 mt-1">#{complaint.id} - {t(`categories.${complaint.category}`, { defaultValue: complaint.category.replace('_', ' ') })}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[complaint.status]}`}>
          {t(`status.${complaint.status}`, { defaultValue: complaint.status.replace('_', ' ') })}
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-3 line-clamp-2">{complaint.description}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1"><MapPin size={14} /> {complaint.location}</span>
        <span className="inline-flex items-center gap-1"><CalendarDays size={14} /> {new Date(complaint.submissionDate).toLocaleDateString()}</span>
      </div>
      {actionSlot ? <div className="mt-4">{actionSlot}</div> : null}
    </div>
  );
}
