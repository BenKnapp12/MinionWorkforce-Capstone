export default function VillainBadge({ villain }) {
  const fallback = '/villains/default.png';

  const handleError = (e) => {
    const fallbackUrl = window.location.origin + fallback;
    if (!e.target.src.endsWith(fallback)) {
      e.target.src = fallback;
    }
  };

  return (
    <div className="flex items-center gap-2 villain-badge">
      <img
        src={villain?.imageUrl || fallback}
        alt={`Avatar of ${villain?.name || 'Unknown Villain'}`}
        title={villain?.name}
        className="w-8 h-8 rounded-full object-cover border border-gray-300"
        onError={handleError}
      />
      <span className="font-medium text-sm">
        {villain?.avatar ? `${villain.avatar} ` : ''}{villain?.name || 'Unknown'}
      </span>
    </div>
  );
}