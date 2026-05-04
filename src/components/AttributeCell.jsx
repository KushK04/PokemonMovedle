import { TYPE_COLORS } from '../utils/typeColors';
import { genRoman } from '../utils/formatting';

const ARROWS = { higher: '↑', lower: '↓' };

export default function AttributeCell({ column, data }) {
  const { value, status } = data;

  if (column === 'type') {
    const colors = TYPE_COLORS[value] ?? { bg: '#888', text: '#fff' };
    return (
      <td className={`cell cell-${status}`}>
        <span
          className="type-badge"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : '—'}
        </span>
      </td>
    );
  }

  let display;
  if (column === 'category') {
    display = value ? value.charAt(0).toUpperCase() + value.slice(1) : '—';
  } else if (column === 'generation') {
    display = value != null ? genRoman(value) : '—';
  } else {
    display = value ?? '—';
  }

  const arrow = ARROWS[status];

  return (
    <td className={`cell cell-${status}`}>
      <span className="cell-value">{display}</span>
      {arrow && <span className="cell-arrow">{arrow}</span>}
    </td>
  );
}
