---
name: auditar-frontend
description: Audita CinemAPIFront contra las buenas prácticas del proyecto (React, capa api, genéricos, estilos, hooks, accesibilidad, tests), genera un reporte con severidades y corrige por lotes verificando lint y build. Invocar con /auditar-frontend [ruta o tema opcional].
disable-model-invocation: true
argument-hint: "[ruta | api | hooks | components | styles | tests]"
---

# /auditar-frontend

Alcance: `$ARGUMENTS` (si está vacío, todo `src/`). Nunca auditar ni tocar `CinemapiPhone/`.

## 1. Línea de base

1. `git status` limpio; si no, avisar y parar. Si estás en `main`, crear la rama `refactor/buenas-practicas` (o usarla si ya existe; la sesión del backend puede haberla creado).
2. `npm install` si falta `node_modules`; correr `npm run lint` y `npm run build` y guardar resultado (cantidad de errores/warnings).
3. Leer `CLAUDE.md`, `CAMBIOS_FRONTEND.md`, `docs/hallazgos-iniciales.md` (si existe) y las skills `react-cineapi` y `testing-react`.

## 2. Revisión

Recorrer cada archivo del alcance y chequear, como mínimo (usar `Grep` en todo el alcance para cada patrón):

- **Capa api:** URLs hardcodeadas (`localhost`), `fetch` fuera de `src/api`, manejo de errores inconsistente, campos de más en el body (`id`, `isActive`), lectura de errores que no soporta ProblemDetails.
- **Hooks:** `eslint-disable` de `react-hooks/*`, efectos que derivan estado, fetch en `useEffect` dentro de componentes, falta de cancelación/limpieza.
- **Reutilización (punto 4 del profe):** entidades que no usan `EntityForm`/`EntityCard`/`EntityGrid`/`useEntityCrud` (revisar `Users/`, `Tickets/`, `Showtimes/`), componentes duplicados, componentes de más de ~150 líneas.
- **Estilos:** `style={{` (inline), clases duplicadas en `index.css`.
- **Comentarios:** comentarios en español (regla del profe), código comentado, `console.log`.
- **React:** `import React` innecesario, keys con índice, props excesivas, `window.location` para rutas internas.
- **UX/errores:** pantallas sin estado de carga/vacío/error, errores solo en consola, borrado sin confirmación.
- **Accesibilidad:** inputs sin label asociado, botones solo con emoji, imágenes sin `alt`.
- **Seguridad:** credenciales en el código (`session.js` — deuda conocida, solo reportar).
- **Tests:** existencia de Vitest y de tests para genéricos y validaciones.

## 3. Reporte

Escribir/actualizar `docs/auditoria-frontend.md`:

| # | Severidad | Archivo:línea | Regla | Problema | Corrección propuesta | ¿Cambia comportamiento visible? |
|---|---|---|---|---|---|---|

Severidades: **Crítica** (bug, seguridad), **Alta** (viola la estructura acordada con el profe o rompe reglas de hooks), **Media** (duplicación, UX, mantenibilidad), **Baja** (estilo).

Lotes sugeridos, en orden:
1. Cliente HTTP compartido + `VITE_API_URL` + `.env.example` (sin cambiar comportamiento).
2. Hooks sin `eslint-disable` (dependencias correctas, limpieza de efectos).
3. Migrar `Users/`, `Tickets/` y `Showtimes/` a los genéricos / hooks (un lote por entidad).
4. Estilos inline restantes → clases; limpieza de `import React`, `console.log`, comentarios en español.
5. Accesibilidad y estados de carga/vacío/error.
6. Vitest + tests de genéricos y validaciones (**requiere confirmar instalación de dependencias**).

Mostrar el resumen y **esperar confirmación** antes de corregir, salvo que el usuario haya pedido corregir directamente.

## 4. Corrección por lotes

Por cada lote:
1. Aplicar solo los cambios del lote.
2. `npm run lint` y `npm run build` en verde (y `npm run test -- --run` si existe).
3. Si se tocó una pantalla, describir cómo probarla a mano (ruta y pasos).
4. Commit `refactor(<área>): <qué>`.
5. Marcar ✅ en el reporte.

Reglas: no cambiar textos, rutas ni flujo visible sin avisar; no agregar dependencias sin preguntar; si un cambio depende del backend (ej. ProblemDetails), coordinarlo (leer `../CinemAPI` si está disponible) y dejar la capa api compatible con ambos formatos mientras tanto.

## 5. Cierre

Resumen: lotes aplicados, commits, pendientes con motivo, y qué conviene revisar a mano en el navegador.
