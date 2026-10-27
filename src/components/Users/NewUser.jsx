import { useState } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { initialForm } from './NewUser.data';

const NewUser = ({ title, role, onAddUser }) => {

    const [form, setForm] = useState({ ...initialForm, role });

    const handleChangeValue = (event, inputKey) => {
        setForm((prevForm) => ({
            ...prevForm,
            [inputKey]: event.target.value
        }));
    }

    const handleAddUser = async (event) => {
        event.preventDefault();
        try {
            await onAddUser(form);
            setForm({ ...initialForm, role });
        } catch {
            // The dashboard shows the error; keep the user's input.
        }
    }

    return (
        <Card bg="dark" text="white" className="mb-4">
            <Card.Body>
                <Card.Title className="accent-title">{title}</Card.Title>

                <Form onSubmit={handleAddUser}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={form.name}
                                    onChange={(event) => handleChangeValue(event, "name")}
                                    placeholder="Nombre completo"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={form.email}
                                    onChange={(event) => handleChangeValue(event, "email")}
                                    placeholder="correo@ejemplo.com"
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={form.password}
                                    onChange={(event) => handleChangeValue(event, "password")}
                                    placeholder="Mínimo 8 caracteres"
                                    minLength={8}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button type="submit" className="btn-accent">
                        Guardar Usuario
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default NewUser;
