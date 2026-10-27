import { useState } from 'react';
import { isDateKey } from '../../utils/dates';

const MIN_YEAR = 2000;

const isReasonableDate = (value) => isDateKey(value) && Number(value.slice(0, 4)) >= MIN_YEAR;

const OccupancyDateForm = ({ date, onApply }) => {
    const [draft, setDraft] = useState(date);
    const valid = isReasonableDate(draft);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (valid) onApply(draft);
    };

    return (
        <form className="form-panel form-panel--wide report-range__fields" onSubmit={handleSubmit}>
            <div>
                <label className="form-label" htmlFor="occupancy-date">Día</label>
                <input
                    id="occupancy-date"
                    type="date"
                    className="form-input"
                    value={draft}
                    aria-invalid={!valid}
                    onChange={(event) => setDraft(event.target.value)}
                />
            </div>
            <button type="submit" disabled={!valid} className={`btn btn--submit report-range__submit ${valid ? '' : 'btn--disabled'}`}>
                Ver ocupación
            </button>
        </form>
    );
};

export default OccupancyDateForm;
