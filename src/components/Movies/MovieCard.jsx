import React, { useState } from 'react';
import MovieFunctionsPanel from '../Showtimes/MovieFunctionsPanel';

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
        const suggestedPriceToSend = form.suggestedPrice === "" ? null : Number(form.suggestedPrice);
        onEdit(id, { ...form, suggestedPrice: suggestedPriceToSend, id, isActive });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="movie-card">
                <div className="movie-info">
                    <label>Título</label>
                    <input className="form-input form-input--compact" value={form.title} onChange={(e) => handleChangeValue(e, "title")} />

                    <label>Género</label>
                    <select className="form-select form-input--compact" value={form.genreId} onChange={(e) => handleChangeValue(e, "genreId")}>
                        <option value="">Seleccionar género...</option>
                        {genres.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>

                    <label>Sinopsis</label>
                    <input className="form-input form-input--compact" value={form.synopsis} onChange={(e) => handleChangeValue(e, "synopsis")} />

                    <label>URL Imagen</label>
                    <input className="form-input form-input--compact" value={form.imageUrl} onChange={(e) => handleChangeValue(e, "imageUrl")} />

                    <label>Minutos</label>
                    <input className="form-input form-input--compact" type="number" value={form.durationMinutes} onChange={(e) => handleChangeValue(e, "durationMinutes")} />

                    <label>Precio sugerido (opcional)</label>
                    <input
                        className="form-input form-input--compact"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.suggestedPrice}
                        onChange={(e) => handleChangeValue(e, "suggestedPrice")}
                        placeholder="Precio de referencia para sus funciones"
                    />

                    <button
                        onClick={handleSave}
                        className="btn btn--save btn-group"
                    >
                        Guardar
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="btn btn--cancel btn-group"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`movie-card ${isFunctionsListOpen ? 'movie-card--highlighted' : ''}`}
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
                        className="btn btn--primary btn-group"
                    >
                        Actualizar
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={() =>{
                            if (window.confirm("¿Estás seguro de eliminar esta pelicula?"))
                         onDelete(id)}}
                        className="btn btn--delete btn-group"
                    >
                        Eliminar
                    </button>
                )}

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
