import React, {useEffect, useState} from 'react';
import {ProgressBar, Container, OverlayTrigger, Tooltip} from 'react-bootstrap';
import './dashboard.css';

const TicketsProgress = () => {
    const [data, setData] = useState({
        total_tickets: 0,
        completed_tickets: 0,
        completed_percentage: 0,
        active_percentage: 0,
        pending_percentage: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/tickets_progress/')
            .then(response => response.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching ticket progress data:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loader">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error.message}</div>;
    }

    return (
        <Container className="progress-bar-container">
            <h5>Bara Progres Tichete</h5>
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-pending"
                                  className="white-tooltip">{`${data.pending_percentage.toFixed(2)}% În Așteptare`}</Tooltip>}
            >
                <ProgressBar now={data.pending_percentage} label={`${data.pending_percentage.toFixed(2)}% În Așteptare`}
                             className="progress-bar-pending"/>
            </OverlayTrigger>
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-active"
                                  className="white-tooltip">{`${data.active_percentage.toFixed(2)}% Deschise`}</Tooltip>}
            >
                <ProgressBar now={data.active_percentage} label={`${data.active_percentage.toFixed(2)}% Deschise`}
                             className="progress-bar-active"/>
            </OverlayTrigger>
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-completed"
                                  className="white-tooltip">{`${data.completed_percentage.toFixed(2)}% Închise`}</Tooltip>}
            >
                <ProgressBar now={data.completed_percentage} label={`${data.completed_percentage.toFixed(2)}% Închise`}
                             className="progress-bar-completed"/>
            </OverlayTrigger>
        </Container>
    );
};

export default TicketsProgress;
