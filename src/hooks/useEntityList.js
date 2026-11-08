import { useEffect, useState } from 'react';
// Loads a read-only list
export const useEntityList = (fetchAll) => {
    const [list, setList] = useState([]);

    // Fetches the list once
    useEffect(() => {
        let ignore = false;

        fetchAll()
            .then((data) => {
                if (!ignore) setList(data);
            })
            .catch((err) => {
                console.error(err);
            });

        return () => { ignore = true; };
    }, [fetchAll]);

    return list;
};
