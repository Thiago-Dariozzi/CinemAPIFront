import React, { useState } from 'react';
import { initialForm } from './NewMovieData'; 
import MovieCard from './MovieCard';
import MovieContainer from './MovieContainer';

const NewMovie = ({ onAddMovie }) => {
    
    const [form, setForm] = useState(initialForm);

    const handleChangeValue = (event, inputKey) => {
        setForm((prevForm) => ({
            ...prevForm,
            [inputKey]: event.target.value
        }));
    }

    const handleChangeIsActive = (event) => {
        setForm((prevForm) => ({
            ...prevForm,
            isActive: event.target.checked 
        }));
    }

    const handleAddMovie = (event) => {
        event.preventDefault();
        onAddMovie(form);
        setForm(initialForm); 
    }

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
            <h2 style={{ color: '#ffbd59', marginTop: 0, marginBottom: '20px' }}>Agregar Nueva Película</h2>
            
            <form onSubmit={handleAddMovie} style={{ color: 'white' }}>
                
                {/* TÍTULO */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Título</label>
                    <input 
                        type="text" 
                        value={form.title}
                        onChange={(event) => handleChangeValue(event, "title")}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', boxSizing: 'border-box' }}
                        placeholder="Ingresar título"
                    />
                </div>

                {/* GÉNERO */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Género</label>
                    <input 
                        type="text" 
                        value={form.genre}
                        onChange={(event) => handleChangeValue(event, "genre")}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', boxSizing: 'border-box' }}
                        placeholder="Ej: Acción, Comedia..."
                    />
                </div>

                {/* SINOPSIS */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Sinopsis</label>
                    <input 
                        type="text" 
                        value={form.synopsis}
                        onChange={(event) => handleChangeValue(event, "synopsis")}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', boxSizing: 'border-box' }}
                        placeholder="Breve resumen"
                    />
                </div>

                {/* IMAGEN Y DURACIÓN EN LA MISMA FILA */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>URL Imagen</label>
                        <input 
                            type="text" 
                            value={form.imageUrl}
                            onChange={(event) => handleChangeValue(event, "imageUrl")}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ width: '120px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Minutos</label>
                        <input 
                            type="number" 
                            value={form.durationMinutes}
                            onChange={(event) => handleChangeValue(event, "durationMinutes")}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                {/* CHECKBOX: ¿Está en cartelera? */}
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                        type="checkbox" 
                        id="isActive"
                        checked={form.isActive}
                        onChange={handleChangeIsActive}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <label htmlFor="isActive" style={{ cursor: 'pointer' }}>¿Está en cartelera disponible?</label>
                </div>

                {/* BOTÓN GUARDAR */}
                <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#ffbd59', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '1.1rem' }}>
                    Guardar Película
                </button>
            </form>
        </div>
    );
};

export default NewMovie;