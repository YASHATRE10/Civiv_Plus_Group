import { Star } from 'lucide-react';

export default function RatingStars({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((num) => (
        <button key={num} type="button" onClick={() => onChange(num)}>
          <Star
            size={26}
            className={num <= value ? 'fill-accent text-accent' : 'text-slate-300'}
          />
        </button>
      ))}
    </div>
  );
}
