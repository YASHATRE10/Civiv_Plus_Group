import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RatingStars({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((num) => (
        <button key={num} type="button" onClick={() => onChange(num)} aria-label={t('ratingStars.rate', { value: num, defaultValue: `Rate ${num} stars` })}>
          <Star
            size={26}
            className={num <= value ? 'fill-accent text-accent' : 'text-slate-300'}
          />
        </button>
      ))}
    </div>
  );
}
