export const MAX_SEATS_PER_PURCHASE = 10;

export const rowLetter = (row) => String.fromCharCode(64 + row);

export const seatLabel = ({ row, number }) => `${rowLetter(row)}${number}`;

export const seatKey = ({ row, number }) => `${row}-${number}`;

export const compareSeats = (a, b) => a.row - b.row || a.number - b.number;
