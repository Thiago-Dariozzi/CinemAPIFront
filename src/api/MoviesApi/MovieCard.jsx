import React, { useState } from 'react';
import MovieFunctionsPanel from '../ShowtimesApi/MovieFunctionsPanel';

const inputStyle = { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', boxSizing: 'border-box', marginBottom: '8px' };

// Misma flechita dorada que NewMovie.jsx, para que el <select> nativo no desentone con
// el resto de los selectores del sistema (react-datepicker ya usa esta paleta).
const selectArrow = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffbd59' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
const selectStyle = {
    ...inputStyle,
    appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
    backgroundImage: `url("${selectArrow}")`, backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center', backgroundSize: '12px', paddingRight: '32px',
    cursor: 'pointer',
};

const MovieCard = ({
    id,
    title,
    synopsis,
    durationMinutes,
    genreId,
    genres = [],
    imageUrl,
    releaseDate,
    suggestedPrice,
    isActive,
    onDelete,
    onEdit
}) => {
    const [isEditing, setIsEditing] = useState(false);
    // Vive acá (no en MovieFunctionsPanel) porque la propia tarjeta necesita saber si su
    // lista de funciones está desplegada, para resaltarse en medio de la grilla.
    const [isFunctionsListOpen, setIsFunctionsListOpen] = useState(false);
    const [form, setForm] = useState({
        title, synopsis, durationMinutes, genreId, imageUrl, releaseDate,
        suggestedPrice: suggestedPrice ?? "",
        isActive
    });

    const genreName = genres.find((g) => g.id === genreId)?.name ?? "Sin género";

    const handleChangeValue = (event, inputKey) => {
        setForm((prevForm) => ({
            ...prevForm,
            [inputKey]: event.target.value
        }));
    };

    const handleSave = () => {
        // Precio sugerido opcional: si quedó vacío mandamos null, no un string vacío
        // (Movie.SuggestedPrice es decimal? en el backend).
        const suggestedPriceToSend = form.suggestedPrice === "" ? null : Number(form.suggestedPrice);
        onEdit(id, { ...form, suggestedPrice: suggestedPriceToSend, id, isActive });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="movie-card">
                <div className="movie-info">
                    <label>Título</label>
                    <input style={inputStyle} value={form.title} onChange={(e) => handleChangeValue(e, "title")} />

                    <label>Género</label>
                    <select style={selectStyle} value={form.genreId} onChange={(e) => handleChangeValue(e, "genreId")}>
                        <option value="" style={{ backgroundColor: '#333', color: 'white' }}>Seleccionar género...</option>
                        {genres.map((g) => (
                            <option key={g.id} value={g.id} style={{ backgroundColor: '#333', color: 'white' }}>{g.name}</option>
                        ))}
                    </select>

                    <label>Sinopsis</label>
                    <input style={inputStyle} value={form.synopsis} onChange={(e) => handleChangeValue(e, "synopsis")} />

                    <label>URL Imagen</label>
                    <input style={inputStyle} value={form.imageUrl} onChange={(e) => handleChangeValue(e, "imageUrl")} />

                    <label>Minutos</label>
                    <input style={inputStyle} type="number" value={form.durationMinutes} onChange={(e) => handleChangeValue(e, "durationMinutes")} />

                    <label>Precio sugerido (opcional)</label>
                    <input
                        style={inputStyle}
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.suggestedPrice}
                        onChange={(e) => handleChangeValue(e, "suggestedPrice")}
                        placeholder="Precio de referencia para sus funciones"
                    />

                    <button
                        onClick={handleSave}
                        style={{ marginTop: '10px', marginRight: '8px', padding: '8px 16px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Guardar
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#7f8c8d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="movie-card"
            style={isFunctionsListOpen ? {
                boxShadow: '0 0 0 3px var(--accent-gold), 0 4px 15px rgba(0, 0, 0, 0.5)'
            } : undefined}
        >
            {imageUrl && <img className="movie-image" src={imageUrl} alt={title} />}

            <div className="movie-info">
                <h2 className="movie-title">{title}</h2>

                <div className="movie-details">
                    <span>🎭 {genreName}</span> | <span>⏱️ {durationMinutes} min</span>
                    {suggestedPrice != null && <> | <span>💲 Sugerido: ${suggestedPrice}</span></>}
                </div>

                <p className="movie-synopsis">{synopsis}</p>

                <div className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                    {isActive ? "🎬 En Cartelera" : "❌ Fuera de Cartelera"}
                </div>

                {onEdit && (
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{
                            marginTop: '10px',
                            marginRight: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#ffbd59',
                            color: '#000',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Actualizar
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={() =>{
                            if (window.confirm("¿Estás seguro de eliminar esta pelicula?"))
                         onDelete(id)}}
                        style={{
                            marginTop: '10px',
                            padding: '8px 16px',
                            backgroundColor: '#e74c3c',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Eliminar
                    </button>
                )}

                {/* Gestión de funciones: solo para el Admin (mismo gate que Editar/Eliminar;
                    el panel de Usuario pasa onEdit/onDelete undefined). */}
                {onEdit && (
                    <MovieFunctionsPanel
                        movieId={id}
                        movieDurationMinutes={durationMinutes}
                        movieSuggestedPrice={suggestedPrice}
                        isListOpen={isFunctionsListOpen}
                        onToggleList={() => setIsFunctionsListOpen((prev) => !prev)}
                    />
                )}
            </div>
        </div>
    );
};

export default MovieCard;
