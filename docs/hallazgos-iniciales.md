# Hallazgos iniciales — CinemAPIFront

Revisión hecha sobre `main` al armar la configuración de Claude Code. Punto de partida para `/auditar-frontend`, que debe confirmar cada ítem, buscar más y corregir por lotes.

> Actualizado al instalar el kit en `refactor/buenas-practicas` (después de los commits de la sesión del backend `81dcd42`, `feec9d0`, `7a3739f`): `MovieCard.jsx` ya no importa `React`, así que lint marca 25 errores en lugar de 27, y la capa api ya lee ProblemDetails con `src/api/apiError.js`.

| # | Sev. | Dónde | Problema | Corrección |
|---|---|---|---|---|
| 0 | Alta | Proyecto | `npm run lint` falla con 25 errores: 24 `'React' is defined but never used` y 1 `setState` síncrono dentro de un efecto en `Showtimes/MovieFunctionsPanel.jsx:152` (`npm run build` sí pasa) | Quitar los `import React` sin uso y mover ese `setState` fuera del efecto (calcular en render o en el handler). Es el primer lote: la Definition of Done exige lint en verde |
| 1 | Alta | `src/api/<entidad>Api.js` (6 archivos) | `http://localhost:5288/api/...` hardcodeado en cada archivo; manejo de errores y headers distinto en cada uno | `src/api/httpClient.js` con `request()` (reutilizando `readApiError`) + `VITE_API_URL` en `.env.development` / `.env.example` |
| 2 | Alta | `hooks/useEntityCrud.js`, `hooks/useEntityList.js`, `Tickets/TicketCard.jsx` | `eslint-disable react-hooks/exhaustive-deps` | Declarar dependencias (las funciones de api son imports estables) y limpiar efectos con flag `ignore` |
| 3 | Media | `Users/UserDashboard.jsx`, `Tickets/TicketDashboard.jsx` | No usan `useEntityCrud`; repiten estado, carga y handlers a mano | Migrar a `useEntityCrud` (punto 4 del feedback) |
| 4 | Media | `Users/NewUser.jsx`, `Users/UserCard.jsx`, `Users/UserContainer.jsx`, `Tickets/NewTicket.jsx`, `Tickets/TicketCard.jsx`, `Tickets/TicketContainer.jsx`, `Movies/MovieCard.jsx` | No usan `EntityForm`/`EntityCard`/`EntityGrid` | Config de campos + genéricos; extender los genéricos si falta algo (ej. selects dependientes) |
| 5 | Media | `Showtimes/MovieFunctionsPanel.jsx` (394 líneas) | Componente con muchas responsabilidades y llamadas a la API en el componente | Hook `useMovieShowtimes` + subcomponentes |
| 6 | Media | `Tickets/NewTicket.jsx` | `getAllMovies().then(setMovies).catch(console.error)` dentro del componente | `useEntityList` |
| 7 | Media | Varios | Errores solo en `console.error` en algunos flujos | Mostrar mensaje al usuario (`.msg-error`) además de loguear |
| 8 | Baja | `auth/Login.jsx`, `pages/AdminPanel.jsx`, `pages/UserPanel.jsx` | 4 estilos inline restantes (`minHeight`, `width`, `padding`) | Clases en `index.css` (`.login-page`, `.login-card`, `.app-header--padded`) |
| 9 | Baja | Varios `.jsx` | `import React from 'react'` innecesario | Quitar (incluido en #0) |
| 10 | Baja | `App.jsx` | Comentarios en español (`// Admin pages (cada dashboard existente)`) | Quitar o pasar a inglés según la regla del profe |
| 11 | Media | Proyecto | Sin tests | Vitest + Testing Library (confirmar antes de instalar) |
| 12 | Baja | `README.md` | Es el README de la plantilla de Vite | README del proyecto: cómo correrlo, variables de entorno, estructura |

## Deuda conocida — requiere decisión (no corregir sin pedido)

- **Login de demo** (`auth/session.js`): credenciales en el código y sesión en `localStorage`. La materia todavía no vio autenticación.
- ~~**Formato de errores**~~: resuelto en `feec9d0` (el backend devuelve ProblemDetails y `apiError.js` lee `detail`/`errors`); falta que todas las funciones de api lo usen (ver #1).
- **`CinemapiPhone/`** (Expo) vive dentro de este repo: evaluar si corresponde un repo propio.
