import { useState, useEffect } from 'react';
import { formatMoveName, parseGeneration } from '../utils/formatting';

const LIST_CACHE_KEY = 'pmdle_moves_list_v1';
const LIST_CACHE_TTL = 24 * 60 * 60 * 1000;

export function useMoveData() {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMoveList();
  }, []);

  async function loadMoveList() {
    try {
      const cached = localStorage.getItem(LIST_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < LIST_CACHE_TTL) {
          setMoves(data);
          setLoading(false);
          return;
        }
      }

      const res = await fetch('https://pokeapi.co/api/v2/move?limit=10000');
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();

      const list = json.results.map(m => ({
        name: m.name,
        displayName: formatMoveName(m.name),
        url: m.url,
      }));

      localStorage.setItem(LIST_CACHE_KEY, JSON.stringify({ data: list, timestamp: Date.now() }));
      setMoves(list);
    } catch {
      setError('Failed to load move list. Check your connection and refresh.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchMoveDetails(moveEntry) {
    const cacheKey = `pmdle_move_${moveEntry.name}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    const res = await fetch(moveEntry.url);
    if (!res.ok) throw new Error('Failed to fetch move details');
    const data = await res.json();

    const englishName =
      data.names.find(n => n.language.name === 'en')?.name ??
      formatMoveName(data.name);

    const details = {
      id: data.id,
      name: data.name,
      displayName: englishName,
      type: data.type.name,
      category: data.damage_class.name,
      power: data.power ?? null,
      accuracy: data.accuracy ?? null,
      pp: data.pp,
      generation: parseGeneration(data.generation.name),
    };

    localStorage.setItem(cacheKey, JSON.stringify(details));
    return details;
  }

  return { moves, loading, error, fetchMoveDetails };
}
