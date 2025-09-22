import React from 'react';
import './ReviewCard.css';
import VillainBadge from './VillainBadge.jsx'; // ✅ Make sure this path is correct

const sentimentEmojiMap = {
  positive: '🌟',
  neutral: '🤔',
  negative: '😠',
};

export default function ReviewCard({ review, index }) {
  const { minion, villain, rating, comment, sentiment } = review;

  return (
    <div
      className="review-card"
      data-sentiment={sentiment}
      style={{ animationDelay: `${0.1 * (index + 1)}s` }}
    >
      {/* Emoji Badge */}
      <div className="emoji-badge">
        {sentimentEmojiMap[sentiment]}
      </div>

      {/* Minion Image */}
      <img src={minion.imageUrl} alt={minion.name} />

      {/* Review Content */}
      <div className="review-content">
        <h3>{minion.name}</h3>
        <p className="stars">{'★'.repeat(rating)}</p>
        {comment && <p className="comment">"{comment}"</p>}

        {/* Villain Badge */}
        <VillainBadge villain={villain} />

        <div className="traits">
          <span>🧬 Chaos: {minion.chaosLevel}</span>
          <span>🍌 Bananas: {minion.bananaAffinity}</span>
          <span>🎯 Success: {minion.missionSuccess}%</span>
        </div>
      </div>
    </div>
  );
}
<img
  src={villain.imageUrl}
  alt={`Test image for ${villain.name}`}
  style={{ width: '100px', height: '100px', border: '2px solid red' }}
  onError={(e) => {
    console.warn('Villain image failed:', e.target.src);
    e.target.src = '/villains/default.png';
  }}
/>