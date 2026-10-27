import { useState } from 'react';
import EntityForm from '../components/common/EntityForm';
import { changePassword, updateProfile } from '../api/authApi';
import { changePasswordFields, profileFields } from '../auth/authFields';
import { ROLE_LABELS } from '../auth/roles';
import { updateSessionName } from '../auth/session';
import { useSession } from '../hooks/useSession';

const emptyPasswordForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

const Profile = () => {
    const session = useSession();
    const [success, setSuccess] = useState(null);

    const handleUpdateProfile = async (profile) => {
        setSuccess(null);
        await updateProfile(profile);
        updateSessionName(profile.name.trim());
        setSuccess("Tus datos se actualizaron.");
    };

    const handleChangePassword = async (passwords) => {
        setSuccess(null);
        await changePassword(passwords);
        setSuccess("La contraseña se cambió correctamente.");
    };

    return (
        <section className="dashboard">
            <h1 className="section-title">👤 Mi perfil</h1>

            <p className="profile-summary">
                <strong>{session.email}</strong> · {ROLE_LABELS[session.role] ?? session.role}
            </p>

            {success && <p className="msg-success">{success}</p>}

            <EntityForm
                title="Mis datos"
                submitLabel="Guardar cambios"
                fields={profileFields}
                initialValues={{ name: session.name }}
                resetOnSuccess={false}
                onSubmit={handleUpdateProfile}
            />

            <EntityForm
                title="Cambiar contraseña"
                submitLabel="Cambiar contraseña"
                fields={changePasswordFields}
                initialValues={emptyPasswordForm}
                onSubmit={handleChangePassword}
            />
        </section>
    );
};

export default Profile;
