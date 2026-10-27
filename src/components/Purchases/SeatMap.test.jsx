import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useSeatSelection } from '../../hooks/useSeatSelection';
import { MAX_SEATS_PER_PURCHASE, seatKey } from '../../utils/seats';
import SeatMap from './SeatMap';

// La misma combinación que PurchasePage: el hook decide la selección y el mapa la muestra.
const SeatPicker = ({ rows, seatsPerRow, taken = [] }) => {
    const takenKeys = new Set(taken.map(seatKey));
    const { selected, toggle, maxSeats } = useSeatSelection(takenKeys);
    return (
        <>
            <SeatMap
                rows={rows}
                seatsPerRow={seatsPerRow}
                takenKeys={takenKeys}
                selectedKeys={new Set(selected.map(seatKey))}
                isFull={selected.length >= maxSeats}
                onToggle={toggle}
            />
            <p>Elegidas: {selected.length}</p>
        </>
    );
};

const seat = (row, number, taken = false) =>
    screen.getByRole('button', { name: `Fila ${String.fromCharCode(64 + row)}, butaca ${number}${taken ? ' (ocupada)' : ''}` });

describe('Selección de butacas', () => {
    it('las butacas ocupadas están deshabilitadas y no se pueden elegir', async () => {
        const user = userEvent.setup();
        render(<SeatPicker rows={2} seatsPerRow={3} taken={[{ row: 1, number: 2 }]} />);

        expect(seat(1, 2, true)).toBeDisabled();
        await user.click(seat(1, 2, true));

        expect(screen.getByText('Elegidas: 0')).toBeInTheDocument();
        expect(seat(1, 1)).toBeEnabled();
    });

    it('elegir y volver a tocar una butaca la marca y la desmarca', async () => {
        const user = userEvent.setup();
        render(<SeatPicker rows={1} seatsPerRow={3} />);

        await user.click(seat(1, 3));
        expect(seat(1, 3)).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByText('Elegidas: 1')).toBeInTheDocument();

        await user.click(seat(1, 3));
        expect(seat(1, 3)).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByText('Elegidas: 0')).toBeInTheDocument();
    });

    it(`con ${MAX_SEATS_PER_PURCHASE} elegidas bloquea el resto, pero deja desmarcar`, async () => {
        const user = userEvent.setup();
        render(<SeatPicker rows={2} seatsPerRow={6} />);

        for (let number = 1; number <= 6; number++) await user.click(seat(1, number));
        for (let number = 1; number <= 4; number++) await user.click(seat(2, number));

        expect(screen.getByText(`Elegidas: ${MAX_SEATS_PER_PURCHASE}`)).toBeInTheDocument();
        expect(seat(2, 5)).toBeDisabled();
        expect(seat(2, 6)).toBeDisabled();
        expect(seat(1, 1)).toBeEnabled();

        await user.click(seat(1, 1));
        expect(screen.getByText(`Elegidas: ${MAX_SEATS_PER_PURCHASE - 1}`)).toBeInTheDocument();
        expect(seat(2, 5)).toBeEnabled();
    });

    it('si una butaca elegida se vende mientras tanto, deja de contar y libera el cupo', () => {
        const { rerender } = render(<SeatPicker rows={1} seatsPerRow={3} />);
        rerender(<SeatPicker rows={1} seatsPerRow={3} taken={[{ row: 1, number: 1 }]} />);

        expect(seat(1, 1, true)).toBeDisabled();
        expect(screen.getByText('Elegidas: 0')).toBeInTheDocument();
    });
});
