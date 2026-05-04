const API    = 'https://archives.bulbagarden.net/w/api.php';
const PREFIX = 'pmdle_bgif_v3_';

// Matches only main-series in-battle screenshots: {Move}_{Gen}.png
// Order matters: longer patterns first so VIII isn't consumed by I
const GEN_SUFFIX = /_(IX|VIII|VII|VI|IV|III|II|V|I)\.png$/;

const GEN_SCORES = { IX: 9, VIII: 8, VII: 7, VI: 6, V: 5, IV: 4, III: 3, II: 2, I: 1 };

function scoreGen(name) {
  const m = name.match(GEN_SUFFIX);
  return m ? (GEN_SCORES[m[1]] ?? 0) : 0;
}

export async function fetchMoveGif(moveDisplayName) {
  const cacheKey = PREFIX + moveDisplayName;
  const cached = localStorage.getItem(cacheKey);
  if (cached !== null) return JSON.parse(cached);

  try {
    // Pass display name with spaces — MediaWiki normalises spaces to underscores,
    // so "Fire Punch" matches files named "Fire_Punch_IX.png" etc.
    const params = new URLSearchParams({
      action:   'query',
      list:     'allimages',
      aiprefix: moveDisplayName,
      ailimit:  '50',
      format:   'json',
      origin:   '*',
    });

    const res  = await fetch(`${API}?${params}`);
    const data = await res.json();

    const all      = data.query?.allimages ?? [];
    const genFiles = all.filter(img => GEN_SUFFIX.test(img.name));

    if (genFiles.length === 0) {
      localStorage.setItem(cacheKey, JSON.stringify(null));
      return null;
    }

    // Pick the newest generation available
    const best = genFiles.sort((a, b) => scoreGen(b.name) - scoreGen(a.name))[0];
    const url  = best.url ?? null;

    localStorage.setItem(cacheKey, JSON.stringify(url));
    return url;
  } catch {
    return null;
  }
}
