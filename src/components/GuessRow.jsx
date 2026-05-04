import AttributeCell from './AttributeCell';

export default function GuessRow({ guess }) {
  return (
    <tr className="guess-row">
      <td className="cell cell-name">{guess.name}</td>
      <AttributeCell column="type"       data={guess.type} />
      <AttributeCell column="category"   data={guess.category} />
      <AttributeCell column="power"      data={guess.power} />
      <AttributeCell column="accuracy"   data={guess.accuracy} />
      <AttributeCell column="pp"         data={guess.pp} />
      <AttributeCell column="generation" data={guess.generation} />
    </tr>
  );
}
