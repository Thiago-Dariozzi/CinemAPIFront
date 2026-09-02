import React, { useState } from 'react';
import { addGenre } from '../../api/genreApi';

const initialForm = { name: "" };

const validate = (form) => ({
    name: form.name.trim() === "" ? "El nombre es obligatorio" : null,
});

const NewGenre = ({ onAdded }) => {
    const [form, setForm] = useState(initialForm);
    const [touched, setTouched] = useState({});
    const [formError, setFormError] = useState(null);

    const errors = validate(form);
    const isFormValid = errors.name === null;

    const handleBlur = () => setTouched({ name: true });

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormError(null);

        if (!isFormValid) {
            setTouched({ name: true });
            return;
        }

        addGenre(
            form,
            (created) => {
                onAdded(created);
                setForm(initialForm);
                setTouched({});
            },
            (err) => setFormError(err.message || "Error al crear el género")
        );
    };

    return (
        <div className="form-panel">
            <h2 className="form-panel__title">Agregar Nuevo Género</h2>

            <form onSubmit={handleSubmit} className="form-body">
                {formError && <p className="msg-inline-error">{formError}</p>}

                <div className="form-field--lg">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(event) => setForm({ name: event.target.value })}
                        onBlur={handleBlur}
                        className={`form-input ${touched.name && errors.name ? 'form-input--error' : ''}`}
                        placeholder="Ej: Acción, Comedia..."
                    />
                    {touched.name && errors.name && (
                        <p className="form-error-text">{errors.name}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`btn btn--submit ${!isFormValid ? 'btn--disabled' : ''}`}
                >
                    Guardar Género
                </button>
            </form>
        </div>
    );
};

export default NewGenre;
