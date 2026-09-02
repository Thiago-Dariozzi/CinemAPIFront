import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import TicketCard from './TicketCard';

const TicketContainer = ({ isLoading, tickets, movies = [], screens = [], users = [], fixedUserId, onDelete, onEdit }) => {

    if (isLoading) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    const ticketsMapped = tickets.map((ticket) => (
        <Col md={6} lg={4} key={ticket.id}>
            <TicketCard
                id={ticket.id}
                movieId={ticket.movieId}
                screenId={ticket.screenId}
                userId={ticket.userId}
                buyDate={ticket.buyDate}
                finalPrice={ticket.finalPrice}
                movies={movies}
                screens={screens}
                users={users}
                fixedUserId={fixedUserId}
                onDelete={onDelete}
                onEdit={onEdit}
            />
        </Col>
    ));

    return (
        <Row>
            {ticketsMapped}
        </Row>
    );
};

export default TicketContainer;
