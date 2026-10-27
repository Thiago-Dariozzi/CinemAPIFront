import { useState } from 'react';
import { MAX_SEATS_PER_PURCHASE, compareSeats, seatKey } from '../utils/seats';

const NO_SEATS = new Set();

export const useSeatSelection = (unavailableKeys = NO_SEATS, maxSeats = MAX_SEATS_PER_PURCHASE) => {
    const [picked, setPicked] = useState([]);

    const isAvailable = (seat) => !unavailableKeys.has(seatKey(seat));
    const selected = picked.filter(isAvailable);

    const toggle = (seat) => setPicked((prev) => {
        const current = prev.filter(isAvailable);
        const key = seatKey(seat);
        if (current.some((s) => seatKey(s) === key)) return current.filter((s) => seatKey(s) !== key);
        if (current.length >= maxSeats) return current;
        return [...current, { row: seat.row, number: seat.number }].sort(compareSeats);
    });

    const clear = () => setPicked([]);

    return { selected, toggle, clear, maxSeats };
};
