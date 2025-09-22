import { useGetReviewsQuery } from '../api/reviewsApi.js';
import RatingStars from '../components/RatingStars.jsx';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { data: reviews = [] } = useGetReviewsQuery();
  const navigate = useNavigate();

  const grouped = reviews.reduce((acc, r) => {
    const name = r.minion.name;
    if (!acc[name]) {
      acc[name] = {
        minion: r.minion,
        reviews: []
      };
    }
    acc[name].reviews.push(r);
    return acc;
  }, {});

  const sortedMinions = Object.values(grouped).sort(
    (a, b) => b.reviews.length - a.reviews.length
  );

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center text-villainPurple mb-8">
        Minion Review HQ
      </h1>

      <div className="home-minion-grid">
        {sortedMinions.map(({ minion, reviews }, index) => {
          const avgRating = reviews.length
            ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
            : 0;

          const totalScore = minion.chaosLevel + minion.bananaAffinity + minion.missionSuccess / 10;
          const tier =
            totalScore >= 25 ? 'Legendary' :
            totalScore >= 20 ? 'Epic' :
            totalScore >= 15 ? 'Rare' : 'Common';

          const ratingClass =
            avgRating === 5 ? 'rating-5' :
            avgRating >= 3 ? 'rating-3-4' :
            avgRating >= 1 ? 'rating-1-2' : '';

          const traitClass = [
            minion.chaosLevel >= 8 ? 'chaos-glow' : '',
            minion.bananaAffinity >= 8 ? 'banana-glow' : '',
            minion.missionSuccess >= 90 ? 'success-glow' : ''
          ].filter(Boolean).join(' ');

          const leaderboardClass =
            index === 0 ? 'gold-ring' :
            index === 1 ? 'silver-ring' :
            index === 2 ? 'bronze-ring' : '';

          const avatarClass = [
            'minion-avatar',
            ratingClass,
            traitClass,
            leaderboardClass
          ].filter(Boolean).join(' ');

          const recentComment = reviews.find(r => r.comment)?.comment;

          const handleClick = () => {
            navigate('/reviews', { state: { targetMinionId: minion.id } });
          };

          return (
            <div
              key={minion.name}
              className={`home-minion-card tier-${tier.toLowerCase()}`}
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
            >
              <div className="tier-badge">{tier}</div>
              <img
                src={minion.imageUrl}
                alt={minion.name}
                className={avatarClass}
                data-rating={String(avgRating)}
                title={`Rating: ${avgRating} stars`}
              />
              <h3 className="text-lg font-semibold mt-2">{minion.name}</h3>
              <p className="text-sm text-gray-600">
                {reviews.length} review{reviews.length !== 1 && 's'}
              </p>
              <div className="stars mt-1">
                {avgRating > 0 ? '⭐'.repeat(avgRating) : 'No ratings yet'}
              </div>

              <div className="trait-summary mt-2 text-xs text-gray-700">
                <span>🧬 Chaos: {minion.chaosLevel}</span>{' '}
                <span>🍌 Banana: {minion.bananaAffinity}</span>{' '}
                <span>🎯 Success: {minion.missionSuccess}%</span>
              </div>

              {recentComment && (
                <p className="recent-comment italic text-xs text-gray-500 mt-2">
                  “{recentComment.length > 60 ? recentComment.slice(0, 60) + '…' : recentComment}”
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}