// Adapta una función callback-style fn(...args, onSuccess, onError) (genreApi.js,
// ticketApi.js, userApi.js, showtimeApi.js) a una función que devuelve una Promise,
// para poder usarla junto con las funciones promise-style (movieApi.js, screenApi.js)
// detrás de un mismo hook (useEntityCrud, useEntityList).
export const promisify = (fn) => (...args) =>
    new Promise((resolve, reject) => fn(...args, resolve, reject));
