const API    = 'https://bulbapedia.bulbagarden.net/w/api.php';
const PREFIX = 'pmdle_bgif_v1_';

export async function fetchMoveGif(moveDisplayName) {
  const cacheKey = PREFIX + moveDisplayName;
  const cached = localStorage.getItem(cacheKey);
  if (cached !== null) return JSON.parse(cached); // may be null (not found) or a URL string

  try {
    const pageTitle = `${moveDisplayName} (move)`;

    // Step 1 — get image list for the move page
    const listParams = new URLSearchParams({
      action:  'query',
      titles:  pageTitle,
      prop:    'images',
      imlimit: '100',
      format:  'json',
      origin:  '*',
    });

    const listRes  = await fetch(`${API}?${listParams}`);
    const listData = await listRes.json();
    const pages    = Object.values(listData.query.pages);
    const allImages = pages[0]?.images ?? [];

    // Only keep GIFs
    const gifs = allImages.map(img => img.title).filter(t => t.toLowerCase().endsWith('.gif'));

    // Prefer GIFs whose filename contains the (normalised) move name
    const slug = moveDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const ranked = [
      ...gifs.filter(t => t.toLowerCase().replace(/[^a-z0-9]/g, '').includes(slug)),
      ...gifs.filter(t => !t.toLowerCase().replace(/[^a-z0-9]/g, '').includes(slug)),
    ];

    if (ranked.length === 0) {
      localStorage.setItem(cacheKey, JSON.stringify(null));
      return null;
    }

    // Among matching GIFs, prefer newer generations (longer roman-numeral suffix)
    const best = ranked.sort((a, b) => {
      const score = t => {
        if (t.includes('IX')) return 9;
        if (t.includes('VIII')) return 8;
        if (t.includes('VII')) return 7;
        if (t.includes('VI'))  return 6;
        if (t.includes('V'))   return 5;
        return 0;
      };
      return score(b) - score(a);
    })[0];

    // Step 2 — resolve file title to a direct URL
    const urlParams = new URLSearchParams({
      action:  'query',
      titles:  best,
      prop:    'imageinfo',
      iiprop:  'url',
      format:  'json',
      origin:  '*',
    });

    const urlRes  = await fetch(`${API}?${urlParams}`);
    const urlData = await urlRes.json();
    const filePages = Object.values(urlData.query.pages);
    const url = filePages[0]?.imageinfo?.[0]?.url ?? null;

    localStorage.setItem(cacheKey, JSON.stringify(url));
    return url;
  } catch {
    return null;
  }
}
