---
name: testing-react
description: Cómo testear el front de CinemAPI con Vitest y React Testing Library (configuración, hooks, componentes genéricos, capa api). Usar al crear o modificar tests del front, al corregir un bug de UI o al agregar comportamiento nuevo.
---

# Tests del frontend

## Setup (solo si todavía no existe — pedir confirmación antes de instalar)

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: "./src/test/setup.js", globals: true },
});
```

```js
// src/test/setup.js
import "@testing-library/jest-dom/vitest";
```

`package.json` → `"test": "vitest"`. En ESLint, agregar `globals.vitest` (o importar `describe/it/expect` de `vitest`) para los archivos `*.test.{js,jsx}`.

## Qué testear primero

1. `src/components/common/fieldValidation.js` y las `validate` de cada `<entidad>Fields.js` (funciones puras, fáciles).
2. `EntityForm`: no envía si es inválido, muestra errores al hacer blur, llama a `onSubmit` con el payload (`coerce`, `omitIfEmpty`), muestra el error que devuelve `onSubmit`.
3. `EntityCard`: modo edición, cancelar, confirmar borrado.
4. `useEntityCrud`: carga inicial, alta/edición/baja actualizan la lista, mensajes de error.
5. `api/httpClient.js`: arma la URL, lee `detail` de ProblemDetails, maneja 204.

## Convenciones

- Archivo al lado del código: `EntityForm.test.jsx`.
- Consultar como lo haría el usuario: `getByRole("button", { name: /guardar/i })`, `getByLabelText("Nombre")`. Evitar `container.querySelector` y test ids.
- Interacciones con `userEvent` (`const user = userEvent.setup(); await user.type(...)`).
- Mockear la red en el borde: `vi.spyOn(globalThis, "fetch")` para la capa api; para componentes/hook, pasar funciones falsas (`vi.fn().mockResolvedValue([...])`) en lugar de mockear módulos.
- Un comportamiento por test, nombres en español que describan el comportamiento: `it("no envía el formulario si el nombre está vacío", ...)`.

```jsx
it("muestra el error del backend cuando el alta falla", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error("Ya existe un género equivalente"));
    render(<EntityForm title="Nuevo" fields={genreFields} initialValues={{ name: "" }} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/nombre/i), "Acción");
    await user.click(screen.getByRole("button", { name: /guardar/i }));

    expect(await screen.findByText("Ya existe un género equivalente")).toBeInTheDocument();
});
```

## Regla

Con Vitest instalado, `npm run test -- --run` en verde es parte de la Definition of Done. No borrar ni saltear tests para que pasen.
