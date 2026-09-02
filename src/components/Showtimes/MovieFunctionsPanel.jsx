import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import { getAllScreens } from '../../api/screenApi';
import { getAllMovies } from '../../api/movieApi';
import {
    getShowtimesByMovie,
    getOccupiedShowtimesByScreen,
    addShowtime,
    deleteShowtime,
    formatShowtime,
} from '../../api/showtimeApi';

const CLEANING_BUFFER_MINUTES = 15;

registerLocale('es', es);

const pad = (n) => String(n).padStart(2, '0');

const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isPastDate = (date) => startOfDay(date) < startOfToday();

const combineDateAndTime = (date, timeDate) => {
    if (!date || !timeDate) return null;
    const combined = new Date(date);
    combined.setHours(timeDate.getHours(), timeDate.getMinutes(), 0, 0);
    return combined;
};

const toDateOnlyString = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const toLocalIsoString = (date) => `${toDateOnlyString(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;

const formatRange = (range) => {
    const opts = { hour: '2-digit', minute: '2-digit' };
    return `${range.start.toLocaleTimeString('es-AR', opts)} a ${range.end.toLocaleTimeString('es-AR', opts)}`;
};

const validate = ({ screenId, selectedDate, selectedTime, price }) => ({
    screenId: !screenId ? "Elegí una sala" : null,
    selectedDate: !selectedDate
        ? "Elegí una fecha"
        : isPastDate(selectedDate)
            ? "No se puede elegir una fecha anterior a hoy"
            : null,
    selectedTime: !selectedTime ? "Elegí la hora de inicio" : null,
    price: price !== "" && Number(price) < 0 ? "El precio no puede ser negativo" : null,
});

const buildMoviesById = (movies) => {
    const map = {};
    movies.forEach((m) => { map[m.id] = m; });
    return map;
};

const buildOccupiedRanges = (occupied, moviesById) => (
    occupied.map((s) => {
        const otherMovie = moviesById[s.movieId];
        const durationMinutes = (otherMovie?.durationMinutes ?? 0) + CLEANING_BUFFER_MINUTES;
        const start = new Date(s.startTime);
        const end = new Date(start.getTime() + durationMinutes * 60000);
        return { id: s.id, start, end, title: otherMovie?.title ?? "otra película" };
    })
);

const buildPendingRange = (selectedDate, selectedTime, movieDurationMinutes) => {
    const start = combineDateAndTime(selectedDate, selectedTime);
    if (!start) return null;
    const end = new Date(start.getTime() + (movieDurationMinutes + CLEANING_BUFFER_MINUTES) * 60000);
    return { start, end };
};

const findConflict = (pendingRange, occupiedRanges) => {
    if (!pendingRange) return null;
    return occupiedRanges.find((r) => pendingRange.start < r.end && r.start < pendingRange.end) || null;
};

const MovieFunctionsPanel = ({ movieId, movieDurationMinutes, movieSuggestedPrice, isListOpen, onToggleList }) => {
    const [functions, setFunctions] = useState([]);
    const [screens, setScreens] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formError, setFormError] = useState(null);
    const [screenId, setScreenId] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [price, setPrice] = useState(movieSuggestedPrice ?? "");
    const [occupied, setOccupied] = useState([]);
    const [isLoadingOccupied, setIsLoadingOccupied] = useState(false);

    const [touched, setTouched] = useState({});

    const todayDate = startOfToday();

    useEffect(() => {
        let isMounted = true;

        setIsLoading(true);
        getShowtimesByMovie(
            movieId,
            (data) => { if (isMounted) { setFunctions(data); setIsLoading(false); } },
            (err) => {
                if (isMounted) {
                    console.error(err);
                    setError("No se pudieron cargar las funciones de esta película");
                    setIsLoading(false);
                }
            }
        );

        getAllScreens().then((data) => { if (isMounted) setScreens(data); }).catch((err) => console.error(err));
        getAllMovies().then((data) => { if (isMounted) setMovies(data); }).catch((err) => console.error(err));

        return () => { isMounted = false; };
    }, [movieId]);

    useEffect(() => {
        if (!screenId || !selectedDate) {
            setOccupied([]);
            return;
        }

        setIsLoadingOccupied(true);
        getOccupiedShowtimesByScreen(
            screenId,
            toDateOnlyString(selectedDate),
            (data) => { setOccupied(data); setIsLoadingOccupied(false); },
            (err) => { console.error(err); setOccupied([]); setIsLoadingOccupied(false); }
        );
    }, [screenId, selectedDate]);

    const moviesById = buildMoviesById(movies);
    const occupiedRanges = buildOccupiedRanges(occupied, moviesById);
    const pendingRange = buildPendingRange(selectedDate, selectedTime, movieDurationMinutes);
    const conflict = findConflict(pendingRange, occupiedRanges);

    const errors = validate({ screenId, selectedDate, selectedTime, price });
    const isFieldsValid = Object.values(errors).every((e) => e === null);
    const isFormValid = isFieldsValid && !conflict;

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const resetForm = () => {
        setScreenId("");
        setSelectedDate(null);
        setSelectedTime(null);
        setPrice(movieSuggestedPrice ?? "");
        setOccupied([]);
        setTouched({});
    };

    const handleOpenForm = () => {
        setFormError(null);
        setIsFormOpen(true);
    };

    const handleCancelForm = () => {
        resetForm();
        setFormError(null);
        setIsFormOpen(false);
    };

    const handleAdd = (event) => {
        event.preventDefault();
        setFormError(null);

        if (!isFormValid) {
            setTouched({ screenId: true, selectedDate: true, selectedTime: true, price: true });
            if (conflict) {
                setFormError(`Esa franja se superpone con "${conflict.title}" (${formatRange(conflict)}). Elegí otro horario.`);
            }
            return;
        }

        const start = combineDateAndTime(selectedDate, selectedTime);
        const showtime = {
            movieId,
            screenId,
            startTime: toLocalIsoString(start),
            price: price === "" ? (movieSuggestedPrice ?? 0) : Number(price),
        };

        addShowtime(
            showtime,
            (created) => {
                setFunctions((prev) => [...prev, created].sort((a, b) => a.startTime.localeCompare(b.startTime)));
                resetForm();
                setIsFormOpen(false);
            },
            (err) => setFormError(err.message || "Error al crear la función")
        );
    };

    const handleDelete = (id) => {
        if (!window.confirm("¿Eliminar esta función?")) return;
        deleteShowtime(
            id,
            () => setFunctions((prev) => prev.filter((f) => f.id !== id)),
            (err) => { console.error(err); setError("Error al eliminar la función"); }
        );
    };

    const screenName = (id) => screens.find((s) => s.id === id)?.name || id;

    return (
        <div className="functions-panel">
            <h3 className="functions-panel__title">🕒 Funciones</h3>

            {error && <p className="msg-inline-error">{error}</p>}

            <div className="functions-btn-group">
                <button
                    type="button"
                    onClick={onToggleList}
                    className="btn btn--outline-gold"
                >
                    {isListOpen ? "▲ Ocultar funciones" : `▼ Ver funciones${!isLoading ? ` (${functions.length})` : ""}`}
                </button>

                {!isFormOpen && (
                    <button
                        type="button"
                        onClick={handleOpenForm}
                        className="btn btn--primary"
                    >
                        + Agregar función
                    </button>
                )}
            </div>

            {isListOpen && (
                isLoading ? (
                    <p className="functions-muted">Cargando funciones...</p>
                ) : functions.length === 0 ? (
                    <p className="functions-muted">Todavía no hay funciones cargadas para esta película.</p>
                ) : (
                    <ul className="functions-list">
                        {functions.map((f) => (
                            <li key={f.id} className="functions-item">
                                <span>{screenName(f.screenId)} · {formatShowtime(f.startTime)} · ${f.price}</span>
                                <button
                                    onClick={() => handleDelete(f.id)}
                                    className="btn btn--delete-sm"
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                )
            )}

            {isFormOpen && (
                <form onSubmit={handleAdd}>
                    {formError && <p className="msg-inline-error">{formError}</p>}

                    <label className="functions-label">Sala</label>
                    <select
                        className={`form-input form-input--compact ${touched.screenId && errors.screenId ? 'form-input--error' : ''}`}
                        value={screenId}
                        onChange={(event) => setScreenId(event.target.value)}
                        onBlur={() => handleBlur("screenId")}
                    >
                        <option value="">Seleccionar sala...</option>
                        {screens.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    {touched.screenId && errors.screenId && <p className="functions-field-error">{errors.screenId}</p>}

                    <label className="functions-label">Fecha</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        onCalendarClose={() => handleBlur("selectedDate")}
                        minDate={todayDate}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Elegir fecha"
                        customInput={<input className={`form-input form-input--compact ${touched.selectedDate && errors.selectedDate ? 'form-input--error' : ''}`} />}
                        portalId="cinemapi-datepicker-portal"
                    />
                    {touched.selectedDate && errors.selectedDate && <p className="functions-field-error">{errors.selectedDate}</p>}

                    <label className="functions-label">Hora de inicio</label>
                    <DatePicker
                        selected={selectedTime}
                        onChange={(date) => setSelectedTime(date)}
                        onCalendarClose={() => handleBlur("selectedTime")}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Hora"
                        dateFormat="HH:mm"
                        locale="es"
                        placeholderText="Elegir hora"
                        customInput={<input className={`form-input form-input--compact ${touched.selectedTime && errors.selectedTime ? 'form-input--error' : ''}`} />}
                        portalId="cinemapi-datepicker-portal"
                    />
                    {touched.selectedTime && errors.selectedTime && <p className="functions-field-error">{errors.selectedTime}</p>}

                    {screenId && selectedDate && (
                        <p className={`functions-status ${isLoadingOccupied ? 'functions-status--loading' : conflict ? 'functions-status--conflict' : 'functions-status--ok'}`}>
                            {isLoadingOccupied
                                ? "Consultando horarios ocupados..."
                                : !selectedTime
                                    ? (occupiedRanges.length > 0
                                        ? `Ocupados ese día: ${occupiedRanges.map(formatRange).join(", ")}`
                                        : "Sala libre ese día")
                                    : conflict
                                        ? `⚠️ Se superpone con "${conflict.title}" (${formatRange(conflict)})`
                                        : occupiedRanges.length > 0
                                            ? `✅ Libre. Ocupados ese día: ${occupiedRanges.map(formatRange).join(", ")}`
                                            : "✅ Sala libre ese día"}
                        </p>
                    )}

                    <label className="functions-label">Precio</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`form-input form-input--compact ${touched.price && errors.price ? 'form-input--error' : ''}`}
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        onBlur={() => handleBlur("price")}
                        placeholder={movieSuggestedPrice != null ? `Sugerido: $${movieSuggestedPrice}` : "Precio de esta función"}
                    />
                    {touched.price && errors.price && <p className="functions-field-error">{errors.price}</p>}

                    <div className="functions-form-actions">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`btn ${isFormValid ? 'btn--primary' : 'btn--disabled'}`}
                        >
                            Guardar función
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelForm}
                            className="btn btn--cancel"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default MovieFunctionsPanel;
