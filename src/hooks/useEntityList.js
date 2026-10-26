import { useEffect, useState } from 'react';
export const useEntityList = (fetchAll) => {
    const [list, setList] = useState([]);

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
