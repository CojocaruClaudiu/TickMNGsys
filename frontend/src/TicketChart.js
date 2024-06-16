// src/TicketChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './dashboard.css';

const TicketChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch('/api/ticket_data/')
            .then(response => response.json())
            .then(data => {
                setChartData({
                    labels: data.dates,
                    datasets: [
                        {
                            label: 'Tichete Create',
                            data: data.counts,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }
                    ]
                });
            });
    }, []);

    if (!chartData) {
        return <div className="loader">Loading...</div>;
    }

    return (
        <div className="card">
            <h2>Number of Tickets</h2>
            <div className="chart-container">
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
        </div>
    );
};

export default TicketChart;
