import { useState, useEffect } from 'react';
import { formatMoveName, parseGeneration } from '../utils/formatting';

function pickSpread(arr, count) {
  if (arr.length <= count) return arr;
  return Array.from({ length: count }, (_, i) =>
    arr[Math.floor(i * arr.length / count)]
  );
}

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
    const cacheKey = `pmdle_move_v3_${moveEntry.name}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    const res = await fetch(moveEntry.url);
    if (!res.ok) throw new Error('Failed to fetch move details');
    const data = await res.json();

    const englishName =
      data.names.find(n => n.language.name === 'en')?.name ??
      formatMoveName(data.name);

    const effectEntry = data.effect_entries.find(e => e.language.name === 'en');
    const effect = effectEntry
      ? effectEntry.short_effect.replace(/\$effect_chance/g, data.effect_chance ?? '??')
      : null;

    const UNUSABLE = /can't be used|unusable/i;
    const enFlavors = data.flavor_text_entries.filter(
      e => e.language.name === 'en' && !UNUSABLE.test(e.flavor_text)
    );
    const flavorText = enFlavors.length > 0
      ? enFlavors[enFlavors.length - 1].flavor_text.replace(/[\n\f\r]/g, ' ').replace(/\s+/g, ' ').trim()
      : null;

    const learnedBy = pickSpread(data.learned_by_pokemon, 8).map(p => ({
      name: p.name,
      id: parseInt(p.url.split('/').filter(Boolean).pop()),
    }));

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
      effect,
      flavorText,
      learnedBy,
    };

    localStorage.setItem(cacheKey, JSON.stringify(details));
    return details;
  }

  return { moves, loading, error, fetchMoveDetails };
}
