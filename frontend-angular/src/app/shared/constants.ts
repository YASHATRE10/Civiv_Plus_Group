export const COMPLAINT_CATEGORIES = [
  'WATER_SUPPLY',
  'STREET_LIGHT',
  'GARBAGE',
  'ROAD_DAMAGE',
  'PUBLIC_SAFETY'
] as const;

export const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  REOPENED: 'bg-rose-100 text-rose-700'
};

export const LANGUAGE_STORAGE_KEY = 'civicpulse_language';
