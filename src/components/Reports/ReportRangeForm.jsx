import { useState } from 'react';
import { validateRange } from './reportRange';

const ReportRangeForm = ({ range, presets, onApply }) => {
    const [draft, setDraft] = useState(range);
    const error = validateRange(draft);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!error) onApply(draft);
    };

    const applyPreset = (preset) => {
        const next = { from: preset.from, to: preset.to };
        setDraft(next);
        onApply(next);
    };

    return (
        <form className="form-panel form-panel--wide report-range" onSubmit={handleSubmit}>
            <div className="chip-row" role="group" aria-label="Rangos rápidos">
                {presets.map((preset) => {
                    const selected = preset.from === range.from && preset.to === range.to;
                    return (
                        <button
                            key={preset.label}
                            type="button"
                            aria-pressed={selected}
                            className={`filter-chip ${selected ? 'filter-chip--selected' : ''}`}
                            onClick={() => applyPreset(preset)}
                        >
                            {preset.label}
                        </button>
                    );
                })}
            </div>

            <div className="report-range__fields">
                <div>
                    <label className="form-label" htmlFor="report-from">Vendidas desde</label>
                    <input
                        id="report-from"
                        type="date"
                        className="form-input"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? "report-range-error" : undefined}
                        value={draft.from}
                        onChange={(event) => setDraft((prev) => ({ ...prev, from: event.target.value }))}
                    />
                </div>
                <div>
                    <label className="form-label" htmlFor="report-to">Hasta</label>
                    <input
                        id="report-to"
                        type="date"
                        className="form-input"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? "report-range-error" : undefined}
                        value={draft.to}
                        onChange={(event) => setDraft((prev) => ({ ...prev, to: event.target.value }))}
                    />
                </div>
                <button type="submit" disabled={Boolean(error)} className={`btn btn--submit report-range__submit ${error ? 'btn--disabled' : ''}`}>
                    Ver reporte
                </button>
            </div>
            {error && <p id="report-range-error" className="msg-inline-error" aria-live="polite">{error}</p>}
        </form>
    );
};

export default ReportRangeForm;
