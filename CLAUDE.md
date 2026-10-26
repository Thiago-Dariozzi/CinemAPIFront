# CLAUDE.md — CinemAPIFront (frontend web)

Interfaz web del sistema de gestión de cine. Consume la API del repo `CinemAPI`. Proyecto académico: el alcance lo marca la materia y el feedback del profesor (ver `CAMBIOS_FRONTEND.md`).
Las reglas detalladas viven en `.claude/skills/` y se cargan cuando el tema lo requiere.

## Stack real del repo

| Tema | Valor |
|---|---|
| Lenguaje | **JavaScript** (`.js` / `.jsx`), ES modules. No TypeScript |
| Framework | React 19 + Vite |
| UI | `react-bootstrap` + Bootstrap 5 + clases propias en `src/index.css` |
| Ruteo | `react-router-dom` 7 (`BrowserRouter` en `App.jsx`; rutas `/admin/*` y `/panel/*`) |
| Fechas | `date-fns`, `react-datepicker` |
| Datos | Funciones `fetch` en `src/api/<entidad>Api.js`; errores del backend (ProblemDetails) con `readApiError` de `src/api/apiError.js`; hooks `useEntityCrud` y `useEntityList` en `src/hooks` |
| Componentes genéricos | `EntityForm`, `EntityCard`, `EntityGrid`, `FieldInput`, `FieldBody` en `src/components/common` |
| Sesión | `src/auth/session.js` (login de demo con `localStorage`) |
| Lint | ESLint 10 (`eslint.config.js`, reglas de `react-hooks` y `react-refresh`) |
| Backend | `http://localhost:5288/api` en desarrollo |
| `CinemapiPhone/` | App móvil Expo separada, con su propio `AGENTS.md`. **No aplicar estas reglas ahí** ni tocarla salvo pedido explícito |

## Estructura y decisiones (feedback del profesor — no revertir)

```
src/
  api/          SOLO llamadas al backend (una por entidad). Sin JSX ni estado.
  components/
    common/     Componentes genéricos reutilizables (EntityForm, EntityCard, EntityGrid...)
    <Entidad>/  Dashboard, Card, Container, New<Entidad>, <entidad>Fields
    Layout/     AppLayout, Sidebar
  hooks/        Hooks reutilizables (useEntityCrud, useEntityList)
  pages/        Pantallas compuestas por rol (AdminPanel, UserPanel, UserCartelera...)
  auth/         Login, ProtectedRoute, session
  index.css     Estilos compartidos (clases BEM-like: .form-panel, .btn--primary, .entity-card...)
```

- **Sin estilos inline** (`style={{...}}`): todo con clases en `index.css` o utilidades de Bootstrap. Las pocas excepciones existentes no se multiplican.
- **Sin comentarios en español** en el código del front.
- **API separada de componentes**: los componentes nunca llaman a `fetch`.
- **Reutilizar los genéricos**: una entidad nueva usa `EntityForm` + `EntityCard` + `EntityGrid` + `useEntityCrud` con un archivo de configuración de campos, en lugar de copiar componentes.
- Identificadores en inglés; textos visibles para el usuario en español.
- Autenticación real: todavía no se vio en la materia. No implementarla sin pedido explícito.
- No migrar a TypeScript ni agregar librerías (TanStack Query, Redux, Tailwind, etc.) sin pedido explícito.

## Definition of Done

```bash
npm run lint      # sin errores ni warnings nuevos
npm run build
npm run test      # cuando exista Vitest
```

Y probar manualmente el flujo tocado con `npm run dev` contra el backend si está disponible.

## Cómo trabajar cada pedido

1. **Explorar:** leer el componente/hook/api relacionado y uno equivalente de otra entidad (`Genres/` es la referencia más limpia). Seguir el patrón del repo.
2. **Planificar** si toca más de ~3 archivos.
3. **Implementar** con la skill `react-cineapi`. Para un ABM nuevo: `/nueva-pantalla-crud`.
4. **Verificar:** Definition of Done.
5. **Revisar:** para cambios medianos/grandes, pedirle al subagente `revisor-frontend` que revise el diff.
6. **Reportar:** qué se hizo, qué se verificó, pendientes.

## Contrato con el backend

- La forma de los datos del backend se adapta **solo** en `src/api/*.js` (funciones `mapXFromBackend` / `mapXToBackend`). Los componentes trabajan con objetos ya mapeados.
- Si el backend cambia rutas, campos o formato de errores, actualizar la capa `api/` y nada más (idealmente).
- Si el repo del backend está accesible (`../CinemAPI` o `--add-dir`), verificar el controller y los DTOs reales antes de asumir la forma del JSON.

## Corrección de violaciones (regla del boy scout)

- Si en el código que tocás (o en el mismo archivo) hay una violación de estas reglas, **corregila en el mismo cambio** y mencionala.
- Fuera del alcance: no tocar; listar al final como **"Hallazgos fuera de alcance"** (archivo:línea · regla · sugerencia).
- No cambiar comportamiento visible (textos, rutas, flujo) sin avisar.
- Revisión completa: `/auditar-frontend`.

## Reglas de oro

- Componentes funcionales, chicos y con una responsabilidad. Lógica de datos en hooks; presentación en componentes.
- Reglas de hooks siempre. Nada de `eslint-disable` para `react-hooks/*` salvo con comentario `--` que explique por qué, y solo si no hay una solución correcta.
- No derivar estado con `useEffect` + `setState` si se puede calcular durante el render.
- `key` estable (el `id`), nunca el índice si la lista cambia.
- Errores de red mostrados al usuario con mensajes claros (`.msg-error`), no solo `console.error`.
- URL del backend centralizada (variable `VITE_API_URL`), nunca repetida en cada archivo.
- Accesibilidad básica: `label` asociado a cada input, botones con texto o `aria-label`, `alt` en imágenes.
- No agregar dependencias npm sin decir por qué y sin preguntar.
- Git: rama por tarea, commits chicos con Conventional Commits. No `git push` ni commits en `main` sin pedido explícito.
