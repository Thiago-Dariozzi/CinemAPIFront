import { Link, Navigate } from 'react-router-dom';
import EntityForm from '../components/common/EntityForm';
import { useSession } from '../hooks/useSession';
import { registerFields } from './authFields';
import { homePathFor } from './roles';
import { register } from './session';

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };

const Register = () => {
    const session = useSession();

    if (session) return <Navigate to={homePathFor(session.role)} replace />;

    return (
        <main className="auth-page">
            <div className="auth-page__card">
                <EntityForm
                    title="🎥 CinemAPI - Crear cuenta"
                    submitLabel="Registrarme"
                    fields={registerFields}
                    initialValues={initialForm}
                    onSubmit={register}
                />
                <p className="auth-page__footer">
                    ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
                </p>
            </div>
        </main>
    );
};

export default Register;
