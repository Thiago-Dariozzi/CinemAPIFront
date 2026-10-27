---
name: react-cineapi
description: Buenas prácticas de React 19 + JavaScript para CinemAPIFront (componentes, hooks, capa api, formularios con EntityForm/EntityCard, estilos con clases CSS, react-bootstrap, ruteo). Usar al escribir o modificar cualquier archivo .js/.jsx del front web.
---

# React en CinemAPIFront

## Capa `api/` (única que habla con el backend)

Un cliente compartido + un archivo por entidad. Los errores del backend ya llegan como ProblemDetails y se leen con `readApiError` (`src/api/apiError.js`: toma `detail` o junta los mensajes de `errors` en las validaciones); el cliente lo reutiliza:

```js
// src/api/httpClient.js
import { readApiError } from "./apiError";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5288/api";

export const request = async (path, { method = "GET", body, errorMessage = "Error de comunicación con el servidor", anonymous = false } = {}) => {
    const token = getToken();                                   // inyectado por session.js
    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            Accept: "application/json",
            ...(body !== undefined && { "Content-Type": "application/json" }),
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (response.status === 401 && !anonymous) onUnauthorized(); // cierra la sesión
    if (!response.ok) throw new Error(await readApiError(response, errorMessage));
    return response.status === 204 ? null : response.json();
};
```

```js
// src/api/genreApi.js
import { request } from "./httpClient";

export const getAllGenres = () => request("/genre", { errorMessage: "Error al obtener los géneros" });
export const addGenre = (genre) => request("/genre", { method: "POST", body: { name: genre.name }, errorMessage: "Error al crear el género" });
```

- `.env.development` con `VITE_API_URL=http://localhost:5288/api` (y `.env.example` versionado). Nada de `http://localhost:5288` repetido en cada archivo.
- Mapear la forma del backend en estas funciones (`mapShowtimeFromBackend`) cuando difiera de lo que usa la UI. Al hacer POST/PUT mandar solo los campos que el backend espera (nunca `id` en el body del POST ni `isActive`).
- Los mensajes de error que llegan del backend (ej. solapamiento de funciones, género duplicado) se muestran tal cual al usuario.
- Sin JSX, sin estado y sin `localStorage` en `api/`.

## Datos en componentes: hooks, nunca `fetch` directo

- ABM de una entidad → `useEntityCrud({ fetchAll, addFn, updateFn, deleteFn, messages })`. Opciones: `restoreFn` (devuelve `handleRestore`, para reactivar), `softDelete` (la baja deja el ítem con `isActive: false` en vez de sacarlo), `reloadAfterMutation` (vuelve a pedir la lista después de cada cambio, ej. al marcar un cargo vigente se desmarca otro) , `reload()` y `refreshing` (true mientras se vuelve a pedir la lista después de la primera carga). `EntityCard` acepta `onRestore`, `deleteLabel` y `restoreLabel`.
- Lista auxiliar (ej. géneros para un select) → `useEntityList(getAllGenres)`.
- Si una pantalla necesita algo que los hooks no cubren (ej. funciones por película), crear un hook específico en `src/hooks` (`useMovieShowtimes`) en lugar de meter `useEffect` + `fetch` en el componente.
- Los hooks deben recibir funciones estables (importadas del módulo `api/`), así sus dependencias pueden declararse sin `eslint-disable`:

```js
// ✅ dependencias declaradas; fetchAll es estable porque es un import
useEffect(() => {
    let ignore = false;
    fetchAll()
        .then((data) => { if (!ignore) setList(data); })
        .catch(() => { if (!ignore) setError(fetchErrorMessage); })
        .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
}, [fetchAll, fetchErrorMessage]);
```

## Formularios y cards: usar los genéricos

Para cada entidad:

```
components/<Entidad>/
  <entidad>Fields.js        // config: [{ key, label, type, placeholder, validate, coerce, group, options }]
  New<Entidad>.jsx          // <EntityForm fields={...} initialValues={...} onSubmit={onAdd} />
  <Entidad>Card.jsx         // <EntityCard values={...} fields={...} renderView={...} onEdit onDelete />
  <Entidad>Container.jsx    // <EntityGrid items renderItem />
  <Entidad>Dashboard.jsx    // useEntityCrud + composición
```

