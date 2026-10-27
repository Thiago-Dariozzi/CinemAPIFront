import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import EntityForm from '../components/common/EntityForm';
import { useSession } from '../hooks/useSession';
import { loginFields } from './authFields';
import { pathAfterLogin } from './roles';
import { isSessionExpiredNotice, login } from './session';

const initialForm = { email: "", password: "" };

const Login = () => {
    const session = useSession();
    const location = useLocation();
    const [showExpiredNotice] = useState(isSessionExpiredNotice);

    if (session) return <Navigate to={pathAfterLogin(session.role, location.state?.from)} replace />;

    return (
        <main className="auth-page">
            <div className="auth-page__card">
                {showExpiredNotice && <p className="msg-error">Tu sesión venció. Volvé a ingresar.</p>}
                {location.state?.notice && <p className="msg-info">{location.state.notice}</p>}
                <EntityForm
                    title="🎥 CinemAPI - Ingresar"
                    submitLabel="Ingresar"
                    submittingLabel="Ingresando..."
                    fields={loginFields}
                    initialValues={initialForm}
                    onSubmit={login}
                />
                <p className="auth-page__footer">
                    ¿No tenés cuenta? <Link to="/registro" state={location.state}>Registrate</Link>
                </p>
                <p className="auth-page__footer">
                    <Link to="/cartelera">← Volver a la cartelera</Link>
                </p>
            </div>
        </main>
    );
};

export default Login;
