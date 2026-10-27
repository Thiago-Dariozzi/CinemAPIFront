import { rowLetter, seatKey } from '../../utils/seats';

const seatClassName = (isTaken, isSelected) => {
    if (isTaken) return 'seat seat--taken';
    if (isSelected) return 'seat seat--selected';
    return 'seat';
};

const SeatMap = ({ rows, seatsPerRow, takenKeys, selectedKeys, isFull, disabled = false, onToggle }) => {
    const rowNumbers = Array.from({ length: rows }, (_, i) => i + 1);
    const seatNumbers = Array.from({ length: seatsPerRow }, (_, i) => i + 1);

    return (
        <div className="seat-map" role="group" aria-label="Mapa de butacas">
            <div className="seat-map__screen" aria-hidden="true">Pantalla</div>
            <div className="seat-map__rows">
                {rowNumbers.map((row) => (
                    <div key={row} className="seat-map__row" role="group" aria-label={`Fila ${rowLetter(row)}`}>
                        <span className="seat-map__row-label" aria-hidden="true">{rowLetter(row)}</span>
                        {seatNumbers.map((number) => {
                            const key = seatKey({ row, number });
                            const isTaken = takenKeys.has(key);
                            const isSelected = selectedKeys.has(key);
                            const label = `Fila ${rowLetter(row)}, butaca ${number}${isTaken ? ' (ocupada)' : ''}`;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    className={seatClassName(isTaken, isSelected)}
                                    disabled={disabled || isTaken || (isFull && !isSelected)}
                                    aria-pressed={isSelected}
                                    aria-label={label}
                                    title={label}
                                    onClick={() => onToggle({ row, number })}
                                >
                                    {number}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="seat-map__legend">
                <span><span className="seat seat--legend" aria-hidden="true" /> Libre</span>
                <span><span className="seat seat--selected seat--legend" aria-hidden="true" /> Elegida</span>
                <span><span className="seat seat--taken seat--legend" aria-hidden="true" /> Ocupada</span>
            </div>
        </div>
    );
};

export default SeatMap;
