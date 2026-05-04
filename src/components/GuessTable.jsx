import GuessRow from './GuessRow';

const COLUMNS = ['Move', 'Type', 'Category', 'Power', 'Accuracy', 'PP', 'Gen'];

export default function GuessTable({ guesses }) {
  if (guesses.length === 0) return null;

  return (
    <div className="table-scroll">
      <table className="guess-table">
        <thead>
          <tr>
            {COLUMNS.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {guesses.map((g, i) => <GuessRow key={i} guess={g} />)}
        </tbody>
      </table>
    </div>
  );
}
