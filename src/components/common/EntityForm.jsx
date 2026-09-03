import { useState } from 'react';
import { computeErrors } from './fieldValidation';
import FieldInput from './FieldInput';
import FieldBody from './FieldBody';

const buildPayload = (fields, form) => {
    const payload = {};
    fields.forEach((field) => {
        if (field.omitIfEmpty && form[field.key] === "") return;
        payload[field.key] = field.coerce ? field.coerce(form[field.key]) : form[field.key];
    });
    return payload;
};

// Agrupa campos consecutivos que comparten field.group en una misma fila (.form-row),
// para casos como imageUrl + durationMinutes lado a lado.
const groupFields = (fields) => {
    const rows = [];
    let openGroup = null;
    fields.forEach((field) => {
        if (field.group && openGroup?.group === field.group) {
            openGroup.fields.push(field);
            return;
        }
        openGroup = field.group ? { group: field.group, fields: [field] } : null;
        rows.push(openGroup ?? { group: null, fields: [field] });
    });
    return rows;
};

const EntityForm = ({ title, submitLabel = "Guardar", fields, initialValues, optionsSources = {}, onSubmit }) => {
    const [form, setForm] = useState(initialValues);
    const [touched, setTouched] = useState({});
    const [submitError, setSubmitError] = useState(null);

    const errors = computeErrors(fields, form);
    const isFormValid = Object.values(errors).every((e) => e == null);

    const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
    const handleBlur = (key) => setTouched((prev) => ({ ...prev, [key]: true }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitError(null);

        if (!isFormValid) {
            setTouched(Object.fromEntries(fields.map((f) => [f.key, true])));
            return;
        }

        try {
            await onSubmit(buildPayload(fields, form));
            setForm(initialValues);
            setTouched({});
        } catch (err) {
            setSubmitError(err?.message || "Ocurrió un error");
        }
    };

    const fieldProps = (field) => ({
        field,
        value: form[field.key],
        touched: touched[field.key],
        error: errors[field.key],
        onChange: handleChange,
        onBlur: handleBlur,
        optionsSources,
    });

    return (
        <div className="form-panel">
            <h2 className="form-panel__title">{title}</h2>

            <form onSubmit={handleSubmit} className="form-body">
                {submitError && <p className="msg-inline-error">{submitError}</p>}

                {groupFields(fields).map((row, index) => (
                    row.group ? (
                        <div key={`${row.group}-${index}`} className="form-row">
                            {row.fields.map((field) => (
                                <div key={field.key} className={field.compact ? "form-row__fixed" : "form-row__grow"}>
                                    <FieldBody {...fieldProps(field)} />
                                </div>
                            ))}
                        </div>
                    ) : row.fields[0].type === "checkbox" ? (
                        <FieldInput key={row.fields[0].key} {...fieldProps(row.fields[0])} />
                    ) : (
                        <div key={row.fields[0].key} className={row.fields[0].size === "lg" ? "form-field--lg" : "form-field"}>
                            <FieldBody {...fieldProps(row.fields[0])} />
                        </div>
                    )
                ))}

                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`btn btn--submit ${!isFormValid ? 'btn--disabled' : ''}`}
                >
                    {submitLabel}
                </button>
            </form>
        </div>
    );
};

export default EntityForm;
