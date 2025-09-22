import './TopMinions.css';
import { useGetReviewsQuery } from '../api/reviewsApi.js';

export default function TopMinions() {
  const { data: reviews = [] } = useGetReviewsQuery();

  const grouped = reviews.reduce((acc, r) => {
    const name = r.minion.name;
    if (!acc[name]) {
      acc[name] = { minion: r.minion, reviews: [] };
    }
    acc[name].reviews.push(r);
    return acc;
  }, {});

  const topThree = Object.values(grouped)
    .sort((a, b) => b.reviews.length - a.reviews.length)
    .slice(0, 3);

  return (
    <div className="podium-wrapper">
      <h1 className="top-title">🔥 Top Minions 🔥</h1>
      <div className="podium-container">
        {topThree.map(({ minion, reviews }, index) => {
          const avgRating = reviews.length
            ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
            : 0;

          const rankClass = `rank-${index + 1}`;
          const ringClass =
            index === 0 ? 'flame-ring-gold' :
            index === 1 ? 'flame-ring-silver' :
            index === 2 ? 'flame-ring-bronze' : '';

          return (
            <div key={minion.name} className={`flame-card ${rankClass} ${ringClass}`}>
              <div className="flame-avatar-wrapper">
                <img
                  src={minion.imageUrl}
                  alt={minion.name}
                  className="flame-avatar"
                  data-rating={String(avgRating)}
                  title={`Rating: ${avgRating} stars`}
                />
                <div className="flame-particles" />
                <div className="flame-overlay" />
                <div className="rank-badge">#{index + 1}</div>
              </div>
              <h3 className="flame-name">{minion.name}</h3>
              <p className="flame-meta">
                {reviews.length} review{reviews.length !== 1 && 's'} • {avgRating}⭐
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}