import { formatMoney } from '../../utils/money';
import { dayChipLabel, formatLongDate, formatTime } from '../../utils/dates';

const FEW_SEATS_RATIO = 0.1;

const seatsLabel = ({ availableSeats, totalSeats }) => {
    if (availableSeats === 0) return { text: "Agotada", modifier: "sold-out" };
    if (availableSeats <= Math.max(1, Math.floor(totalSeats * FEW_SEATS_RATIO))) {
        return { text: `¡Últimas ${availableSeats}!`, modifier: "few" };
    }
    return { text: `${availableSeats} libres`, modifier: "ok" };
};

const ShowtimeSchedule = ({ days, selectedDate, today, canBuy, onSelectDate, onBuy }) => {
    const selectedDay = days.find((day) => day.date === selectedDate) ?? days[0];

    return (
        <div className="schedule">
            <div className="chip-row" role="group" aria-label="Días con funciones">
                {days.map((day) => {
                    const label = dayChipLabel(day.date, today);
                    const selected = day.date === selectedDay.date;
                    return (
                        <button
                            key={day.date}
                            type="button"
                            aria-pressed={selected}
                            className={`filter-chip ${selected ? 'filter-chip--selected' : ''}`}
                            onClick={() => onSelectDate(day.date)}
                        >
                            <span className="filter-chip__name">{label.name}</span>
                            <span className="filter-chip__date">{label.date}</span>
                        </button>
                    );
                })}
            </div>

            <h3 className="schedule__day-title" aria-live="polite">{formatLongDate(selectedDay.date)}</h3>

            <ul className="showtime-grid">
                {selectedDay.showtimes.map((showtime) => {
                    const seats = seatsLabel(showtime);
                    const soldOut = showtime.availableSeats === 0;
                    const details = (
                        <>
                            <span className="showtime-slot__time">{formatTime(showtime.startTime)}</span>
                            <span className="showtime-slot__screen">{showtime.screenName}</span>
                            <span className="showtime-slot__price">{formatMoney(showtime.price)}</span>
                            <span className={`showtime-slot__seats showtime-slot__seats--${seats.modifier}`}>{seats.text}</span>
                        </>
                    );
                    return (
                        <li key={showtime.id}>
                            {soldOut || !canBuy ? (
                                <div className="showtime-slot showtime-slot--static">{details}</div>
                            ) : (
                                <button
                                    type="button"
                                    className="showtime-slot"
                                    onClick={() => onBuy(showtime, selectedDay.date)}
                                    aria-label={`Comprar para las ${formatTime(showtime.startTime)} en ${showtime.screenName}, ${seats.text}`}
                                >
                                    {details}
                                    <span className="showtime-slot__cta">Comprar</span>
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ShowtimeSchedule;
