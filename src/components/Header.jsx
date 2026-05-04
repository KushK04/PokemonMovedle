export default function Header({ onHelpClick }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-spacer" />
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
