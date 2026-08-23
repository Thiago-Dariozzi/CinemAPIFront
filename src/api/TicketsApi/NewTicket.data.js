export const initialForm = {
    movieId: "",
    screenId: "",
    userId: "",
    buyDate: "",
    finalPrice: 0,
    showtimeId: "", // solo lo usa el panel de Usuario, para controlar el combo "Horario"
};

// El backend todavía no tiene ninguna lógica de precios (ni Movie ni Screen tienen un
// campo de precio propio), así que no existe un "precio correcto" para calcular. Hasta
// que se arme eso, el panel de Usuario cobra este precio plano y no deja que el cliente
// lo edite (Admin sí puede poner el precio a mano, ej. venta en boletería).
export const FIXED_TICKET_PRICE = 10;
