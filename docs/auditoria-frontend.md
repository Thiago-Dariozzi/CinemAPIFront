# Auditoría — CinemAPIFront

Rama `refactor/buenas-practicas` (desde `8009c87`). Alcance: `src/`. `CinemapiPhone/` no se auditó.
Contrato verificado contra `../CinemAPI` (rama `refactor/buenas-practicas`, `735439f`): controllers, DTOs de `Application/DTOs`, `GlobalExceptionHandler` y CORS.

## Línea de base

| Comando | Resultado |
|---|---|
| `npm run lint` | ❌ 25 errores: 24 `'React' is defined but never used` + 1 `react-hooks/set-state-in-effect` (`MovieFunctionsPanel.jsx:152`) |
| `npm run build` | ✅ (JS 472 kB / gzip 137 kB) |
| `npm run test` | No existe (sin Vitest) |

## Contrato con el backend

| Endpoint / DTO | Front | Estado |
|---|---|---|
| Rutas de los 6 controllers | `src/api/*.js` | ✅ Coinciden (incluye `GET /showtime/screen/{id}?date=` con `DateOnly`) |
| Bodies de POST/PUT | `mapXToBackend` | ✅ Sin `id`/`isActive`; PUT de usuario sin `password` (ya corregido en `81dcd42`) |
| Errores: ProblemDetails (`detail`, `errors` en 400 de validación) | `apiError.js` | ⚠️ Solo lo usan `genreApi`, `showtimeApi.addShowtime` y `movieApi.deleteMovie`; el resto descarta el mensaje (#4) |
| `CreateMovieRequest.ReleaseDate` (`DateTime`, no nulo) | El alta no tiene campo de fecha | ⚠️ Se guarda `0001-01-01` (#16) |
| `GET /movie/active` (solo en cartelera, backend #52) | `getActiveMovies` existe pero no se usa | ⚠️ La cartelera del usuario muestra también las que están fuera de cartelera (#15) |
| CORS `http://localhost:5173`, API `http://localhost:5288` | URL repetida en 6 archivos | ⚠️ (#3) |

## Hallazgos

Severidad: **Crítica** (bug visible, seguridad) · **Alta** (estructura del profe, reglas de hooks, pérdida de datos) · **Media** (duplicación, UX, mantenibilidad) · **Baja** (estilo).
`Hi` = ítem de `docs/hallazgos-iniciales.md`.

| # | Sev. | Archivo:línea | Regla | Problema | Corrección propuesta | ¿Cambia lo visible? | Lote |
|---|---|---|---|---|---|---|---|
| 1 | Crítica | `Tickets/TicketDashboard.jsx:79` | Bug | **Nuevo.** No le pasa `movies` ni `screens` a `TicketContainer` (regresión de `f70ac17`): todas las cards muestran "(eliminado)" en película y sala, y en edición los selects de película/sala quedan vacíos | Cargar películas y salas con `useEntityList` en el dashboard y pasarlas | Sí: vuelve a mostrar los nombres (arreglo) | 2 |
| 2 | Alta | 24 archivos + `MovieFunctionsPanel.jsx:152` | DoD | H0/H9 confirmado (25 errores, no 27: `MovieCard` ya se corrigió) | Quitar `import React`; calcular `occupied` vacío en render en vez de `setOccupied([])` en el efecto | No | 1 |
| 3 | Alta | `api/{genre,movie,screen,showtime,ticket,user}Api.js:1-3` | URL centralizada | H1 confirmado: `http://localhost:5288/api/...` en 6 archivos; headers y parseo distintos en cada uno; sin `.env.example` | `api/httpClient.js` (`request()` + `readApiError`) + `VITE_API_URL` en `.env.development` y `.env.example` | No | 3 |
| 4 | Alta | `api/movieApi.js:18-50`, `api/screenApi.js` (todo), `api/ticketApi.js` (todo), `api/userApi.js` (todo), `api/showtimeApi.js:58`, `hooks/useEntityCrud.js:43,61,74` | Errores claros | **Nuevo.** Se descarta el mensaje del backend: la api tira textos genéricos y además `useEntityCrud` reemplaza `err.message` por `messages.addError`. Ej.: email duplicado (409), validaciones (400) o sala inexistente llegan como "Error al agregar el usuario". `deleteMovie` muestra "(status 409)" | Todas las funciones vía `request()`; el hook muestra `err.message` y usa `messages.*` solo como respaldo | Sí: los errores muestran el texto del backend | 3–4 |
| 5 | Alta | `hooks/useEntityCrud.js:32`, `hooks/useEntityList.js:20`, `Tickets/TicketCard.jsx:54` | Reglas de hooks | H2 confirmado. Además `useEntityCrud.js:30` justifica el `eslint-disable` en español | Dependencias declaradas + flag `ignore`; `refetch` con `useCallback` | No | 4 |
| 6 | Alta | `Showtimes/MovieFunctionsPanel.jsx:150-170` | Limpieza de efectos | **Nuevo.** La consulta de ocupación no se cancela: si se cambia de sala/fecha rápido puede quedar la ocupación de la consulta anterior y la validación de solapamiento usa datos de otra sala | Flag `ignore` (dentro del hook `useMovieShowtimes`) | No | 4 |
| 7 | Alta | `Screens/NewScreen.jsx:13-19`, `Movies/NewMovie.jsx:18-24`, `Tickets/NewTicket.jsx:63-67`, `Users/NewUser.jsx:16-20` | UX / pérdida de datos | **Nuevo.** Si el alta falla, el formulario se limpia igual: `NewScreen`/`NewMovie` tragan el error y `EntityForm` cree que salió bien; `NewTicket`/`NewUser` resetean sin esperar la respuesta | Propagar el error a `EntityForm` (que ya lo muestra) y resetear solo si salió bien | Sí: los datos quedan cargados y el error aparece en el formulario | 4 (Screens/Movies), 6–7 (Users/Tickets) |
| 8 | Alta | `Movies/MovieCard.jsx:35-39,135-137`, `Tickets/TicketCard.jsx:81-84`, `Users/UserCard.jsx:22-25` | UX / promesas | **Nuevo.** La edición se cierra antes de saber si se guardó y la promesa rechazada queda sin `catch` (*unhandled rejection*); `MovieCard` edita sin validar | Resuelto por `EntityCard` (espera, muestra el error, valida) | Sí: si falla, la card sigue en edición con el error | 6–8 |
| 9 | Alta | `Users/UserDashboard.jsx`, `Tickets/TicketDashboard.jsx` | Genéricos (punto 4 del profe) | H3 confirmado | `useEntityCrud` | No | 6–7 |
| 10 | Alta | `Users/{NewUser,UserCard,UserContainer}.jsx`, `Tickets/{NewTicket,TicketCard,TicketContainer}.jsx`, `Movies/MovieCard.jsx` | Genéricos (punto 4 del profe) | H4 confirmado. Users y Tickets usan `Card`/`Form` de Bootstrap, con otro aspecto que el resto | `<entidad>Fields.js` + `EntityForm`/`EntityCard`/`EntityGrid`. Para Tickets hay que extender los genéricos: opciones que dependen de otro campo (horarios según película) y `onFieldChange` para completar sala/fecha/precio | Sí: Users y Tickets pasan al estilo de las otras pantallas (mismos campos y textos) | 6–8 |
| 11 | Media | `Showtimes/MovieFunctionsPanel.jsx` (394 líneas) | Tamaño / api en componente | H5 confirmado. **Además:** cada `MovieCard` del admin monta un panel que pide `getAllScreens` + `getAllMovies` + funciones: **3 requests por película** (N+1) | Hook `useMovieShowtimes`; salas y películas las carga `Dashboard` una vez y se pasan por props; subcomponentes `ShowtimeList` y `ShowtimeForm` | No | 8 |
| 12 | Media | `Tickets/NewTicket.jsx:17-22`, `Tickets/TicketCard.jsx:29-55` | Datos vía hooks | H6 confirmado; `TicketCard` también hace fetch en un efecto | `useEntityList` / hook de horarios por película | No | 7 |
| 13 | Media | `hooks/useEntityList.js:13`, `MovieFunctionsPanel.jsx:129,139,162`, `NewTicket.jsx:41`, `TicketDashboard.jsx:35` | Errores visibles | H7 confirmado. El peor caso: si falla la consulta de ocupación, el panel dice **"Sala libre ese día"** | `useEntityList` devuelve `{ list, error }`; mostrar `.msg-inline-error` | Sí: aparece un mensaje de error donde antes no había nada | 4, 8 |
| 14 | Media | `Tickets/TicketCard.jsx:195`, `Users/UserCard.jsx:78` | Confirmación al borrar | **Nuevo.** Borran sin confirmar | `confirmDeleteMessage` de `EntityCard` | Sí: aparece el `confirm` | 6–7 |
| 15 | Media | `pages/UserCartelera.jsx:14`, `Movies/Dashboard.jsx:11` | Contrato | **Nuevo** (pendiente del backend #52). La cartelera del usuario usa `getAllMovies`: muestra también las películas "Fuera de cartelera" | Prop `fetchAll` en `Dashboard`; la cartelera usa `getActiveMovies` | **Sí — requiere decisión (D1)** | 5 |
| 16 | Media | `Movies/NewMovieData.js`, `api/movieApi.js:11` | Contrato | **Nuevo.** El alta no manda `releaseDate` y el backend guarda `0001-01-01` | Campo "Fecha de estreno" en el alta (o que el backend lo haga opcional) | **Sí — requiere decisión (D2)** | 8 |
| 17 | Media | `Layout/AppLayout.jsx:9` + `<main className="dashboard">` en cada dashboard | HTML / accesibilidad | **Nuevo.** `<main>` anidado dentro de `<main>` | Los dashboards usan `<section>` | No | 9 |
| 18 | Media | `Tickets/TicketDashboard.jsx:77`, `Users/UserDashboard.jsx:61`, `auth/Login.jsx:34` | Estados de carga/vacío/error | **Nuevo.** Sin mensaje de lista vacía; errores con `text-danger` en vez de `.msg-error` | Clases compartidas `.msg-*` | Sí: mensaje "No hay … cargados" | 6–7, 10 |
| 19 | Media | `pages/AdminPanel.jsx`, `pages/UserPanel.jsx` | Código muerto | **Nuevo.** No los importa nadie (los reemplazaron `AppLayout` + `Sidebar`); tienen 2 de los estilos inline y montan todos los dashboards juntos | Borrarlos | No (no son alcanzables) — **confirmar (D4)** | 9 |
| 20 | Media | `App.jsx:42` | Ruteo | **Nuevo.** `/panel` no exige rol: un admin que entra a `/panel/mis-tickets` ve **todos** los tickets bajo "Mis Tickets" (`userId` nulo) | `ProtectedRoute role="Client"` | **Sí — requiere decisión (D3)** | 9 |
| 21 | Media | Proyecto | Tests | H11 confirmado | Vitest + Testing Library | **Instala dependencias — requiere OK (D5)** | 11 |
| 22 | Baja | `auth/Login.jsx:29-30` (+ `AdminPanel.jsx:22`, `UserPanel.jsx:24`) | Sin estilos inline | H8 confirmado | `.login-page`, `.login-card` en `index.css` | No | 9 |
| 23 | Baja | `App.jsx:8,15,31,41`, `MovieFunctionsPanel.jsx:109-110`, `NewTicket.jsx:16`, `TicketDashboard.jsx:29`, `useEntityCrud.js:30` | Sin comentarios en español | H10 confirmado; hay 5 archivos más (incluye "EN DUDA !!! Preguntar al profe") | Quitar | No | 1 (boy scout en los archivos de lint) |
| 24 | Baja | `common/FieldBody.jsx:4`, `common/FieldInput.jsx:37`, `MovieCard.jsx:45-62`, `MovieFunctionsPanel.jsx:300-359`, `Form.Group` sin `controlId` en Tickets/Users/Login | Accesibilidad | **Nuevo.** Los `label` no están asociados al input (todos los formularios genéricos incluidos) | `htmlFor`/`id` en `FieldBody`/`FieldInput` (con prefijo único por formulario), `controlId` en Bootstrap | No | 10 |
| 25 | Baja | `api/showtimeApi.js:61-68` | api solo backend | **Nuevo.** `formatShowtime` (presentación) vive en la capa api | Mover a `src/utils/formatShowtime.js` | No | 3 |
| 26 | Baja | `api/ticketApi.js:13-27`, `:80` | Duplicación | **Nuevo.** `mapTicketToBackendForCreate` y `ForUpdate` son iguales; `updateTicket` devuelve campos de UI (`showtimeId`) | Un único `mapTicketToBackend`; devolver solo lo mapeado | No | 3 |
| 27 | Baja | `api/userApi.js:43` | Robustez | **Nuevo.** Email en la ruta sin `encodeURIComponent` | Encodear | No | 3 |
| 28 | Baja | `index.css:299` | Estilos | **Nuevo.** La clase propia `.form-select` pisa la de Bootstrap que usa `Form.Select` | Desaparece al migrar Users/Tickets a los genéricos; si no, renombrar | No | 6–7 |
| 29 | Baja | `eslint.config.js:8` | Config | **Nuevo.** `eslint .` también analiza `CinemapiPhone/` (React Native) con globals de navegador | Agregar `CinemapiPhone` a `globalIgnores` (es config del front, no se toca la app) | No | 12 |
| 30 | Baja | `README.md` | Docs | H12 confirmado | README del proyecto | No | 12 |

### Deuda conocida — requiere decisión (no se toca)

- **Login de demo** (`auth/session.js`): credenciales en el código y en el texto de ayuda del login, sesión en `localStorage`. Además, si `getUserByEmail` falla por **cualquier** motivo (incluido backend caído) intenta crear el usuario demo.
- **`CinemapiPhone/`** vive dentro de este repo: evaluar repo propio.
- ~~Formato de errores~~: el backend ya devuelve ProblemDetails; lo que falta es #3/#4.

## Decisiones pendientes

| | Pregunta | Recomendación |
|---|---|---|
| D1 | ¿La cartelera del usuario muestra solo las películas "En cartelera" (`GET /movie/active`)? | Sí (es lo que pidió el backend #52) |
| D2 | ¿Agrego "Fecha de estreno" al alta de película? | Sí, opcional en el form y con hoy por defecto; si no, hacerla opcional en el backend |
| D3 | ¿`/panel` solo para clientes (el admin que entra a `/panel` vuelve a `/login`)? | Sí |
| D4 | ¿Borro `pages/AdminPanel.jsx` y `pages/UserPanel.jsx`? | Sí, son código muerto |
| D5 | ¿Instalo Vitest + Testing Library (`vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`, solo dev)? | Sí, antes de migrar Users/Tickets/Movies para tener red de seguridad |
| D6 | ¿Los errores muestran el texto del backend (ej. "Ya existe un usuario con ese email") en lugar del genérico? | Sí (lo pide la skill `react-cineapi`) |

## Plan de lotes

Cada lote: `npm run lint` + `npm run build` (+ `npm run test -- --run` desde el lote de tests) y commit con Conventional Commits.

| Lote | Contenido | Ítems | Cambia lo visible | Estado |
|---|---|---|---|---|
| 1 | Lint en verde sin desactivar reglas + comentarios en español de los archivos tocados | 2, 23 | No | ⏳ |
| 2 | Tickets: nombres de película/sala (bug crítico) | 1 | Sí (arreglo) | ⏳ |
| 3 | Capa api: `httpClient` + `VITE_API_URL` + `.env.example`; errores del backend; `formatShowtime` a utils | 3, 4, 25, 26, 27 | Textos de error (D6) | ⏳ |
| 4 | Hooks: dependencias sin `eslint-disable`, limpieza de efectos, `useEntityList` con error, el hook propaga el mensaje; altas de Screens/Movies que pierden datos | 4, 5, 6, 7, 13 | Errores visibles (D6) | ⏳ |
| 5 | Cartelera con `getActiveMovies` | 15 | Sí (D1) | ⏳ |
| 11 → antes del 6 | Vitest + tests de `fieldValidation`, `EntityForm`, `EntityCard`, `useEntityCrud`, `httpClient` | 21 | No (D5) | ⏳ |
| 6 | Users → genéricos + `useEntityCrud` | 7–10, 14, 18, 28 | Estilo de Users + confirm al borrar | ⏳ |
| 7 | Tickets → genéricos (extender `EntityForm`/`EntityCard` con opciones dependientes y `onFieldChange`) | 7–10, 12, 14, 18 | Estilo de Tickets + confirm al borrar | ⏳ |
| 8 | Movies: `MovieCard` → `EntityCard`; `MovieFunctionsPanel` → `useMovieShowtimes` + subcomponentes, sin N+1; fecha de estreno | 8, 10, 11, 13, 16 | D2 | ⏳ |
| 9 | Estilos y estructura: `Login` sin inline, `<main>` anidado, páginas muertas, rol de `/panel` | 17, 19, 20, 22 | D3, D4 | ⏳ |
| 10 | Accesibilidad (labels asociados) y estados de carga/vacío/error restantes | 18, 24 | No | ⏳ |
| 12 | README + `globalIgnores` de `CinemapiPhone` en ESLint | 29, 30 | No | ⏳ |

Si D5 es "no", el lote de tests se saltea y los lotes 6–8 se verifican solo con lint, build y prueba manual.
