import { useState } from 'react';

const UserSearch = ({ search, onSearch }) => {
    const [text, setText] = useState(search);

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(text.trim());
    };

    const handleClear = () => {
        setText("");
        onSearch("");
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit} role="search">
            <div className="search-bar__field">
                <label className="form-label" htmlFor="user-search">Buscar por nombre o email</label>
                <input
                    id="user-search"
                    type="search"
                    className="form-input"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Ej: ana, @gmail.com"
                />
            </div>
            <button type="submit" className="btn btn--primary">Buscar</button>
            {search && <button type="button" onClick={handleClear} className="btn btn--cancel">Limpiar</button>}
        </form>
    );
};

export default UserSearch;
