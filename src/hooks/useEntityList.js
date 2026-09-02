import { useEffect, useState } from 'react';

// Fetch de una lista secundaria de solo lectura (ej: géneros para el Dashboard de
// películas, películas para GenreDashboard). A propósito no expone loading/error: hoy
// ninguna de estas listas secundarias bloquea la pantalla ni muestra un error propio,
// solo se loguean en consola si fallan.
export const useEntityList = (fetchAll) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        let isMounted = true;
        fetchAll()
            .then((data) => { if (isMounted) setList(data); })
            .catch((err) => console.error(err));
        return () => { isMounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return list;
};
