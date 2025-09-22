import { useState } from 'react';

export default function ReviewForm({ token }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [minionId, setMinionId] = useState('');
  const [villainId, setVillainId] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment, minionId, villainId })
      });
      if (res.ok) {
        setStatus('success');
        setComment('');
        setMinionId('');
        setVillainId('');
        setRating(5);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  // Trait-based glow logic for rating
  const ratingClass =
    rating === 5 ? 'success-glow' :
    rating <= 2 ? 'chaos-glow' :
    '';

  return (
    <form onSubmit={handleSubmit} className="form-container fade-in">
      <h3 className="text-lg font-bold mb-4 text-villainPurple">Submit a Review</h3>

      <label>Rating (1–5)</label>
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(parseInt(e.target.value))}
        min={1}
        max={5}
        className={`trait-input ${ratingClass}`}
        required
      />

      <label>Comment</label>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment"
      />

      <label>Minion ID</label>
      <input
        type="text"
        value={minionId}
        onChange={(e) => setMinionId(e.target.value)}
        placeholder="e.g. 1"
        required
      />

      <label>Villain ID</label>
      <input
        type="text"
        value={villainId}
        onChange={(e) => setVillainId(e.target.value)}
        placeholder="e.g. 2"
        required
      />

      <button type="submit">Submit Review</button>

      {status === 'success' && (
        <div className="form-feedback success">
          ✅ Review submitted successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="form-feedback error">
          ❌ Something went wrong. Try again!
        </div>
      )}
    </form>
  );
}