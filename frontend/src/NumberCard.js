import React, {useEffect, useState} from 'react';
import './dashboard.css';

const NumberCard = ({title, fetchUrl, cardType}) => {
    const [number, setNumber] = useState(0);

    useEffect(() => {
        // Fetch data from the provided URL
        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                setNumber(data);
            });
    }, [fetchUrl]);

    return (
        <div className={`number-card ticket-card bg-${cardType}`}>
            <div className="ticket-card-body">
                <p className="ticket-card-number">{number}</p>
                <h3 className="ticket-card-title">{title}</h3>
            </div>
        </div>
    );
};

export default NumberCard;