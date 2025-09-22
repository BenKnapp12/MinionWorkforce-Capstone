import { useNavigate } from 'react-router-dom';

export default function MinionCard({ minion }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/reviews', { state: { targetMinionId: minion.id } });
  };

  return (
    <div className="minion-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={minion.imageUrl} alt={minion.name} />
      <div>
        <h3>{minion.name}</h3>
        <p className="review-count">
          {minion.reviews.length} {minion.reviews.length === 1 ? 'review' : 'reviews'}
        </p>
        <div className="stars">
          {'★'.repeat(
            Math.max(
              1,
              Math.round(
                minion.reviews.reduce((acc, r) => acc + r.rating, 0) / (minion.reviews.length || 1)
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}