import { useEffect, useState } from 'react';
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
