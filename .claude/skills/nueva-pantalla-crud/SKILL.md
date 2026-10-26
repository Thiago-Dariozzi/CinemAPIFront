---
name: nueva-pantalla-crud
description: Crea el ABM (alta, listado, edición, baja) de una entidad en CinemAPIFront usando la capa api, useEntityCrud y los componentes genéricos EntityForm/EntityCard/EntityGrid. Usar cuando se pida una pantalla o sección nueva para una entidad del backend, o invocar con /nueva-pantalla-crud <Entidad>.
argument-hint: "<Entidad> [campos]  (ej. Fee name percentageRate fixedAmount)"
---

# /nueva-pantalla-crud

Pedido: `$ARGUMENTS`

Referencia: `src/components/Genres/` (la implementación más limpia). Respetar la skill `react-cineapi`.

## Antes de empezar

- Confirmar la forma real del JSON: si el backend está accesible (`../CinemAPI`), leer el controller y los DTOs de la entidad; si no, preguntar o usar lo indicado en el pedido.
- Confirmar en qué menú/rol va (admin `/admin/...` o usuario `/panel/...`).

## Pasos

1. **`src/api/<entidad>Api.js`**: `getAll<Plural>`, `add<Entidad>`, `update<Entidad>`, `delete<Entidad>` usando `request` de `httpClient.js` (si todavía no existe, usar el patrón actual del repo y anotar el pendiente). Mapear campos solo si el backend difiere de la UI.
2. **`src/components/<Plural>/<entidad>Fields.js(x)`**: config de campos con `label` en español, `validate`, `coerce` para números, `group` para filas; `confirmDeleteMessage`; `render<Entidad>View` si la card muestra algo especial.
3. **`New<Entidad>.jsx`** con `EntityForm`.
4. **`<Entidad>Card.jsx`** con `EntityCard`.
5. **`<Entidad>Container.jsx`** con `EntityGrid`.
6. **`<Entidad>Dashboard.jsx`** con `useEntityCrud` y mensajes en español; estados de carga, vacío y error con las clases existentes.
7. **Ruta** en `App.jsx` dentro del bloque del rol correspondiente y **link** en `Layout/Sidebar.jsx`.
8. **Estilos**: solo clases existentes de `index.css`; si hace falta una nueva, agregarla en la sección correspondiente. Nada inline.
9. **Tests** (si Vitest está instalado): validaciones de los campos y alta/baja del dashboard con funciones falsas.
10. **Verificar**: `npm run lint`, `npm run build` (+ tests). Indicar ruta y pasos para probar a mano.

## Reporte

Archivos creados, ruta nueva, endpoints que consume y cualquier diferencia encontrada con el backend.
