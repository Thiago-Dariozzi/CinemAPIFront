import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { calculatePurchaseTotals, formatMoney } from '../../utils/money';
import PurchaseSummary from './PurchaseSummary';

const tenPercent = { name: "Cargo por servicio", percentage: 10, fixedAmount: 0 };

describe('calculatePurchaseTotals', () => {
    it('suma el porcentaje del cargo sobre el subtotal', () => {
        expect(calculatePurchaseTotals(1500, 3, tenPercent)).toEqual({ subtotal: 4500, feeAmount: 450, total: 4950 });
    });

    it('suma el monto fijo una vez por compra, no por entrada', () => {
        const fee = { name: "Mixto", percentage: 5, fixedAmount: 100 };

        expect(calculatePurchaseTotals(1000, 2, fee)).toEqual({ subtotal: 2000, feeAmount: 200, total: 2200 });
    });

    it('redondea a centavos como el backend (0,005 sube)', () => {
        const fee = { name: "Raro", percentage: 7.5, fixedAmount: 0 };

        // 18,58 × 1 × 7,5 % = 1,3935 → 1,39
        expect(calculatePurchaseTotals(18.58, 1, fee)).toEqual({ subtotal: 18.58, feeAmount: 1.39, total: 19.97 });
        // 0,07 × 7,5 % = 0,00525 → 0,01
        expect(calculatePurchaseTotals(0.07, 1, fee).feeAmount).toBe(0.01);
    });

    it('sin cargo vigente o sin butacas no cobra cargo', () => {
        expect(calculatePurchaseTotals(1500, 2, null)).toEqual({ subtotal: 3000, feeAmount: 0, total: 3000 });
        expect(calculatePurchaseTotals(1500, 0, tenPercent)).toEqual({ subtotal: 0, feeAmount: 0, total: 0 });
    });
});

describe('PurchaseSummary', () => {
    const renderSummary = (props) => render(
        <PurchaseSummary seats={[]} price={1500} fee={tenPercent} maxSeats={10} isSubmitting={false} canConfirm onConfirm={() => {}} {...props} />,
    );

    const amountAfter = (label) => screen.getByText(label).nextElementSibling;

    it('muestra las butacas elegidas, el subtotal, el cargo con su porcentaje y el total', () => {
        renderSummary({ seats: [{ row: 1, number: 5 }, { row: 2, number: 1 }] });

        expect(screen.getByText('2 butacas: A5, B1')).toBeInTheDocument();
        expect(amountAfter('Subtotal').textContent).toBe(formatMoney(3000));
        expect(amountAfter('Cargo por servicio (10 %)').textContent).toBe(formatMoney(300));
        expect(amountAfter('Total').textContent).toBe(formatMoney(3300));
    });

    it('sin butacas pide elegirlas y no deja confirmar', () => {
        renderSummary({ canConfirm: false });

        expect(screen.getByText('Elegí tus butacas en el mapa.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirmar compra' })).toBeDisabled();
    });

    it('confirma con el botón y lo deshabilita mientras se envía', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        const { rerender } = renderSummary({ seats: [{ row: 1, number: 1 }], onConfirm });

        await user.click(screen.getByRole('button', { name: 'Confirmar compra' }));
        expect(onConfirm).toHaveBeenCalledOnce();

        rerender(<PurchaseSummary seats={[{ row: 1, number: 1 }]} price={1500} fee={tenPercent} maxSeats={10} isSubmitting canConfirm onConfirm={onConfirm} />);
        expect(screen.getByRole('button', { name: 'Confirmando...' })).toBeDisabled();
    });
});
