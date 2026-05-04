import { TYPE_COLORS } from '../utils/typeColors';

export default function ResultModal({ status, targetMove, guessCount, maxGuesses, onClose }) {
  const won = status === 'won';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal result-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="result-icon">{won ? '🎉' : '😢'}</div>
        <h2>{won ? 'Nice work!' : 'Better luck tomorrow!'}</h2>

        {won
          ? <p>You found <strong>{targetMove?.displayName}</strong> in {guessCount}/{maxGuesses} guesses!</p>
          : <p>The move was <strong>{targetMove?.displayName}</strong>.</p>
        }

        {targetMove && (
          <div className="result-chips">
            {targetMove.type && (
              <span
                className="chip chip-type"
                style={{
                  backgroundColor: TYPE_COLORS[targetMove.type]?.bg ?? '#888',
                  color: TYPE_COLORS[targetMove.type]?.text ?? '#fff',
                }}
              >
                {targetMove.type.charAt(0).toUpperCase() + targetMove.type.slice(1)}
              </span>
            )}
            {targetMove.category && (
              <span className="chip">
                {targetMove.category.charAt(0).toUpperCase() + targetMove.category.slice(1)}
              </span>
            )}
            {targetMove.power != null && <span className="chip">Power: {targetMove.power}</span>}
            {targetMove.accuracy != null && <span className="chip">Acc: {targetMove.accuracy}%</span>}
            <span className="chip">PP: {targetMove.pp}</span>
          </div>
        )}

        <p className="modal-note">Come back tomorrow for a new puzzle!</p>
      </div>
    </div>
  );
}
