import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { initialForm } from './NewTicket.data';
import { getShowtimesByMovie, formatShowtime } from '../../api/showtimeApi';

const NewTicket = ({ onAddTicket, movies = [], screens = [], users = [], fixedUserId }) => {

    const [form, setForm] = useState(initialForm);
    const [showtimes, setShowtimes] = useState([]);
    const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);

    useEffect(() => {
        if (!fixedUserId || !form.movieId) {
            setShowtimes([]);
            return;
        }

        const loadShowtimes = async () => {
            setIsLoadingShowtimes(true);
            try {
                const data = await getShowtimesByMovie(form.movieId);
                setShowtimes(data);
            } catch (err) {
                console.error(err);
                setShowtimes([]);
            } finally {
                setIsLoadingShowtimes(false);
            }
        };

        loadShowtimes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fixedUserId, form.movieId]);

    const handleChangeValue = (event, inputKey) => {
        setForm((prevForm) => ({
            ...prevForm,
            [inputKey]: event.target.value
        }));
    }

    const handleChangeMovie = (event) => {
        const movieId = event.target.value;
        setForm((prevForm) => ({ ...prevForm, movieId, showtimeId: "", screenId: "", buyDate: "", finalPrice: 0 }));
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

    const handleAddTicket = (event) => {
        event.preventDefault();
        onAddTicket(fixedUserId ? { ...form, userId: fixedUserId } : form);
        setForm(initialForm);
    }

    return (
        <Card bg="dark" text="white" className="mb-4">
            <Card.Body>
                <Card.Title className="accent-title">Agregar Nuevo Ticket</Card.Title>

                <Form onSubmit={handleAddTicket}>
                    <Row>
                        <Col md={fixedUserId ? 6 : 4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Película</Form.Label>
                                <Form.Select
                                    value={form.movieId}
                                    onChange={fixedUserId ? handleChangeMovie : (event) => handleChangeValue(event, "movieId")}
                                    required
                                >
                                    <option value="">Seleccionar película...</option>
                                    {movies.map((movie) => (
                                        <option key={movie.id} value={movie.id}>{movie.title}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {fixedUserId ? (
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Horario</Form.Label>
                                    <Form.Select
                                        value={form.showtimeId || ""}
                                        onChange={handleChangeShowtime}
                                        required
                                        disabled={!form.movieId || isLoadingShowtimes}
                                    >
                                        <option value="">
                                            {!form.movieId
                                                ? "Elegí una película primero..."
                                                : isLoadingShowtimes
                                                    ? "Cargando horarios..."
                                                    : showtimes.length === 0
                                                        ? "No hay horarios para esta película"
                                                        : "Seleccionar horario..."}
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
                                <Form.Group className="mb-3">
                                    <Form.Label>Sala</Form.Label>
                                    <Form.Select
                                        value={form.screenId}
                                        onChange={(event) => handleChangeValue(event, "screenId")}
                                        required
                                    >
                                        <option value="">Seleccionar sala...</option>
                                        {screens.map((screen) => (
                                            <option key={screen.id} value={screen.id}>{screen.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        )}

                        {!fixedUserId && (
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Select
                                        value={form.userId}
                                        onChange={(event) => handleChangeValue(event, "userId")}
                                        required
                                    >
                                        <option value="">Seleccionar usuario...</option>
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
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de compra</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={form.buyDate}
                                        onChange={(event) => handleChangeValue(event, "buyDate")}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        )}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio Final</Form.Label>
                                {fixedUserId ? (
                                    <Form.Control
                                        type="text"
                                        value={form.showtimeId ? `$${form.finalPrice}` : "Elegí un horario primero..."}
                                        disabled
                                        readOnly
                                    />
                                ) : (
                                    <Form.Control
                                        type="number"
                                        value={form.finalPrice}
                                        onChange={(event) => handleChangeValue(event, "finalPrice")}
                                        min="0"
                                        step="0.01"
                                    />
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button type="submit" className="btn-accent">
                        Guardar Ticket
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default NewTicket;
