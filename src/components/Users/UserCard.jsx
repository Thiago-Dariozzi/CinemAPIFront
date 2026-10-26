import { useState } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';

const UserCard = ({
    id,
    name,
    email,
    role,
    onDelete,
    onEdit
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ name, email, role });

    const handleChangeValue = (event, inputKey) => {
        setForm((prevForm) => ({
            ...prevForm,
            [inputKey]: event.target.value
        }));
    }

    const handleSave = async () => {
        try {
            await onEdit(id, form);
            setIsEditing(false);
        } catch {
            // The dashboard shows the error; keep the user's input.
        }
    }

    if (isEditing) {
        return (
            <Card bg="dark" text="white" className="mb-3">
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control value={form.name} onChange={(event) => handleChangeValue(event, "name")} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={form.email} onChange={(event) => handleChangeValue(event, "email")} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select value={form.role} onChange={(event) => handleChangeValue(event, "role")}>
                                    <option value="Client">Cliente</option>
                                    <option value="Admin">Admin</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button
                        variant="success"
                        className="me-2"
                        onClick={handleSave}
                    >
                        Guardar
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card bg="dark" text="white" className="mb-3">
            <Card.Body>
                <Card.Title>👤 {name}</Card.Title>
                <Card.Text as="div">
                    <div>Email: {email}</div>
                    <div>Rol: {role}</div>
                </Card.Text>
                <Button variant="outline-warning" className="me-2" onClick={() => setIsEditing(true)}>Editar</Button>
                <Button variant="outline-danger" onClick={() => onDelete(id)}>Eliminar</Button>
            </Card.Body>
        </Card>
    );
};

export default UserCard;
