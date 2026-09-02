import React from 'react';

// Input genérico según field.type, compartido por EntityForm y EntityCard (edición
// dentro de una card usa compact=true, que agrega form-input--compact).
const FieldInput = ({ field, value, touched, error, onChange, onBlur, optionsSources = {}, compact = false }) => {
    if (field.type === "select") {
        const options = optionsSources[field.optionsFrom] ?? [];
        return (
            <select
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
            <div className="form-checkbox-row">
                <input
                    type="checkbox"
                    id={field.key}
                    checked={value}
                    onChange={(e) => onChange(field.key, e.target.checked)}
                    className="form-checkbox"
                />
                <label htmlFor={field.key}>{field.label}</label>
            </div>
        );
    }

    return (
        <input
            type={field.type}
            min={field.min}
            step={field.step}
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            onBlur={() => onBlur(field.key)}
            className={`form-input ${compact ? 'form-input--compact' : ''} ${touched && error ? 'form-input--error' : ''}`}
            placeholder={field.placeholder}
        />
    );
};

export default FieldInput;
