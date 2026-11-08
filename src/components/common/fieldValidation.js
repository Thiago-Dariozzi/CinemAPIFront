// Runs each field validator and returns errors by key
export const computeErrors = (fields, form) => Object.fromEntries(
    fields.map((field) => [field.key, field.validate ? field.validate(form[field.key], form) : null])
);
