export function compareMove(guess, target) {
  return {
    name: guess.displayName,
    type:       compareExact(guess.type, target.type),
    category:   compareExact(guess.category, target.category),
    power:      compareNumeric(guess.power, target.power),
    accuracy:   compareNumeric(guess.accuracy, target.accuracy),
    pp:         compareNumeric(guess.pp, target.pp),
    generation: compareNumeric(guess.generation, target.generation),
  };
}

function compareExact(guessVal, targetVal) {
  return { value: guessVal, status: guessVal === targetVal ? 'correct' : 'wrong' };
}

function compareNumeric(guessVal, targetVal) {
  if (guessVal === null && targetVal === null) return { value: null, status: 'correct' };
  if (guessVal === null || targetVal === null) return { value: guessVal, status: 'na' };
  if (guessVal === targetVal) return { value: guessVal, status: 'correct' };
  return { value: guessVal, status: guessVal < targetVal ? 'higher' : 'lower' };
}
