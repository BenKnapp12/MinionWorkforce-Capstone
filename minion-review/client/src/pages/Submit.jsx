import { useSubmitReviewMutation } from '../api/reviewsApi.js';
import { useState } from 'react';

export default function Submit() {
  const [minionId, setMinionId] = useState('');
  const [villainId, setVillainId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitReview] = useSubmitReviewMutation();

  const handleSubmit = async () => {
    await submitReview({ minionId: Number(minionId), villainId: Number(villainId), rating, comment });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Submit a Review</h2>
      <input className="border p-2 mb-2 w-full" placeholder="Minion ID" onChange={(e) => setMinionId(e.target.value)} />
      <input className="border p-2 mb-2 w-full" placeholder="Villain ID" onChange={(e) => setVillainId(e.target.value)} />
      <input className="border p-2 mb-2 w-full" type="number" placeholder="Rating" onChange={(e) => setRating(e.target.value)} />
      <textarea className="border p-2 mb-2 w-full" placeholder="Comment" onChange={(e) => setComment(e.target.value)} />
      <button className="bg-bananaYellow px-4 py-2" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
