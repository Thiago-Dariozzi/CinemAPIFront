import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { getShowtimesByMovie, formatShowtime } from '../../api/showtimeApi';

const findLabel = (list, id, field) => {
    const found = list.find((item) => item.id === id);
    return found ? found[field] : "(eliminado)";
};

const TicketCard = ({
    id,
    movieId,
    screenId,
    userId,
    buyDate,
    finalPrice,
    movies = [],
    screens = [],
    users = [],
    fixedUserId,
    onDelete,
    onEdit
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ movieId, screenId, userId, buyDate, finalPrice, showtimeId: "" });
    const [showtimes, setShowtimes] = useState([]);
    const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);

    useEffect(() => {
        if (!fixedUserId || !isEditing || !form.movieId) {
            return;
        }

        setIsLoadingShowtimes(true);
        getShowtimesByMovie(
            form.movieId,
            (data) => {
                setShowtimes(data);
                setIsLoadingShowtimes(false);
                const match = data.find(
                    (s) => s.screenId === form.screenId && s.startTime.substring(0, 10) === form.buyDate
                );
                if (match) {
                    setForm((prev) => ({ ...prev, showtimeId: match.id, finalPrice: match.price }));
                }
            },
            (err) => {
                console.error(err);
                setShowtimes([]);
                setIsLoadingShowtimes(false);
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fixedUserId, isEditing, form.movieId]);

    const handleChangeValue = (event, inputKey) => {
        setForm((prevForm) => ({
            ...prevForm,
            [inputKey]: event.target.value
        }));
    }

    const handleChangeMovie = (event) => {
        const newMovieId = event.target.value;
        setForm((prevForm) => ({ ...prevForm, movieId: newMovieId, showtimeId: "", screenId: "", buyDate: "", finalPrice: 0 }));
    }

    const handleChangeShowtime = (event) => {
        const showtimeId = event.target.value;
        const showtime = showtimes.find((s) => s.id === showtimeId);
        setForm((prevForm) => ({
            ...prevForm,
            showtimeId,
            screenId: showtime ? showtime.screenId : "",
            buyDate: showtime ? showtime.startTime.substring(0, 10) : "",
            finalPrice: showtime ? showtime.price : 0,
        }));
    }

    const handleSave = () => {
        onEdit(id, fixedUserId ? { ...form, userId: fixedUserId } : form);
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <Card bg="dark" text="white" className="mb-3">
                <Card.Body>
                    <Row>
                        <Col md={fixedUserId ? 6 : 4}>
                            <Form.Group className="mb-2">
                                <Form.Label>Película</Form.Label>
                                <Form.Select
                                    value={form.movieId}
                                    onChange={fixedUserId ? handleChangeMovie : (event) => handleChangeValue(event, "movieId")}
                                >
                                    {movies.map((movie) => (
                                        <option key={movie.id} value={movie.id}>{movie.title}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {fixedUserId ? (
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Horario</Form.Label>
                                    <Form.Select
                                        value={form.showtimeId || ""}
                                        onChange={handleChangeShowtime}
                                        required
                                        disabled={isLoadingShowtimes}
                                    >
                                        <option value="">
                                            {isLoadingShowtimes ? "Cargando horarios..." : "Seleccionar horario..."}
                                        </option>
                                        {showtimes.map((showtime) => (
                                            <option key={showtime.id} value={showtime.id}>
                                                {formatShowtime(showtime.startTime)} — ${showtime.price}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        ) : (
                            <Col md={4}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Sala</Form.Label>
                                    <Form.Select value={form.screenId} onChange={(event) => handleChangeValue(event, "screenId")}>
                                        {screens.map((screen) => (
                                            <option key={screen.id} value={screen.id}>{screen.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        )}

                        {!fixedUserId && (
                            <Col md={4}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Select value={form.userId} onChange={(event) => handleChangeValue(event, "userId")}>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        )}
                    </Row>
                    <Row>
                        {!fixedUserId && (
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Fecha de compra</Form.Label>
                                    <Form.Control type="date" value={form.buyDate} onChange={(event) => handleChangeValue(event, "buyDate")} />
                                </Form.Group>
                            </Col>
                        )}
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Precio Final</Form.Label>
                                {fixedUserId ? (
                                    <Form.Control
                                        type="text"
                                        value={form.showtimeId ? `$${form.finalPrice}` : "Elegí un horario primero..."}
                                        disabled
                                        readOnly
                                    />
                                ) : (
                                    <Form.Control type="number" value={form.finalPrice} onChange={(event) => handleChangeValue(event, "finalPrice")} />
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="success" className="me-2" onClick={handleSave}>Guardar</Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card bg="dark" text="white" className="mb-3">
            <Card.Body>
                <Card.Title>🎟️ {findLabel(movies, movieId, 'title')}</Card.Title>
                <Card.Text as="div">
                    <div>Sala: {findLabel(screens, screenId, 'name')}</div>
                    {!fixedUserId && <div>Usuario: {findLabel(users, userId, 'name')}</div>}
                    <div>Fecha de compra: {buyDate ? buyDate.substring(0, 10) : "-"}</div>
                    <div>Precio final: ${finalPrice}</div>
                </Card.Text>
                <Button variant="outline-warning" className="me-2" onClick={() => setIsEditing(true)}>Editar</Button>
                <Button variant="outline-danger" onClick={() => onDelete(id)}>Eliminar</Button>
            </Card.Body>
        </Card>
    );
};

export default TicketCard;
