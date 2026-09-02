import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import UserCard from './UserCard';

const UserContainer = ({ isLoading, users, onDelete, onEdit }) => {

    if (isLoading) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    const usersMapped = users.map((user) => (
        <Col md={6} lg={4} key={user.id}>
            <UserCard
                id={user.id}
                name={user.name}
                email={user.email}
                role={user.role}
                onDelete={onDelete}
                onEdit={onEdit}
            />
        </Col>
    ));

    return (
        <Row>
            {usersMapped}
        </Row>
    );
};

export default UserContainer;
