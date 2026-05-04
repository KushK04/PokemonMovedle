import { useState, useRef, useEffect } from 'react';

export default function MoveInput({ moves, onGuess, disabled, alreadyGuessed }) {
  const [input, setInput]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected]     = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError]           = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const q = input.trim().toLowerCase();
    if (!q) { setSuggestions([]); setSelected(null); return; }

    const filtered = moves
      .filter(m => m.displayName.toLowerCase().includes(q) || m.name.includes(q))
      .slice(0, 8);

    setSuggestions(filtered);
    setActiveIndex(-1);
    const exact = filtered.find(m => m.displayName.toLowerCase() === q);
    setSelected(exact ?? null);
  }, [input, moves]);

  function selectSuggestion(move) {
    setInput(move.displayName);
    setSelected(move);
    setSuggestions([]);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function submit(move) {
    if (!move) { setError('Select a valid move from the list.'); return; }
    if (alreadyGuessed(move.displayName)) { setError('Already guessed that move!'); return; }
    setError('');
    setInput('');
    setSelected(null);
    setSuggestions([]);
    onGuess(move);
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) selectSuggestion(suggestions[activeIndex]);
      else if (selected) submit(selected);
      else if (suggestions.length === 1) selectSuggestion(suggestions[0]);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (selected) submit(selected);
    else if (suggestions.length === 1) submit(suggestions[0]);
    else setError('Select a valid move from the list.');
  }

  return (
    <div className="input-wrapper">
      <form className="input-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="input-row">
          <div className="autocomplete-container">
            <input
              ref={inputRef}
              type="text"
              className="move-input"
              placeholder="Search for a move..."
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              aria-autocomplete="list"
              aria-controls="suggestion-list"
              aria-activedescendant={activeIndex >= 0 ? `sug-${activeIndex}` : undefined}
            />
            {suggestions.length > 0 && (
              <ul id="suggestion-list" className="suggestions" role="listbox">
                {suggestions.map((m, i) => (
                  <li
                    key={m.name}
                    id={`sug-${i}`}
                    className={`suggestion-item${i === activeIndex ? ' active' : ''}`}
                    onMouseDown={() => selectSuggestion(m)}
                    role="option"
                    aria-selected={i === activeIndex}
                  >
                    {m.displayName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="guess-btn" disabled={disabled}>
            Guess
          </button>
        </div>
      </form>
      {error && <p className="input-error" role="alert">{error}</p>}
    </div>
  );
}
