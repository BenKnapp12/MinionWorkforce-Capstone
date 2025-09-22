export default function VillainBadge({ villain }) {
  return (
    <div className="flex items-center gap-2 villain-badge">
      <img src={villain.imageUrl} alt={villain.name} className="w-8 h-8 rounded-full" />
      <span>{villain.name}</span>
    </div>
  );
}