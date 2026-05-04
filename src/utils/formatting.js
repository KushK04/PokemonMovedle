export const formatMoveName = (name) =>
  name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const GEN_MAP = {
  'generation-i': 1,
  'generation-ii': 2,
  'generation-iii': 3,
  'generation-iv': 4,
  'generation-v': 5,
  'generation-vi': 6,
  'generation-vii': 7,
  'generation-viii': 8,
  'generation-ix': 9,
};

export const parseGeneration = (genName) => GEN_MAP[genName] ?? 1;

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
export const genRoman = (num) => `Gen ${ROMAN[num] ?? num}`;
