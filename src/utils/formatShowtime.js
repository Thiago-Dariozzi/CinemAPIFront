export const formatShowtime = (startTime) => {
    const date = new Date(startTime);
    if (Number.isNaN(date.getTime())) return startTime;

    const datePart = date.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' });
    const timePart = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} · ${timePart}`;
};
