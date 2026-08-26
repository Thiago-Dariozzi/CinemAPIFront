import React, { useState } from 'react';
import { addGenre } from './genreApi';

const initialForm = { name: "" };

const validate = (form) => ({
    name: form.name.trim() === "" ? "El nombre es obligatorio" : null,
});

const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#333', color: 'white', boxSizing: 'border-box' };

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
        <div style={{
            backgroundColor: '#1e1e1e',
            padding: '20px',
            borderRadius: '12px',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            border: '1px solid #444',
            fontFamily: 'sans-serif'
        }}>
            <h2 style={{ color: '#ffbd59', marginTop: 0, marginBottom: '20px' }}>Agregar Nuevo Género</h2>

            <form onSubmit={handleSubmit} style={{ color: 'white' }}>
                {formError && <p style={{ color: '#f44336', fontSize: '0.9rem' }}>{formError}</p>}

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nombre</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(event) => setForm({ name: event.target.value })}
                        onBlur={handleBlur}
                        style={{ ...inputStyle, border: `1px solid ${touched.name && errors.name ? '#f44336' : '#555'}` }}
                        placeholder="Ej: Acción, Comedia..."
                    />
                    {touched.name && errors.name && (
                        <p style={{ color: '#f44336', fontSize: '0.85rem', margin: '4px 0 0' }}>{errors.name}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid}
                    style={{
                        padding: '12px 20px',
                        backgroundColor: isFormValid ? '#ffbd59' : '#555',
                        color: isFormValid ? '#000' : '#888',
                        border: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                        opacity: isFormValid ? 1 : 0.6,
                        width: '100%',
                        fontSize: '1.1rem'
                    }}
                >
                    Guardar Género
                </button>
            </form>
        </div>
    );
};

export default NewGenre;
