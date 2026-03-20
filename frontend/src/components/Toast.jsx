export default function Toast({ message, type = 'success', onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <div
        className={`rounded-xl px-4 py-3 text-sm shadow-card ${
          type === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <span>{message}</span>
          <button onClick={onClose} className="font-bold">x</button>
        </div>
      </div>
    </div>
  );
}
