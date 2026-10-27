import { Link, Navigate, useLocation } from 'react-router-dom';
import EntityForm from '../components/common/EntityForm';
import { useSession } from '../hooks/useSession';
import { registerFields } from './authFields';
import { pathAfterLogin } from './roles';
import { register } from './session';

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };

const Register = () => {
    const session = useSession();
    const location = useLocation();

    if (session) return <Navigate to={pathAfterLogin(session.role, location.state?.from)} replace />;

    return (
        <main className="auth-page">
            <div className="auth-page__card">
                <EntityForm
                    title="🎥 CinemAPI - Crear cuenta"
                    submitLabel="Registrarme"
                    submittingLabel="Creando cuenta..."
                    fields={registerFields}
                    initialValues={initialForm}
                    onSubmit={register}
                />
                <p className="auth-page__footer">
                    ¿Ya tenés cuenta? <Link to="/login" state={location.state}>Ingresá</Link>
                </p>
                <p className="auth-page__footer">
                    <Link to="/cartelera">← Volver a la cartelera</Link>
                </p>
            </div>
        </main>
    );
};

export default Register;