- Validaciones en la config de campos (`validate: (value, form) => mensaje | null`), no dispersas en el componente.
- Si un formulario necesita algo que `EntityForm`/`EntityCard` no soporta, **extender el genérico** con una opción nueva (sin romper a los demás) antes que duplicarlo.
- Los archivos de config que no tienen JSX van en `.js`; si exportan funciones que devuelven JSX (`renderGenreView`), `.jsx`.

## Componentes

- Funcionales, `const Nombre = (props) => ...` + `export default` (convención actual del repo), un componente por archivo, PascalCase.
- No hace falta `import React from 'react'` (nuevo JSX transform): quitarlo al tocar un archivo.
- Props desestructuradas con valores por defecto; no pasar 10 props sueltas si se puede pasar el objeto (`<MovieCard movie={movie} />`).
- Componentes de más de ~150 líneas o con varias responsabilidades (ej. `MovieFunctionsPanel.jsx`) → dividir en subcomponentes + hook.
- `PropTypes` ya no se validan en React 19: no agregarlos. Si se quiere documentar props, JSDoc (`/** @param {{ movie: Movie, onDelete?: (id: string) => Promise<void> }} props */`).
- Nada de manipular el DOM a mano ni `dangerouslySetInnerHTML`.

## Estado

- Mínimo y en el nivel más bajo que lo necesite. Lo que se puede calcular, se calcula en el render (ej. `movieCounts` en `GenreDashboard`), sin `useState` + `useEffect`.
- Actualizaciones que dependen del estado previo con callback: `setList((prev) => ...)`.
- Para cálculos caros sobre listas grandes, `useMemo`; no memoizar por reflejo.
- Estado global solo para la sesión (hoy `session.js`); no agregar Redux/Context para datos del servidor.

## Estilos

- Sin `style={{...}}`. Clases en `src/index.css` siguiendo la convención existente (`.bloque`, `.bloque__elemento`, `.bloque--modificador`) o utilidades/props de react-bootstrap.
- Clases condicionales con template string: `` className={`form-input ${error ? "form-input--error" : ""}`} ``.
- Reutilizar clases existentes antes de crear nuevas; agrupar las nuevas por sección en `index.css`.

## Ruteo y sesión

- Rutas declaradas solo en `App.jsx`; rutas protegidas con `<ProtectedRoute roles={[...]}>` (constantes de `src/auth/roles.js`: `ROLES`, `STAFF_ROLES`, `homePathFor`).
- Navegación con `<Link>`/`useNavigate`, nunca `window.location` para rutas internas. Al cerrarse la sesión no se navega a mano: `ProtectedRoute` lee `useSession()` y redirige solo.
- Sesión: JWT del backend. `session.js` guarda `{ token, expiresAt, userId, name, email, role }`, la cierra al vencer o ante un 401, y la publica con `subscribe`/`getSession`; los componentes la leen con `useSession()` (`src/hooks`), nunca con `localStorage`.
- `httpClient` recibe el token con `configureHttpClient` (lo llama `session.js`): `api/` no conoce `localStorage`. Los pedidos sin sesión que pueden dar 401 por credenciales (login, registro) van con `anonymous: true` para no cerrar la sesión.

## Errores y UX

- Cada pantalla muestra estado de carga (`.msg-loading`), vacío (`.msg-empty`) y error (`.msg-error`).
- `console.error` solo además de mostrar el error al usuario, nunca en su lugar. No dejar `console.log`.
- `request()` lanza un `Error` con el `detail` del ProblemDetails como mensaje y el código HTTP en `err.status`: para reaccionar a un caso puntual (ej. 409 butaca tomada → recargar el mapa) se mira `err.status`, nunca el texto.
- Confirmación antes de borrar (`confirmDeleteMessage`).
- Botones de submit deshabilitados mientras el formulario es inválido o se está enviando.

## Accesibilidad

- Cada input con `<label htmlFor>` o `Form.Label` de react-bootstrap con `controlId`.
- Botones con texto visible o `aria-label` (los íconos/emojis solos no alcanzan).
- `alt` descriptivo en imágenes (`MovieCard`).

## Nombres

- Componentes PascalCase; hooks `useAlgo`; funciones de api con verbo (`getAllMovies`, `addMovie`, `updateMovie`, `deleteMovie`); handlers `handleX` dentro del componente y props `onX`.
- Archivos de componente `.jsx`; utilidades y api `.js`.
