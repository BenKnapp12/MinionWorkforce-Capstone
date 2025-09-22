import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetReviewsQuery } from '../api/reviewsApi.js';
import VillainBadge from '../components/VillainBadge.jsx';
import RatingStars from '../components/RatingStars.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import ReserveModal from '../components/ReserveModal.jsx';
import '../styles/reviews.css';

export default function Reviews() {
  const { data: reviews = [] } = useGetReviewsQuery();
  const location = useLocation();
  const [minChaos, setMinChaos] = useState(0);
  const [minRating, setMinRating] = useState(1);
  const [villainFilter, setVillainFilter] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedMinion, setSelectedMinion] = useState(null);
  const [reservedMinions, setReservedMinions] = useState([]);
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!location.state?.targetMinionId) return;

    const observer = new MutationObserver(() => {
      const el = document.getElementById(`review-${location.state.targetMinionId}`);
      if (el) {
        el.classList.add('scroll-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => el.classList.remove('scroll-highlight'), 2000);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [location.state]);

  const averages = useMemo(() => {
    const total = reviews.length;
    const chaos = reviews.reduce((sum, r) => sum + r.minion.chaosLevel, 0);
    const bananas = reviews.reduce((sum, r) => sum + r.minion.bananaAffinity, 0);
    const success = reviews.reduce((sum, r) => sum + r.minion.missionSuccess, 0);
    return {
      chaos: total ? (chaos / total).toFixed(1) : 'N/A',
      bananas: total ? (bananas / total).toFixed(1) : 'N/A',
      success: total ? (success / total).toFixed(1) : 'N/A'
    };
  }, [reviews]);

  const filtered = reviews
    .filter((r) => r.minion.chaosLevel >= minChaos)
    .filter((r) => r.rating >= minRating)
    .filter((r) =>
      villainFilter ? r.villain.name.toLowerCase().includes(villainFilter.toLowerCase()) : true
    );

  const sorted = [...filtered].sort((a, b) => {
    const getValue = (r) => {
      switch (sortBy) {
        case 'chaos': return r.minion.chaosLevel;
        case 'banana': return r.minion.bananaAffinity;
        case 'success': return r.minion.missionSuccess;
        case 'rating': return r.rating;
        case 'minion': return r.minion.name.toLowerCase();
        case 'villain': return r.villain.name.toLowerCase();
        case 'length': return r.comment?.length || 0;
        default: return 0;
      }
    };
    const valA = getValue(a);
    const valB = getValue(b);
    if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const grouped = sorted.reduce((acc, r) => {
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

  const handleReserve = (minion, note = '') => {
    const alreadyReserved = reservedMinions.some((m) => m.name === minion.name);
    if (!alreadyReserved) {
      setReservedMinions((prev) => [
        ...prev,
        {
          ...minion,
          reservedAt: new Date().toISOString(),
          note
        }
      ]);
    }
    setSelectedMinion(null);
  };

  const releaseMinion = (name) => {
    setReservedMinions((prev) => prev.filter((m) => m.name !== name));
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-villainPurple mb-4">All Reviews</h2>

      {token && <ReviewForm token={token} />}

      <div className="review-controls-container mb-8">
        <div className="review-filters sticky top-0 bg-white py-2 z-10 border-b border-yellow-300">
          <div className="flex flex-wrap gap-4 items-center justify-center max-w-4xl mx-auto px-2">
            {/* Filter Inputs */}
            {/* ... unchanged ... */}
          </div>
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-700">
        <p>Average Chaos Level: <span className="font-semibold">{averages.chaos}</span></p>
        <p>Average Banana Affinity: <span className="font-semibold">{averages.bananas}</span></p>
        <p>Average Mission Success: <span className="font-semibold">{averages.success}%</span></p>
      </div>

      <div className="space-y-12">
        {Object.values(grouped).map(({ minion, reviews: minionReviews }) => {
          const avgRating = minionReviews.length
            ? Math.round(minionReviews.reduce((sum, r) => sum + r.rating, 0) / minionReviews.length)
            : 0;

          const totalScore = minion.chaosLevel + minion.bananaAffinity + minion.missionSuccess / 10;
          const tier =
            totalScore >= 25 ? 'Legendary' :
            totalScore >= 20 ? 'Epic' :
            totalScore >= 15 ? 'Rare' : 'Common';

          return (
            <div
              key={minion.name}
              id={`review-${minion.id}`}
              className={`review-card review-site-card collectible-card tier-${tier.toLowerCase()}`}
            >
              <div className="minion-card-grid">
                <div className="minion-info">
                  <span className="tier-badge">{tier}</span>
                  <img src={minion.imageUrl} alt={minion.name} className="minion-avatar" />
                  <h3 className="text-lg font-bold mt-2">{minion.name}</h3>
                  <RatingStars rating={avgRating} />
                  <div className="trait-summary mt-2 text-sm text-gray-700">
                    <span>🧬 {minion.chaosLevel}</span>{' '}
                    <span>🍌 {minion.bananaAffinity}</span>{' '}
                    <span>🎯 {minion.missionSuccess}%</span>
                  </div>
                  <button
                    className="claim-button mt-3"
                    onClick={() => setSelectedMinion(minion)}
                    title="Reserve this minion for your next mission"
                  >
                    Reserve This Minion
                  </button>
                </div>

                <div className="review-thread">
                  {minionReviews.map((r) => (
                    <div key={r.id} className="review-card bg-white p-4 rounded shadow">
                      <RatingStars rating={r.rating} />
                      {r.comment && (
                        <p className="italic text-sm mt-1">"{r.comment}"</p>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        <VillainBadge villain={r.villain} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMinion && (
        <ReserveModal
          minion={selectedMinion}
          onClose={() => setSelectedMinion(null)}
          onReserve={handleReserve}
        />
      )}

      {reservedMinions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-villainPurple mb-4">Your Reserved Minions</h2>
          <div className="reserved-grid">
            {reservedMinions.map((minion) => (
              <div key={minion.name} className="reserved-card">
                <span className="tier-badge">Reserved</span>
                <img src={minion.imageUrl} alt={minion.name} className="minion-avatar" />
                               <div className="trait-summary text-sm mt-2">
                  <span>🧬 {minion.chaosLevel}</span>{' '}
                  <span>🍌 {minion.bananaAffinity}</span>{' '}
                  <span>🎯 {minion.missionSuccess}%</span>
                </div>
                {minion.note && (
                  <p className="text-xs text-gray-500 mt-1">Note: {minion.note}</p>
                )}
                <button
                  className="release-button mt-3"
                  onClick={() => releaseMinion(minion.name)}
                >
                  Release Minion
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
