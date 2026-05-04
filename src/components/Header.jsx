export default function Header({ onHelpClick, onReroll }) {
  return (
    <header className="header">
      <div className="header-inner">
        <button className="reroll-btn" onClick={onReroll} aria-label="Reroll puzzle" title="Reroll puzzle">
          🎲
        </button>
        <h1 className="header-title">
          <span className="title-pokemon">Pokemon</span>
          <span className="title-movedle"> MoveDle</span>
        </h1>
        <button className="help-btn" onClick={onHelpClick} aria-label="How to play">
          ?
        </button>
      </div>
    </header>
  );
}
