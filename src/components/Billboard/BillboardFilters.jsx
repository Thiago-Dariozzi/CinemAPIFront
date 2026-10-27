import { dayChipLabel } from '../../utils/dates';

const Chip = ({ selected, onClick, children }) => (
    <button
        type="button"
        className={`filter-chip ${selected ? 'filter-chip--selected' : ''}`}
        aria-pressed={selected}
        onClick={onClick}
    >
        {children}
    </button>
);

const BillboardFilters = ({ genres, dateKeys, today, genreId, date, onGenreChange, onDateChange }) => (
    <div className="billboard-filters">
        <div className="billboard-filters__group" role="group" aria-label="Filtrar por día">
            <span className="billboard-filters__label">Día</span>
            <div className="chip-row">
                <Chip selected={!date} onClick={() => onDateChange("")}>Todos</Chip>
                {dateKeys.map((key) => {
                    const label = dayChipLabel(key, today);
                    return (
                        <Chip key={key} selected={date === key} onClick={() => onDateChange(key)}>
                            <span className="filter-chip__name">{label.name}</span>
                            <span className="filter-chip__date">{label.date}</span>
                        </Chip>
                    );
                })}
            </div>
        </div>

        <div className="billboard-filters__group" role="group" aria-label="Filtrar por género">
            <span className="billboard-filters__label">Género</span>
            <div className="chip-row">
                <Chip selected={!genreId} onClick={() => onGenreChange("")}>Todos</Chip>
                {genres.map((genre) => (
                    <Chip key={genre.id} selected={genreId === genre.id} onClick={() => onGenreChange(genre.id)}>
                        {genre.name}
                    </Chip>
                ))}
            </div>
        </div>
    </div>
);

export default BillboardFilters;
