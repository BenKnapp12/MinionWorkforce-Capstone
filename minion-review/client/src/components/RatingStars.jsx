export default function RatingStars({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(rating)].map((_, i) => (
        <span key={i}>⭐</span>
      ))}
    </div>
  );
}
