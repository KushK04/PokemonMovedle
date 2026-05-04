import { useState, useEffect } from 'react';
import Header from './components/Header';
import MoveInput from './components/MoveInput';
import GuessTable from './components/GuessTable';
import HowToPlayModal from './components/HowToPlayModal';
import ResultModal from './components/ResultModal';
import { useMoveData } from './hooks/useMoveData';
import { useGameState } from './hooks/useGameState';
import { getDailyIndex } from './utils/dailyMove';
import { compareMove } from './utils/comparison';
import './App.css';

export default function App() {
  const { moves, loading, error, fetchMoveDetails } = useMoveData();
  const { guesses, gameStatus, addGuess, alreadyGuessed, maxGuesses } = useGameState();

  const [targetMove, setTargetMove] = useState(null);
  const [showHelp, setShowHelp]     = useState(false);
  const [showResult, setShowResult] = useState(gameStatus !== 'playing');
  const [guessing, setGuessing]     = useState(false);

  useEffect(() => {
    if (moves.length === 0) return;
    const idx = getDailyIndex(moves.length);
    fetchMoveDetails(moves[idx]).then(setTargetMove);
  }, [moves]);

  async function handleGuess(moveEntry) {
    if (!targetMove) return;
    setGuessing(true);
    try {
      const details = await fetchMoveDetails(moveEntry);
      const result  = compareMove(details, targetMove);
      const isCorrect = details.name === targetMove.name;
      const newStatus = addGuess(result, isCorrect);
      if (newStatus !== 'playing') {
        setTimeout(() => setShowResult(true), 400);
      }
    } catch {
      // user can retry on next guess
    } finally {
      setGuessing(false);
    }
  }

  const guessesLeft = maxGuesses - guesses.length;
  const isDisabled  = guessing || gameStatus !== 'playing' || !targetMove;

  return (
    <div className="app">
      <Header onHelpClick={() => setShowHelp(true)} />

      <main className="main">
        {loading && (
          <div className="loading">
            <div className="spinner" />
            <p>Loading move data…</p>
          </div>
        )}

        {error && <p className="error-msg">{error}</p>}

        {!loading && !error && (
          <>
            <div className="status-row">
              {gameStatus === 'playing' ? (
                <span className="status-text">
                  {guesses.length === 0
                    ? 'Guess today\'s secret Pokemon move!'
                    : `${guessesLeft} guess${guessesLeft !== 1 ? 'es' : ''} remaining`}
                </span>
              ) : (
                <>
                  <span className="status-text">
                    {gameStatus === 'won'
                      ? `Solved in ${guesses.length}/${maxGuesses}`
                      : 'Better luck tomorrow!'}
                  </span>
                  <button className="reveal-btn" onClick={() => setShowResult(true)}>
                    See result
                  </button>
                </>
              )}
            </div>

            <GuessTable guesses={guesses} />

            {gameStatus === 'playing' && (
              <MoveInput
                moves={moves}
                onGuess={handleGuess}
                disabled={isDisabled}
                alreadyGuessed={alreadyGuessed}
              />
            )}
          </>
        )}
      </main>

      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}
      {showResult && (
        <ResultModal
          status={gameStatus}
          targetMove={targetMove}
          guessCount={guesses.length}
          maxGuesses={maxGuesses}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}
