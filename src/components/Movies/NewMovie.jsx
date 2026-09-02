import React, { useEffect, useState } from 'react';
import { initialForm } from './NewMovieData';
import MovieCard from './MovieCard';
import MovieContainer from './MovieContainer';
import { getAllGenres } from '../../api/genreApi';

const validate = (form) => ({
    title: form.title.trim() === "" ? "El título es obligatorio" : null,
    genreId: !form.genreId ? "Elegí un género" : null,
    durationMinutes: Number(form.durationMinutes) <= 0 ? "La duración debe ser mayor a 0" : null,
    suggestedPrice: form.suggestedPrice !== "" && Number(form.suggestedPrice) < 0
        ? "El precio sugerido no puede ser negativo"
        : null,
});

const NewMovie = ({ onAddMovie }) => {

    const [form, setForm] = useState(initialForm);
    const [touched, setTouched] = useState({});
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        let isMounted = true;
        getAllGenres(
            (data) => { if (isMounted) setGenres(data); },
            (err) => console.error(err)
        );
        return () => { isMounted = false; };
    }, []);

    const errors = validate(form);
    const isFormValid = Object.values(errors).every((e) => e === null);

    const handleChangeValue = (event, inputKey) => {
        setForm((prevForm) => ({
            ...prevForm,
            [inputKey]: event.target.value
        }));
    }

    const handleChangeIsActive = (event) => {
        setForm((prevForm) => ({
            ...prevForm,
            isActive: event.target.checked
        }));
    }

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleAddMovie = (event) => {
        event.preventDefault();

        if (!isFormValid) {
            setTouched({ title: true, genreId: true, durationMinutes: true, suggestedPrice: true });
            return;
        }

        const { suggestedPrice, ...rest } = form;
        const payload = suggestedPrice === "" ? rest : { ...rest, suggestedPrice: Number(suggestedPrice) };

        onAddMovie(payload);
        setForm(initialForm);
        setTouched({});
    }

    return (
        <div className="form-panel">
            <h2 className="form-panel__title">Agregar Nueva Película</h2>

            <form onSubmit={handleAddMovie} className="form-body">

                {/* TÍTULO */}
                <div className="form-field">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(event) => handleChangeValue(event, "title")}
                        onBlur={() => handleBlur("title")}
                        className={`form-input ${touched.title && errors.title ? 'form-input--error' : ''}`}
                        placeholder="Ingresar título"
                    />
                    {touched.title && errors.title && (
                        <p className="form-error-text">{errors.title}</p>
                    )}
                </div>

                {/* GÉNERO */}
                <div className="form-field">
                    <label className="form-label">Género</label>
                    <select
                        value={form.genreId}
                        onChange={(event) => handleChangeValue(event, "genreId")}
                        onBlur={() => handleBlur("genreId")}
                        className={`form-select ${touched.genreId && errors.genreId ? 'form-select--error' : ''}`}
                    >
                        <option value="">Seleccionar género...</option>
                        {genres.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                    {touched.genreId && errors.genreId && (
                        <p className="form-error-text">{errors.genreId}</p>
                    )}
                </div>

                {/* SINOPSIS */}
                <div className="form-field">
                    <label className="form-label">Sinopsis</label>
                    <input
                        type="text"
                        value={form.synopsis}
                        onChange={(event) => handleChangeValue(event, "synopsis")}
                        className="form-input"
                        placeholder="Breve resumen"
                    />
                </div>

                {/* IMAGEN Y DURACIÓN EN LA MISMA FILA */}
                <div className="form-row" style={{ marginBottom: '5px' }}>
                    <div style={{ flex: 1 }}>
                        <label className="form-label">URL Imagen</label>
                        <input
                            type="text"
                            value={form.imageUrl}
                            onChange={(event) => handleChangeValue(event, "imageUrl")}
                            className="form-input"
                        />
                    </div>
                    <div style={{ width: '120px' }}>
                        <label className="form-label">Minutos</label>
                        <input
                            type="number"
                            value={form.durationMinutes}
                            onChange={(event) => handleChangeValue(event, "durationMinutes")}
                            onBlur={() => handleBlur("durationMinutes")}
                            className={`form-input ${touched.durationMinutes && errors.durationMinutes ? 'form-input--error' : ''}`}
                        />
                    </div>
                </div>
                <div className="form-row" style={{ marginBottom: '20px' }}>
                    <div style={{ flex: 1 }} />
                    <div style={{ width: '120px' }}>
                        {touched.durationMinutes && errors.durationMinutes && (
                            <p className="form-error-text">{errors.durationMinutes}</p>
                        )}
                    </div>
                </div>

                {/* PRECIO SUGERIDO (opcional) */}
                <div className="form-field--lg">
                    <label className="form-label">Precio sugerido (opcional)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.suggestedPrice}
                        onChange={(event) => handleChangeValue(event, "suggestedPrice")}
                        onBlur={() => handleBlur("suggestedPrice")}
                        className={`form-input ${touched.suggestedPrice && errors.suggestedPrice ? 'form-input--error' : ''}`}
                        placeholder="Precio de referencia para precargar sus funciones"
                    />
                    {touched.suggestedPrice && errors.suggestedPrice && (
                        <p className="form-error-text">{errors.suggestedPrice}</p>
                    )}
                </div>

                {/* CHECKBOX: ¿Está en cartelera? */}
                <div className="form-checkbox-row">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={form.isActive}
                        onChange={handleChangeIsActive}
                        className="form-checkbox"
                    />
                    <label htmlFor="isActive">¿Está en cartelera disponible?</label>
                </div>

                {/* BOTÓN GUARDAR */}
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`btn btn--submit ${!isFormValid ? 'btn--disabled' : ''}`}
                >
                    Guardar Película
                </button>
            </form>
        </div>
    );
};

export default NewMovie;
