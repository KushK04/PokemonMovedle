import { useState, useEffect } from 'react';

const HINTS = [
  { id: 'effect',      label: 'Effect',        icon: '📖', threshold: 1 },
  { id: 'flavor',      label: 'Flavor Text',   icon: '💬', threshold: 2 },
  { id: 'animation',   label: 'In Battle',     icon: '🎬', threshold: 3 },
  { id: 'silhouettes', label: 'Who learns it?', icon: '👤', threshold: 4 },
];

const SPRITE = id =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

// Try newest generation first, fall back through older ones via onError.
// Uses Special:FilePath which is a stable redirect — no JS fetch needed,
// so there are no CORS restrictions.
const GENS = ['IX', 'VIII', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I'];

function BattleImage({ displayName }) {
  const [genIdx, setGenIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setGenIdx(0);
    setLoaded(false);
    setFailed(false);
  }, [displayName]);

  if (failed) {
    return <p className="hint-text hint-muted">Screenshot not available for this move.</p>;
  }

  const slug = displayName.replace(/ /g, '_').replace(/[^\w\-]/g, c => encodeURIComponent(c));
  const src  = `https://archives.bulbagarden.net/wiki/Special:FilePath/${slug}_${GENS[genIdx]}.png`;

  return (
    <div className="hint-gif-wrap" style={{ position: 'relative' }}>
      {!loaded && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0.25rem 0' }}>
          <div className="spinner-sm" />
        </div>
      )}
      <img
        key={src}
        src={src}
        alt={`${displayName} in battle`}
        className="hint-gif"
        style={!loaded ? { position: 'absolute', opacity: 0, pointerEvents: 'none' } : {}}
        onLoad={e => {
          if (e.target.naturalWidth === 0) {
            if (genIdx < GENS.length - 1) setGenIdx(i => i + 1);
            else setFailed(true);
          } else {
            setLoaded(true);
          }
        }}
        onError={() => {
          setLoaded(false);
          if (genIdx < GENS.length - 1) setGenIdx(i => i + 1);
          else setFailed(true);
        }}
      />
    </div>
  );
}

export default function HintPanel({ targetMove, guessCount, gameStatus }) {
  const gameOver = gameStatus !== 'playing';

  if (!targetMove) return null;

  const revealed = threshold => guessCount >= threshold || gameOver;

  return (
    <div className="hint-panel">
      <p className="hint-panel-label">Hints unlock as you guess</p>
      <div className="hints-list">
        {HINTS.map(hint => (
          <div
            key={hint.id}
            className={`hint-card ${revealed(hint.threshold) ? 'hint-revealed' : 'hint-locked'}`}
          >
            <div className="hint-card-header">
              <span className="hint-icon">{hint.icon}</span>
              <span className="hint-label">{hint.label}</span>
              {!revealed(hint.threshold) && (
                <span className="hint-unlock">after guess {hint.threshold}</span>
              )}
            </div>

            {revealed(hint.threshold) && (
              <div className="hint-body">
                {hint.id === 'effect' && (
                  <p className="hint-text">{targetMove.effect ?? 'No effect data available.'}</p>
                )}

                {hint.id === 'flavor' && (
                  <p className="hint-text hint-italic">"{targetMove.flavorText ?? 'No flavor text available.'}"</p>
                )}

                {hint.id === 'animation' && (
                  <BattleImage displayName={targetMove.displayName} />
                )}

                {hint.id === 'silhouettes' && (
                  targetMove.learnedBy?.length > 0 ? (
                    <div className="silhouettes">
                      {targetMove.learnedBy.map(p => (
                        <div key={p.id} className="silhouette-wrap" title={gameOver ? p.name : undefined}>
                          <img
                            src={SPRITE(p.id)}
                            alt={gameOver ? p.name : 'Pokemon silhouette'}
                            className={`silhouette ${gameOver ? 'silhouette-color' : ''}`}
                          />
                          {gameOver && (
                            <span className="silhouette-name">
                              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="hint-text hint-muted">No Pokémon data available.</p>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
