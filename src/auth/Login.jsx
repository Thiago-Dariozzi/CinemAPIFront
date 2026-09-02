import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Container } from 'react-bootstrap';
import { login } from './session';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        login(
            email,
            password,
            (session) => {
                setIsSubmitting(false);
                navigate(session.role === "Admin" ? "/admin" : "/panel");
            },
            (err) => {
                setIsSubmitting(false);
                setError(err.message || "Email o contraseña incorrectos.");
            }
        );
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card bg="dark" text="white" style={{ width: '380px' }}>
                <Card.Body>
                    <Card.Title className="accent-title mb-3">🎥 CinemAPI - Ingresar</Card.Title>

                    {error && <p className="text-danger">{error}</p>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="admin@admin.com / user@user.com"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button type="submit" disabled={isSubmitting} className="btn-accent w-100">
                            {isSubmitting ? "Ingresando..." : "Ingresar"}
                        </Button>
                    </Form>

                    <p className="text-muted mt-3 mb-0 login-hint">
                        Demo: admin@admin.com / admin (panel Admin) — user@user.com / user (panel Usuario)
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
