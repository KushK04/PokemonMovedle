const API    = 'https://bulbapedia.bulbagarden.net/w/api.php';
const PREFIX = 'pmdle_bgif_v2_';

// Higher = newer generation = preferred
const GEN_SCORE = { IX: 9, VIII: 8, VII: 7, VI: 6, V: 5, IV: 4, III: 3, II: 2, I: 1 };

function scoreGen(name) {
  for (const [roman, score] of Object.entries(GEN_SCORE)) {
    if (name.includes(roman)) return score;
  }
  return 0;
}

export async function fetchMoveGif(moveDisplayName) {
  const cacheKey = PREFIX + moveDisplayName;
  const cached = localStorage.getItem(cacheKey);
  if (cached !== null) return JSON.parse(cached);

  try {
    // Strip everything except letters and numbers to match Bulbapedia CamelCase filenames
    // e.g. "Fire Punch" -> "FirePunch", "Trick-or-Treat" -> "TrickorTreat"
    const prefix = moveDisplayName.replace(/[^a-zA-Z0-9]/g, '');

    const params = new URLSearchParams({
      action:   'query',
      list:     'allimages',
      aiprefix: prefix,
      aiprop:   'url|name',
      ailimit:  '20',
      format:   'json',
      origin:   '*',
    });

    const res  = await fetch(`${API}?${params}`);
    const data = await res.json();

    const all  = data.query?.allimages ?? [];
    const gifs = all.filter(img => img.name.toLowerCase().endsWith('.gif'));

    if (gifs.length === 0) {
      localStorage.setItem(cacheKey, JSON.stringify(null));
      return null;
    }

    // Pick the newest-generation GIF
    const best = gifs.sort((a, b) => scoreGen(b.name) - scoreGen(a.name))[0];
    const url  = best.url ?? null;

    localStorage.setItem(cacheKey, JSON.stringify(url));
    return url;
  } catch {
    return null;
  }
}
