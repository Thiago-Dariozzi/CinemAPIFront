# Cambios en el Frontend - Rama juan-feature

## Correcciones del feedback del profe (4 puntos)

---

### 1. Inline styles -> CSS classes (HECHO)

Se eliminaron TODOS los `style={{...}}` de los 19 archivos JSX y se reemplazaron por clases CSS definidas en `src/index.css`.

**Que se hizo:**
- Se agregaron ~200 lineas de clases CSS compartidas en `index.css`: `.form-panel`, `.form-input`, `.form-select`, `.btn--primary/save/cancel/delete`, `.entity-card`, `.entity-grid`, `.msg-error/success`, `.functions-panel`, `.status-pill`, etc.
- Se eliminaron las constantes JS de estilos (`inputStyle`, `selectArrow`, `baseInputStyle`, `labelStyle`, `fieldErrorStyle`) y las funciones (`inputStyleFor`, `selectStyleFor`, `styleFor`) de los componentes.
- Para estilos condicionales (ej: borde rojo en error) se usa className dinamico: `className={form-input ${error ? 'form-input--error' : ''}}`
- Solo quedaron 5 inline styles que son valores de layout unicos (flex: 1, width: 120px, minHeight: 100vh, width: 380px, padding header).

**Archivos modificados:** Todos los .jsx en components/, pages/ y auth/, mas index.css.

---

### 2. Comentarios en espanol (HECHO)

Se borraron TODOS los comentarios en espanol de los 20 archivos del frontend.

**Archivos modificados:** Todos los .jsx y .js del proyecto.

---

### 3. Estructura de carpetas (HECHO)

Se reorganizo la estructura separando API de componentes:

**ANTES:**
```
src/api/
  Dashboard.jsx          <- componente mezclado con APIs
  MoviesApi/             <- API + componentes juntos
    movieApi.js
    MovieCard.jsx
    MovieContainer.jsx
    NewMovie.jsx
  ScreensApi/            <- idem
  GenresApi/
  TicketsApi/
  ShowtimesApi/
  UsersApi/
```

**AHORA:**
```
src/
  api/                   <- SOLO archivos de llamadas al backend
    movieApi.js
    screenApi.js
    genreApi.js
    ticketApi.js
    showtimeApi.js
    userApi.js
  components/            <- TODOS los componentes React
    Movies/
      Dashboard.jsx
      MovieCard.jsx
      MovieContainer.jsx
      NewMovie.jsx
      NewMovieData.js
    Screens/
      ScreenDashboard.jsx
      ScreenCard.jsx
      ScreenContainer.jsx
      NewScreen.jsx
    Genres/
      GenreDashboard.jsx
      GenreCard.jsx
      GenreContainer.jsx
      NewGenre.jsx
    Tickets/
      TicketDashboard.jsx
      TicketCard.jsx
      TicketContainer.jsx
      NewTicket.jsx
      NewTicket.data.js
    Showtimes/
      MovieFunctionsPanel.jsx
    Users/
      UserDashboard.jsx
      UserCard.jsx
      UserContainer.jsx
      NewUser.jsx
      NewUser.data.js
  auth/                  <- sin cambios
  pages/                 <- sin cambios
```

**IMPORTANTE:** Todos los imports fueron actualizados en todos los archivos (incluyendo session.js, AdminPanel, UserPanel, etc).

---

### 4. Abstraer componentes reutilizables (PENDIENTE - PARA THIAGO)

Este punto no se hizo. La idea es reducir la repeticion de codigo entre entidades.

**Que hay repetido:**

1. **Formularios de alta** (`NewMovie`, `NewScreen`, `NewGenre`) son casi identicos:
   - Mismo wrapper `.form-panel`
   - Mismo patron de validacion (validate -> touched -> errors)
   - Mismo boton submit con estado disabled
   - Solo cambian los campos
   - **Solucion:** Crear un componente generico `EntityForm` que reciba un array de campos como config

2. **Cards de entidad** (`ScreenCard`, `GenreCard`) son casi identicas:
   - Mismo wrapper `.entity-card`
   - Mismo modo edicion inline con inputs
   - Mismos botones Editar/Eliminar/Guardar/Cancelar
   - Solo cambian los campos que muestran
   - **Solucion:** Crear un componente generico `EntityCard` que reciba config de campos

3. **Containers** (`ScreenContainer`, `GenreContainer`, `MovieContainer`) son identicos:
   - Solo hacen `.map()` sobre un array y renderizan cards en un grid
   - **Solucion:** Crear un `EntityGrid` generico

4. **Dashboards** (`Dashboard`, `ScreenDashboard`, `GenreDashboard`) comparten patron:
   - useState para lista + loading + error + success
   - useEffect para cargar datos
   - Handlers para CRUD
   - **Solucion:** Podria ser un custom hook `useEntityCrud(apiFunctions)`

**Ejemplo de como quedaria un EntityCard:**
```jsx
const EntityCard = ({ fields, data, onEdit, onDelete }) => {
  // fields = [{ key: 'name', label: 'Nombre', type: 'text' }, ...]
  // Renderiza automaticamente la vista y el modo edicion
};
```

**Prioridad:** Baja. Los otros 3 puntos ya estan hechos y son los mas visibles. Si preguntan en la defensa, explicar que se identifico la repeticion y que la mejora seria abstraer componentes genericos.

---

## Cosas que faltan pushear

Todo esta en la rama `juan-feature`. Hay que:

1. `git add .`
2. `git commit -m "Correciones feedback profe: CSS classes, estructura carpetas, sin comentarios"`
3. `git push origin juan-feature`
4. Crear PR a main
