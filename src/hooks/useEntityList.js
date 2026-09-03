import { useEffect, useState } from 'react';
export const useEntityList = (fetchAll) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                const data = await fetchAll();
                if (isMounted) setList(data);
            } catch (err) {
                console.error(err);
            }
        };

        load();

        return () => { isMounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return list;
};
