import React, { useState } from 'react';
import { computeErrors } from './fieldValidation';
import FieldBody from './FieldBody';

// Card con toggle view/edit genérico: view usa renderView (JSX propio de cada entidad),
// edit usa fields (el mismo config que EntityForm) para los inputs.
const EntityCard = ({
    id,
    values,
    fields,
    payloadExtra = {},
    viewExtra = {},
    renderView,
    confirmDeleteMessage,
    onEdit,
    onDelete,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(values);
    const [touched, setTouched] = useState({});
    const [saveError, setSaveError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const errors = computeErrors(fields, form);
    const isFormValid = Object.values(errors).every((e) => e == null);

    const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
    const handleBlur = (key) => setTouched((prev) => ({ ...prev, [key]: true }));

    const startEditing = () => {
        setForm(values);
        setTouched({});
        setSaveError(null);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setSaveError(null);
    };

    const handleSave = async () => {
        setSaveError(null);

        if (!isFormValid) {
            setTouched(Object.fromEntries(fields.map((f) => [f.key, true])));
            return;
        }

        try {
            await onEdit(id, { ...form, ...payloadExtra, id });
            setIsEditing(false);
        } catch (err) {
            setSaveError(err?.message || "Error al actualizar");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(confirmDeleteMessage)) return;

        setDeleteError(null);
        try {
            await onDelete(id);
        } catch (err) {
            setDeleteError(err?.message || "Error al eliminar");
        }
    };

    const fieldProps = (field) => ({
        field,
        value: form[field.key],
        touched: touched[field.key],
        error: errors[field.key],
        onChange: handleChange,
        onBlur: handleBlur,
        compact: true,
    });

    if (isEditing) {
        return (
            <div className="entity-card">
                {saveError && <p className="msg-inline-error--sm">{saveError}</p>}

                {fields.map((field) => (
                    <div key={field.key}>
                        <FieldBody {...fieldProps(field)} />
                    </div>
                ))}

                <button
                    onClick={handleSave}
                    disabled={!isFormValid}
                    className={`btn ${isFormValid ? 'btn--save' : 'btn--disabled'} btn-group`}
                >
                    Guardar
                </button>
                <button onClick={cancelEditing} className="btn btn--cancel btn-group">
                    Cancelar
                </button>
            </div>
        );
    }

    return (
        <div className="entity-card">
            {renderView({ ...values, ...viewExtra })}

            {deleteError && <p className="msg-inline-error--sm">{deleteError}</p>}

            {onEdit && (
                <button onClick={startEditing} className="btn btn--primary btn-group">
                    Editar
                </button>
            )}

            {onDelete && (
                <button onClick={handleDelete} className="btn btn--delete btn-group">
                    Eliminar
                </button>
            )}
        </div>
    );
};

export default EntityCard;
