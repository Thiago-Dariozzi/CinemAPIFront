import React, { useEffect, useState } from 'react';
import { initialForm } from './NewMovieData';
import MovieCard from './MovieCard';
import MovieContainer from './MovieContainer';
import { getAllGenres } from '../GenresApi/genreApi';

const validate = (form) => ({
    title: form.title.trim() === "" ? "El título es obligatorio" : null,
    genreId: !form.genreId ? "Elegí un género" : null,
    durationMinutes: Number(form.durationMinutes) <= 0 ? "La duración debe ser mayor a 0" : null,
    suggestedPrice: form.suggestedPrice !== "" && Number(form.suggestedPrice) < 0
        ? "El precio sugerido no puede ser negativo"
        : null,
});

const baseInputStyle = { width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#333', color: 'white', boxSizing: 'border-box' };

const selectArrow = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffbd59' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

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

    const inputStyleFor = (field) => ({
        ...baseInputStyle,
        border: `1px solid ${touched[field] && errors[field] ? '#f44336' : '#555'}`,
    });

    const selectStyleFor = (field) => ({
        ...inputStyleFor(field),
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        backgroundImage: `url("${selectArrow}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '12px',
        paddingRight: '32px',
        cursor: 'pointer',
    });

    const handleAddMovie = (event) => {
        event.preventDefault();

        if (!isFormValid) {
            setTouched({ title: true, genreId: true, durationMinutes: true, suggestedPrice: true });
            return;
        }

        // El precio sugerido es opcional: si no se cargó, no lo mandamos (queda null en el
        // backend); si se cargó, lo mandamos como número, no como string.
        const { suggestedPrice, ...rest } = form;
        const payload = suggestedPrice === "" ? rest : { ...rest, suggestedPrice: Number(suggestedPrice) };

        onAddMovie(payload);
        setForm(initialForm);
        setTouched({});
    }

    return (
        <div style={{
            backgroundColor: '#1e1e1e',
            padding: '20px',
            borderRadius: '12px',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            border: '1px solid #444',
            fontFamily: 'sans-serif'
        }}>
            <h2 style={{ color: '#ffbd59', marginTop: 0, marginBottom: '20px' }}>Agregar Nueva Película</h2>

            <form onSubmit={handleAddMovie} style={{ color: 'white' }}>

                {/* TÍTULO */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Título</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(event) => handleChangeValue(event, "title")}
                        onBlur={() => handleBlur("title")}
                        style={inputStyleFor("title")}
                        placeholder="Ingresar título"
                    />
                    {touched.title && errors.title && (
                        <p style={{ color: '#f44336', fontSize: '0.85rem', margin: '4px 0 0' }}>{errors.title}</p>
                    )}
                </div>

                {/* GÉNERO */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Género</label>
                    <select
                        value={form.genreId}
                        onChange={(event) => handleChangeValue(event, "genreId")}
                        onBlur={() => handleBlur("genreId")}
                        style={selectStyleFor("genreId")}
                    >
                        <option value="" style={{ backgroundColor: '#333', color: 'white' }}>Seleccionar género...</option>
                        {genres.map((g) => (
                            <option key={g.id} value={g.id} style={{ backgroundColor: '#333', color: 'white' }}>{g.name}</option>
                        ))}
                    </select>
                    {touched.genreId && errors.genreId && (
                        <p style={{ color: '#f44336', fontSize: '0.85rem', margin: '4px 0 0' }}>{errors.genreId}</p>
                    )}
                </div>

                {/* SINOPSIS */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Sinopsis</label>
                    <input
                        type="text"
                        value={form.synopsis}
                        onChange={(event) => handleChangeValue(event, "synopsis")}
                        style={baseInputStyle}
                        placeholder="Breve resumen"
                    />
                </div>

                {/* IMAGEN Y DURACIÓN EN LA MISMA FILA */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '5px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>URL Imagen</label>
                        <input
                            type="text"
                            value={form.imageUrl}
                            onChange={(event) => handleChangeValue(event, "imageUrl")}
                            style={baseInputStyle}
                        />
                    </div>
                    <div style={{ width: '120px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Minutos</label>
                        <input
                            type="number"
                            value={form.durationMinutes}
                            onChange={(event) => handleChangeValue(event, "durationMinutes")}
                            onBlur={() => handleBlur("durationMinutes")}
                            style={inputStyleFor("durationMinutes")}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }} />
                    <div style={{ width: '120px' }}>
                        {touched.durationMinutes && errors.durationMinutes && (
                            <p style={{ color: '#f44336', fontSize: '0.85rem', margin: '4px 0 0' }}>{errors.durationMinutes}</p>
                        )}
                    </div>
                </div>

                {/* PRECIO SUGERIDO (opcional) */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Precio sugerido (opcional)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.suggestedPrice}
                        onChange={(event) => handleChangeValue(event, "suggestedPrice")}
                        onBlur={() => handleBlur("suggestedPrice")}
                        style={inputStyleFor("suggestedPrice")}
                        placeholder="Precio de referencia para precargar sus funciones"
                    />
                    {touched.suggestedPrice && errors.suggestedPrice && (
                        <p style={{ color: '#f44336', fontSize: '0.85rem', margin: '4px 0 0' }}>{errors.suggestedPrice}</p>
                    )}
                </div>

                {/* CHECKBOX: ¿Está en cartelera? */}
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={form.isActive}
                        onChange={handleChangeIsActive}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <label htmlFor="isActive" style={{ cursor: 'pointer' }}>¿Está en cartelera disponible?</label>
                </div>

                {/* BOTÓN GUARDAR */}
                <button
                    type="submit"
                    disabled={!isFormValid}
                    style={{
                        padding: '12px 20px',
                        backgroundColor: isFormValid ? '#ffbd59' : '#555',
                        color: isFormValid ? '#000' : '#888',
                        border: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                        opacity: isFormValid ? 1 : 0.6,
                        width: '100%',
                        fontSize: '1.1rem'
                    }}
                >
                    Guardar Película
                </button>
            </form>
        </div>
    );
};

export default NewMovie;
