import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import EntityForm from '../components/common/EntityForm';
import { useSession } from '../hooks/useSession';
import { loginFields } from './authFields';
import { homePathFor } from './roles';
import { isSessionExpiredNotice, login } from './session';

const initialForm = { email: "", password: "" };

const Login = () => {
    const session = useSession();
    const [showExpiredNotice] = useState(isSessionExpiredNotice);

    if (session) return <Navigate to={homePathFor(session.role)} replace />;

    return (
        <main className="auth-page">
            <div className="auth-page__card">
                {showExpiredNotice && <p className="msg-error">Tu sesión venció. Volvé a ingresar.</p>}
                <EntityForm
                    title="🎥 CinemAPI - Ingresar"
                    submitLabel="Ingresar"
                    submittingLabel="Ingresando..."
                    fields={loginFields}
                    initialValues={initialForm}
                    onSubmit={login}
                />
                <p className="auth-page__footer">
                    ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
                </p>
            </div>
        </main>
    );
};

export default Login;
