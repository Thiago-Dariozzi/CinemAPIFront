import React, { useEffect, useMemo, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import { getAllScreens } from '../ScreensApi/ScreenApi';
import { getAllMovies } from '../MoviesApi/movieApi';
import {
    getShowtimesByMovie,
    getOccupiedShowtimesByScreen,
    addShowtime,
    deleteShowtime,
    formatShowtime,
} from './showtimeApi';

// Debe coincidir con ShowtimeService.CLEANING_BUFFER_MINUTES en el backend: la validación
// real la sigue haciendo el backend, esto es solo para el aviso visual antes de guardar.
const CLEANING_BUFFER_MINUTES = 15;

registerLocale('es', es);

const baseInputStyle = { width: '100%', padding: '8px', borderRadius: '5px', backgroundColor: '#333', color: 'white', boxSizing: 'border-box', marginBottom: '4px' };
const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: '#ccc' };
const fieldErrorStyle = { color: '#f44336', fontSize: '0.8rem', margin: '0 0 10px' };

const pad = (n) => String(n).padStart(2, '0');

// "Hoy" a las 00:00 (hora local), para bloquear fechas pasadas.
const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isPastDate = (date) => startOfDay(date) < startOfToday();

// Combina la fecha con la hora (solo se usan sus horas/minutos) en un único Date, en
// hora local, sin pasar por UTC.
const combineDateAndTime = (date, timeDate) => {
    if (!date || !timeDate) return null;
    const combined = new Date(date);
    combined.setHours(timeDate.getHours(), timeDate.getMinutes(), 0, 0);
    return combined;
};

