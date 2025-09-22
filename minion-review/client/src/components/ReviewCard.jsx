import React from 'react';
import './ReviewCard.css';

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
        <p className="villain-tag">Tag: {villain.name}</p>
        <div className="traits">
          <span>🧬 Chaos: {minion.chaosLevel}</span>
          <span>🍌 Bananas: {minion.bananaAffinity}</span>
          <span>🎯 Success: {minion.missionSuccess}%</span>
        </div>
      </div>
    </div>
  );
}