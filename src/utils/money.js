const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

export const formatMoney = (value) => formatter.format(Number(value) || 0);

const roundToCents = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export const calculatePurchaseTotals = (price, seatCount, fee) => {
    const subtotal = roundToCents(price * seatCount);
    const feeAmount = fee && seatCount > 0
        ? roundToCents(subtotal * fee.percentage / 100 + fee.fixedAmount)
        : 0;
    return { subtotal, feeAmount, total: roundToCents(subtotal + feeAmount) };
};
