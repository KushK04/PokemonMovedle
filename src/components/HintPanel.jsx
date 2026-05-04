import { useState, useEffect } from 'react';
import { fetchMoveGif } from '../utils/bulbapedia';

const HINTS = [
  { id: 'effect',      label: 'Effect',           icon: '📖', threshold: 1 },
  { id: 'flavor',      label: 'Flavor Text',       icon: '💬', threshold: 2 },
  { id: 'animation',   label: 'In Battle',          icon: '🎬', threshold: 3 },
  { id: 'silhouettes', label: 'Who learns it?',    icon: '👤', threshold: 4 },
];

const SPRITE = id =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export default function HintPanel({ targetMove, guessCount, gameStatus }) {
  const [gifUrl, setGifUrl]       = useState(null);   // null=unfetched, false=not found, string=url
  const [gifLoading, setGifLoading] = useState(false);

  const gameOver = gameStatus !== 'playing';

  // Pre-fetch GIF one guess before it reveals so it's ready
  useEffect(() => {
    if (!targetMove) return;
    const shouldFetch = guessCount >= 2 || gameOver;
    if (!shouldFetch || gifUrl !== null) return;

    let cancelled = false;
    setGifLoading(true);
    fetchMoveGif(targetMove.displayName)
      .then(url  => { if (!cancelled) setGifUrl(url ?? false); })
      .finally(() => { if (!cancelled) setGifLoading(false); });

    return () => { cancelled = true; };
  }, [targetMove?.name, guessCount >= 2 || gameOver]);

  // Reset when the move changes (reroll)
  useEffect(() => {
    setGifUrl(null);
    setGifLoading(false);
  }, [targetMove?.name]);

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
                  gifLoading ? (
                    <div className="hint-spinner-wrap"><div className="spinner-sm" /></div>
                  ) : gifUrl ? (
                    <div className="hint-gif-wrap">
                      <img src={gifUrl} alt={`${targetMove.displayName} animation`} className="hint-gif" />
                    </div>
                  ) : (
                    <p className="hint-text hint-muted">Animation not available for this move.</p>
                  )
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
