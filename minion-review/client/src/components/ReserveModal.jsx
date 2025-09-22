import { useState } from 'react';

export default function ReserveModal({ minion, onClose, onReserve }) {
  const [note, setNote] = useState('');

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-2">Reserve {minion.name}</h2>
        <img src={minion.imageUrl} alt={minion.name} className="modal-avatar" />
        <textarea
          placeholder="Optional message..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="modal-textarea"
        />
        <div className="modal-actions">
          <button
            className="modal-confirm"
            onClick={() => {
              onReserve(minion, note); // ✅ This triggers the reservation logic
            }}
          >
            Confirm Reservation
          </button>
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}