import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import MovieCard from './MovieCard';
import { movieFormFields } from './movieFields';

vi.mock('../Showtimes/MovieFunctionsPanel', () => ({ default: () => null }));

const genres = [{ id: "g1", name: "Drama" }];

const movie = {
    id: "m1",
    title: "Película",
    synopsis: "Sinopsis",
    durationMinutes: 120,
    genreId: "g1",
    imageUrl: "",
    releaseDate: "2026-03-15T00:00:00",
    suggestedPrice: null,
    isShowing: true,
};

const validate = (key, value) => movieFormFields.find((f) => f.key === key).validate(value);

describe('movieFormFields', () => {
    it('pide la fecha de estreno', () => {
        expect(validate("releaseDate", "")).toBe("La fecha de estreno es obligatoria");
        expect(validate("releaseDate", "0001-01-01")).toBe("Ingresá una fecha de estreno válida");
        expect(validate("releaseDate", "2026-03-15")).toBeNull();
    });

    it('acepta la URL vacía o con http/https', () => {
        expect(validate("imageUrl", "")).toBeNull();
        expect(validate("imageUrl", "https://example.com/poster.jpg")).toBeNull();
        expect(validate("imageUrl", "hola")).toBe("La URL tiene que empezar con http:// o https://");
        expect(validate("imageUrl", "www.example.com/poster.jpg")).toBe("La URL tiene que empezar con http:// o https://");
    });
});

describe('MovieCard', () => {
    it('al editar valida igual que el alta y no guarda un título vacío', async () => {
        const user = userEvent.setup();
        const onEdit = vi.fn();
        render(<MovieCard {...movie} genres={genres} onEdit={onEdit} onDelete={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: 'Actualizar' }));
        await user.clear(screen.getByLabelText('Título'));
        await user.tab();

        expect(screen.getByText('El título es obligatorio')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
        expect(onEdit).not.toHaveBeenCalled();
    });

    it('carga la fecha de estreno de la película en el formulario', async () => {
        const user = userEvent.setup();
        render(<MovieCard {...movie} genres={genres} onEdit={vi.fn()} onDelete={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: 'Actualizar' }));

        expect(screen.getByLabelText('Fecha de estreno')).toHaveValue("2026-03-15");
    });
});
