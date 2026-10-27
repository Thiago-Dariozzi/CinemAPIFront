import { useState } from 'react';
import { computeErrors } from './fieldValidation';
import FieldBody from './FieldBody';
const EntityCard = ({
    id,
    values,
    fields,
    payloadExtra = {},
    viewExtra = {},
    renderView,
    confirmDeleteMessage,
    deleteLabel = "Eliminar",
    restoreLabel = "Reactivar",
    onEdit,
    onDelete,
    onRestore,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(values);
    const [touched, setTouched] = useState({});
    const [saveError, setSaveError] = useState(null);
    const [actionError, setActionError] = useState(null);
    const [isBusy, setIsBusy] = useState(false);

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

    const runAction = async (action, fallbackMessage) => {
        setActionError(null);
        setIsBusy(true);
        try {
            await action(id);
        } catch (err) {
            setActionError(err?.message || fallbackMessage);
        } finally {
            setIsBusy(false);
        }
    };

    const handleDelete = () => {
        if (!window.confirm(confirmDeleteMessage)) return;
        runAction(onDelete, "Error al eliminar");
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

            {actionError && <p className="msg-inline-error--sm">{actionError}</p>}

            {onEdit && (
                <button onClick={startEditing} className="btn btn--primary btn-group">
                    Editar
                </button>
            )}

            {onDelete && (
                <button onClick={handleDelete} disabled={isBusy} className="btn btn--delete btn-group">
                    {deleteLabel}
                </button>
            )}

            {onRestore && (
                <button onClick={() => runAction(onRestore, "Error al reactivar")} disabled={isBusy} className="btn btn--save btn-group">
                    {restoreLabel}
                </button>
            )}
        </div>
    );

};

export default EntityCard;
