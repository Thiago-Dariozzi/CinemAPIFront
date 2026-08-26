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

// Debe coincidir con ShowtimeService.CLEANING_BUFFER_MINUTES en el backend: acá solo se
// usa para el aviso visual ANTES de guardar (para que el admin no lo descubra recién al
// mandar el form); la regla real que manda es siempre la validación del backend.
const CLEANING_BUFFER_MINUTES = 15;

// Calendario y selector de hora en español: el resto de la app ya está en español.
registerLocale('es', es);

const baseInputStyle = { width: '100%', padding: '8px', borderRadius: '5px', backgroundColor: '#333', color: 'white', boxSizing: 'border-box', marginBottom: '4px' };
const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: '#ccc' };
const fieldErrorStyle = { color: '#f44336', fontSize: '0.8rem', margin: '0 0 10px' };

const pad = (n) => String(n).padStart(2, '0');

// "Hoy" a las 00:00 (hora local), para bloquear fechas pasadas tanto en el calendario
// (minDate) como al enviar el form (por si algo lo esquiva, ej. reloj del sistema raro).
const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isPastDate = (date) => startOfDay(date) < startOfToday();

// Combina la fecha (Date, del calendario) con la hora (Date, del time-picker — solo se usan
// sus horas/minutos) en un único Date real, en hora local (sin pasar por UTC).
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

// Errores derivados en cada render a partir de los valores actuales (no es estado aparte,
// así que no hace falta un useEffect para "recalcularlos" — ya son en vivo por naturaleza).
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

// Lista de funciones (Showtimes) de una película puntual, con alta y baja de cada una.
// Vive en MovieCard, visible solo para el Admin (mismo gate que Editar/Eliminar película).
// isListOpen/onToggleList son controlados por MovieCard (no estado local acá): la tarjeta
// necesita saber si la lista está desplegada para resaltarse a sí misma en la grilla.
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

    // Un campo entra en "touched" recién cuando el usuario lo completó por primera vez, no
    // antes — hasta entonces no se le muestra error aunque ya esté "mal" (ej. sala sin
    // elegir al abrir el form). De ahí en adelante, cada cambio re-valida en vivo porque
    // `errors` se recalcula en cada render.
    const [touched, setTouched] = useState({});

    // Estable durante toda la vida del componente: minDate={startOfToday()} inline le pasaría
    // un Date nuevo (referencia distinta) a <DatePicker> en cada render, sin necesidad.
    const todayDate = useMemo(() => startOfToday(), []);

    // Funciones ya cargadas de esta película + catálogo de salas/películas (esto último
    // para poder mostrar título y duración de la función "ajena" con la que se choca,
    // igual que el resto de los componentes de este proyecto, que traen sus propias
    // dependencias en vez de compartir un store global).
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

    // Cada vez que cambian la sala o la fecha elegidas, preguntamos qué horarios ya están
    // ocupados en esa sala ese día (GET api/showtime/screen/{screenId}?date=...).
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

    // Colapsado por defecto: "+ Agregar función" lo abre, "Cancelar" lo cierra sin guardar.
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

        // Defensa extra: con el botón deshabilitado esto no debería dispararse mientras
        // haya campos inválidos o un choque de horario, pero no confiamos solo en el
        // disabled del botón.
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
            (err) => {
                // err.message viene tal cual del backend en un choque de horario (400/409),
                // no un "Error al crear la función" genérico, y se muestra dentro del
                // formulario de ESTA película (no un alert global).
                setFormError(err.message || "Error al crear la función");
            }
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
                        // BUG que arreglamos acá: withPortal SIN portalId no usa un portal de
                        // verdad (ReactDOM.createPortal) — solo pinta un div position:fixed
                        // DENTRO del árbol DOM normal. .movie-card:hover tiene un transform
                        // (index.css), y un transform activo en un ancestro "secuestra" el
                        // containing block de sus descendientes position:fixed (así lo define
                        // CSS). El calendario quedaba atado a la tarjeta, tapaba el cursor,
                        // sacaba el :hover, liberaba el containing block, se reposicionaba, el
                        // mouse volvía a entrar en :hover... loop de parpadeo autoalimentado.
                        // portalId sí sigue andando en runtime en esta versión (solo lo
                        // sacaron de los tipos de TS; acá no hay chequeo de tipos) y usa
                        // ReactDOM.createPortal de verdad, afuera del overflow:hidden Y del
                        // transform de .movie-card.
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
