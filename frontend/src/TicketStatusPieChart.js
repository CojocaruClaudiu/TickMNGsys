import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './dashboard.css';

const TicketStatusPieChart = () => {
    const [chartData, setChartData] = useState(null);
    const [totalTickets, setTotalTickets] = useState(0);

    useEffect(() => {
        fetch('/api/ticket_status_data/')
            .then(response => response.json())
            .then(data => {
                const total = data.active + data.pending + data.completed;
                setTotalTickets(total);
                setChartData({
                    labels: ['Deschis', 'În așteptare', 'Închis'],
                    datasets: [
                        {
                            label: 'Nr Tichete',
                            data: [data.active, data.pending, data.completed],


                            backgroundColor: [
                                '#e6fffa',
                                '#fef5e5',
                                '#fdede8',
                            ],

                            hoverBorderColor: [
                                '#13deb9',
                                '#ffae1f',
                                '#fa896b',
                            ],
                            borderWidth: 2,

                        }
                    ]
                });
            })
            .catch(error => {
                console.error('Error fetching ticket status data:', error);
            });
    }, []);

    if (!chartData) {
        return <div className="loader">Loading...</div>;
    }

    return (
        <div className="card" role="region" aria-label="Ticket Status Pie Chart">
            <div className="header">
                <h2>Status Tichete:</h2>
                <span
                    className="total-tichete">Total Tichete: {chartData.datasets[0].data.reduce((a, b) => a + b, 0)}</span>
            </div>
            <div className="chart-container">
                <Pie
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: '#333',
                                    font: {
                                        size: 14,
                                    },
                                },
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        label += context.raw;
                                        return label;
                                    }
                                }
                            },
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true,
                            duration:1500,


                        },
                    }}
                />
            </div>
        </div>
    );
};

export default TicketStatusPieChart;