// "YYYY-MM-DD" en hora local (toISOString() correría el día según el huso horario del navegador).
const toDateOnlyString = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// "YYYY-MM-DDTHH:mm:00" en hora local — mismo formato que ya esperaba el backend.
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

    // Referencia estable: pasarle startOfToday() inline a <DatePicker> le daría un Date
    // nuevo en cada render.
    const todayDate = useMemo(() => startOfToday(), []);

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

    const moviesById = useMemo(() => {
        const map = {};
        movies.forEach((m) => { map[m.id] = m; });
        return map;
    }, [movies]);

    // Mismo cálculo que ShowtimeService.ValidateNoOverlap en el backend: el tramo ocupado
    // por cada función existente es [StartTime, StartTime + duración de su película + buffer].
    const occupiedRanges = useMemo(() => (
        occupied.map((s) => {
            const otherMovie = moviesById[s.movieId];
            const durationMinutes = (otherMovie?.durationMinutes ?? 0) + CLEANING_BUFFER_MINUTES;
            const start = new Date(s.startTime);
            const end = new Date(start.getTime() + durationMinutes * 60000);
            return { id: s.id, start, end, title: otherMovie?.title ?? "otra película" };
        })
    ), [occupied, moviesById]);

    const pendingRange = useMemo(() => {
        const start = combineDateAndTime(selectedDate, selectedTime);
        if (!start) return null;
        const end = new Date(start.getTime() + (movieDurationMinutes + CLEANING_BUFFER_MINUTES) * 60000);
        return { start, end };
    }, [selectedDate, selectedTime, movieDurationMinutes]);

    // Se cruzan si [pendingStart, pendingEnd) y [otherStart, otherEnd) se solapan aunque
    // sea parcialmente (tocarse justo en el borde no cuenta como choque).
    const conflict = useMemo(() => {
        if (!pendingRange) return null;
        return occupiedRanges.find((r) => pendingRange.start < r.end && r.start < pendingRange.end) || null;
    }, [pendingRange, occupiedRanges]);

    const errors = validate({ screenId, selectedDate, selectedTime, price });
    const isFieldsValid = Object.values(errors).every((e) => e === null);
    const isFormValid = isFieldsValid && !conflict;

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const styleFor = (field) => ({
        ...baseInputStyle,
        border: `1px solid ${touched[field] && errors[field] ? '#f44336' : '#555'}`,
    });

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
                setIsFormOpen(false); // se guardó bien: el form vuelve a colapsado
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
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #444' }}>
            <h3 style={{ color: '#ffbd59', fontSize: '1rem', marginBottom: '10px' }}>🕒 Funciones</h3>

            {error && <p style={{ color: '#e74c3c', fontSize: '0.9rem' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <button
                    type="button"
                    onClick={onToggleList}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: '#ffbd59',
                        border: '1px solid #ffbd59',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    {isListOpen ? "▲ Ocultar funciones" : `▼ Ver funciones${!isLoading ? ` (${functions.length})` : ""}`}
                </button>

                {!isFormOpen && (
                    <button
                        type="button"
                        onClick={handleOpenForm}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#ffbd59',
                            color: '#000',
                            border: 'none',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        + Agregar función
                    </button>
                )}
            </div>

            {isListOpen && (
                isLoading ? (
                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Cargando funciones...</p>
                ) : functions.length === 0 ? (
                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Todavía no hay funciones cargadas para esta película.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '15px' }}>
                        {functions.map((f) => (
                            <li key={f.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                backgroundColor: '#2a2a2a', padding: '8px 12px', borderRadius: '6px', marginBottom: '6px',
                                fontSize: '0.9rem'
                            }}>
                                <span>{screenName(f.screenId)} · {formatShowtime(f.startTime)} · ${f.price}</span>
                                <button
                                    onClick={() => handleDelete(f.id)}
                                    style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontWeight: 'bold' }}
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
                    {formError && <p style={{ color: '#e74c3c', fontSize: '0.9rem' }}>{formError}</p>}

                    <label style={labelStyle}>Sala</label>
                    <select
                        style={styleFor("screenId")}
                        value={screenId}
                        onChange={(event) => setScreenId(event.target.value)}
                        onBlur={() => handleBlur("screenId")}
                    >
                        <option value="">Seleccionar sala...</option>
                        {screens.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    {touched.screenId && errors.screenId && <p style={fieldErrorStyle}>{errors.screenId}</p>}

                    <label style={labelStyle}>Fecha</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        onCalendarClose={() => handleBlur("selectedDate")}
                        minDate={todayDate}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Elegir fecha"
                        customInput={<input style={styleFor("selectedDate")} />}
                        // withPortal sin portalId no usa ReactDOM.createPortal de verdad: pinta
                        // un div position:fixed dentro del árbol DOM normal, y .movie-card:hover
                        // tiene un transform que le secuestra el containing block (parpadeo).
                        // portalId sí porta a document.body de verdad, afuera de eso.
                        portalId="cinemapi-datepicker-portal"
                    />
                    {touched.selectedDate && errors.selectedDate && <p style={fieldErrorStyle}>{errors.selectedDate}</p>}

                    <label style={labelStyle}>Hora de inicio</label>
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
                        customInput={<input style={styleFor("selectedTime")} />}
                        // Mismo fix que en el calendario de fecha (ver comentario arriba): un
                        // portal de verdad, no withPortal, para no reabrir el bug de parpadeo.
                        portalId="cinemapi-datepicker-portal"
                    />
                    {touched.selectedTime && errors.selectedTime && <p style={fieldErrorStyle}>{errors.selectedTime}</p>}

                    {screenId && selectedDate && (
                        <p style={{
                            fontSize: '0.85rem', marginTop: '-4px', marginBottom: '10px',
                            color: isLoadingOccupied ? '#aaa' : conflict ? '#e74c3c' : '#4caf50'
                        }}>
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

                    <label style={labelStyle}>Precio</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        style={styleFor("price")}
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        onBlur={() => handleBlur("price")}
                        placeholder={movieSuggestedPrice != null ? `Sugerido: $${movieSuggestedPrice}` : "Precio de esta función"}
                    />
                    {touched.price && errors.price && <p style={fieldErrorStyle}>{errors.price}</p>}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: isFormValid ? '#ffbd59' : '#555',
                                color: isFormValid ? '#000' : '#888',
                                border: 'none',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                cursor: isFormValid ? 'pointer' : 'not-allowed',
                                opacity: isFormValid ? 1 : 0.6
                            }}
                        >
                            Guardar función
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelForm}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#7f8c8d',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
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
