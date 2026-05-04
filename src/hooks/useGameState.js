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
  const [guesses, setGuesses] = useState(saved?.guesses ?? []);
  const [gameStatus, setGameStatus] = useState(saved?.gameStatus ?? 'playing');

  function persist(newGuesses, newStatus) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: getTodayKey(),
      guesses: newGuesses,
      gameStatus: newStatus,
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
    persist(newGuesses, newStatus);
    return newStatus;
  }

  function alreadyGuessed(moveName) {
    return guesses.some(g => g.name.toLowerCase() === moveName.toLowerCase());
  }

  return { guesses, gameStatus, addGuess, alreadyGuessed, maxGuesses: MAX_GUESSES };
}
