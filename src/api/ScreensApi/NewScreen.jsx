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
        <div style={{
            backgroundColor: '#1e1e1e',
            padding: '20px',
            borderRadius: '12px',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            border: '1px solid #444',
            fontFamily: 'sans-serif'
        }}>
            <h2 style={{ color: '#ffbd59', marginTop: 0, marginBottom: '20px' }}>Agregar Nueva Sala</h2>
            {error ? <p style={{ color: 'red' }}>{error}</p> : null}


            <form onSubmit={handleAddScreen} style={{ color: 'white' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nombre</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(event) => handleChangeValue(event, "name")}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', boxSizing: 'border-box' }}
                        placeholder="Ej: Sala 1, Sala IMAX..."
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Capacidad</label>
                    <input
                        type="number"
                        value={form.capacity}
                        onChange={(event) => handleChangeValue(event, "capacity")}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', boxSizing: 'border-box' }}
                        placeholder="Cantidad de asientos"
                    />
                </div>

                <button type="submit" style={{
                    padding: '12px 20px',
                    backgroundColor: '#ffbd59',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '1.1rem'
                }}>
                    Guardar Sala
                </button>
            </form>
        </div>
    );
};

export default NewScreen;
