export const computeErrors = (fields, form) => Object.fromEntries(
    fields.map((field) => [field.key, field.validate ? field.validate(form[field.key], form) : null])
);

export const invalidFieldLabels = (fields, errors) => fields.filter((field) => errors[field.key] != null).map((field) => field.label);
