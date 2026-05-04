export default function HowToPlayModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="htp-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2 id="htp-title">How to Play</h2>
        <p>Guess today's secret Pokemon move in <strong>6 tries</strong>.</p>
        <p>After each guess, the colour of the tiles reveals how close you are:</p>

        <div className="legend">
          <div className="legend-row">
            <div className="legend-cell cell-correct">80</div>
            <span>Exact match</span>
          </div>
          <div className="legend-row">
            <div className="legend-cell cell-higher">40 ↑</div>
            <span>Target value is <strong>higher</strong> — guess higher next time</span>
          </div>
          <div className="legend-row">
            <div className="legend-cell cell-lower">120 ↓</div>
            <span>Target value is <strong>lower</strong> — guess lower next time</span>
          </div>
          <div className="legend-row">
            <div className="legend-cell cell-wrong">Special</div>
            <span>Wrong (type / category)</span>
          </div>
          <div className="legend-row">
            <div className="legend-cell cell-na">—</div>
            <span>N/A (e.g. status moves have no Power)</span>
          </div>
        </div>

        <p>Columns: <strong>Type · Category · Power · Accuracy · PP · Gen</strong></p>
        <p className="modal-note">
          A new move is chosen every day. Data from{' '}
          <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokéAPI</a>.
        </p>
      </div>
    </div>
  );
}
