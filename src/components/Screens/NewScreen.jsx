import React, { useState } from 'react';

const initialForm = {
    name: '',
    capacity: 0
};

const NewScreen = ({ onAddScreen }) => {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState(null)

    const handleChangeValue = (event, inputKey) => {
        setForm((prevForm) => ({
            ...prevForm,
            [inputKey]: event.target.value
        }));
    };

    const handleAddScreen = (event) => {
        event.preventDefault();

        if(form.name === ""){
            setError("Nombre vacío")
            return;
           
        }

        if(form.capacity <=0){
            setError("La capacidad debe ser mayor a 0")
            return;
        }



        onAddScreen(form);
        setForm(initialForm);
        setError(null)
    };

    return (
        <div className="form-panel">
            <h2 className="form-panel__title">Agregar Nueva Sala</h2>
            {error ? <p className="form-error-text">{error}</p> : null}


            <form onSubmit={handleAddScreen} className="form-body">
                <div className="form-field">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(event) => handleChangeValue(event, "name")}
                        className="form-input"
                        placeholder="Ej: Sala 1, Sala IMAX..."
                    />
                </div>

                <div className="form-field--lg">
                    <label className="form-label">Capacidad</label>
                    <input
                        type="number"
                        value={form.capacity}
                        onChange={(event) => handleChangeValue(event, "capacity")}
                        className="form-input"
                        placeholder="Cantidad de asientos"
                    />
                </div>

                <button type="submit" className="btn btn--submit">
                    Guardar Sala
                </button>
            </form>
        </div>
    );
};

export default NewScreen;
