import { useState } from 'react';
import MovieFunctionsPanel from '../Showtimes/MovieFunctionsPanel';
import MoviePoster from '../Billboard/MoviePoster';
import FieldBody from '../common/FieldBody';
import { computeErrors, invalidFieldLabels } from '../common/fieldValidation';
import { movieFormFields } from './movieFields';

const toDateInputValue = (value) => (value ? value.slice(0, 10) : "");

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
    isShowing,
    onDelete,
    onEdit
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isFunctionsListOpen, setIsFunctionsListOpen] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const buildForm = () => ({
        title,
        synopsis: synopsis ?? "",
        durationMinutes,
        genreId,
        imageUrl: imageUrl ?? "",
        releaseDate: toDateInputValue(releaseDate),
        suggestedPrice: suggestedPrice ?? "",
        isShowing
    });

    const [touched, setTouched] = useState({});
    const [form, setForm] = useState(buildForm);

    const errors = computeErrors(movieFormFields, form);
    const isFormValid = Object.values(errors).every((e) => e == null);
    const missingLabels = invalidFieldLabels(movieFormFields, errors);

    const genreName = genres.find((g) => g.id === genreId)?.name ?? "Sin género";

    const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
    const handleBlur = (key) => setTouched((prev) => ({ ...prev, [key]: true }));

    const startEditing = () => {
        setForm(buildForm());
        setTouched({});
        setSaveError(null);
        setIsEditing(true);
    };

    const handleSave = async () => {
        setSaveError(null);

        if (!isFormValid) {
            setTouched(Object.fromEntries(movieFormFields.map((f) => [f.key, true])));
            return;
        }

        const suggestedPriceToSend = form.suggestedPrice === "" ? null : Number(form.suggestedPrice);
        try {
            await onEdit(id, { ...form, suggestedPrice: suggestedPriceToSend, id });
            setIsEditing(false);
        } catch (err) {
            setSaveError(err?.message || "Error al actualizar la película");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de eliminar esta pelicula?")) return;
        setDeleteError(null);
        try {
            await onDelete(id);
        } catch (err) {
            setDeleteError(err?.message || "Error al eliminar la película");
        }
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setSaveError(null);
    };

    if (isEditing) {
        return (
            <div className="movie-card">
                <div className="movie-info">
                    {saveError && <p className="msg-inline-error--sm">{saveError}</p>}

                    {movieFormFields.map((field) => (
                        <div key={field.key}>
                            <FieldBody
                                field={field}
                                value={form[field.key]}
                                touched={touched[field.key]}
                                error={errors[field.key]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                optionsSources={{ genres }}
                                compact
                            />
                        </div>
                    ))}

                    {missingLabels.length > 0 && (
                        <p className="msg-inline-error--sm">Para guardar falta completar o corregir: {missingLabels.join(", ")}</p>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={!isFormValid}
                        className={`btn ${isFormValid ? 'btn--save' : 'btn--disabled'} btn-group`}
                    >
                        Guardar
                    </button>
                    <button
                        onClick={cancelEditing}
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
            <div className="movie-image">
                <MoviePoster key={imageUrl} src={imageUrl} title={title} />
            </div>

            <div className="movie-info">
                <h2 className="movie-title">{title}</h2>

                <div className="movie-details">
                    <span>🎭 {genreName}</span> | <span>⏱️ {durationMinutes} min</span>
                    {suggestedPrice != null && <> | <span>💲 Sugerido: ${suggestedPrice}</span></>}
                </div>

                <p className="movie-synopsis">{synopsis}</p>

                <div className={`status-badge ${isShowing ? 'status-active' : 'status-inactive'}`}>
                    {isShowing ? "🎬 En Cartelera" : "❌ Fuera de Cartelera"}
                </div>

                {deleteError && <p className="msg-inline-error--sm">{deleteError}</p>}

                {onEdit && (
                    <button
                        onClick={startEditing}
                        className="btn btn--primary btn-group"
                    >
                        Actualizar
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={handleDelete}
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
