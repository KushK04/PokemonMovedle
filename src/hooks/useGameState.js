import { useState } from 'react';
import { getTodayKey } from '../utils/dailyMove';

const STORAGE_KEY = 'pmdle_game_v1';
const MAX_GUESSES = 6;

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    return state.date === getTodayKey() ? state : null;
  } catch {
    return null;
  }
}

export function useGameState() {
  const saved = loadSaved();
  const [guesses, setGuesses]             = useState(saved?.guesses ?? []);
  const [gameStatus, setGameStatus]       = useState(saved?.gameStatus ?? 'playing');
  const [activeMoveIndex, setActiveMoveIndex] = useState(saved?.activeMoveIndex ?? null);

  function persist(newGuesses, newStatus, newIndex) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: getTodayKey(),
      guesses: newGuesses,
      gameStatus: newStatus,
      activeMoveIndex: newIndex,
    }));
  }

  function addGuess(comparisonResult, isCorrect) {
    const newGuesses = [...guesses, comparisonResult];
    const newStatus = isCorrect
      ? 'won'
      : newGuesses.length >= MAX_GUESSES
      ? 'lost'
      : 'playing';

    setGuesses(newGuesses);
    setGameStatus(newStatus);
    persist(newGuesses, newStatus, activeMoveIndex);
    return newStatus;
  }

  function resetGame(newMoveIndex) {
    setGuesses([]);
    setGameStatus('playing');
    setActiveMoveIndex(newMoveIndex);
    persist([], 'playing', newMoveIndex);
  }

  function alreadyGuessed(moveName) {
    return guesses.some(g => g.name.toLowerCase() === moveName.toLowerCase());
  }

  return { guesses, gameStatus, activeMoveIndex, addGuess, alreadyGuessed, resetGame, maxGuesses: MAX_GUESSES };
}
