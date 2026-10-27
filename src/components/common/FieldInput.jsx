const FieldInput = ({ id, field, value, touched, error, onChange, onBlur, optionsSources = {}, compact = false }) => {
    if (field.type === "select") {
        const options = optionsSources[field.optionsFrom] ?? [];
        return (
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(field.key, e.target.value)}
                onBlur={() => onBlur(field.key)}
                className={`form-select ${touched && error ? 'form-select--error' : ''}`}
            >
                <option value="">{field.placeholder}</option>
                {options.map((opt) => (
                    <option key={opt[field.optionValueKey ?? 'id']} value={opt[field.optionValueKey ?? 'id']}>
                        {opt[field.optionLabelKey ?? 'name']}
                    </option>
                ))}
            </select>
        );
    }

    if (field.type === "checkbox") {
        return (
            <label className="form-checkbox-row">
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(field.key, e.target.checked)}
                    className="form-checkbox"
                />
                <span>{field.label}</span>
            </label>
        );
    }

    return (
        <input
            id={id}
            type={field.type}
            min={field.min}
            step={field.step}
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            onBlur={() => onBlur(field.key)}
            className={`form-input ${compact ? 'form-input--compact' : ''} ${touched && error ? 'form-input--error' : ''}`}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
        />
    );
};

export default FieldInput;
