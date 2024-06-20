import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';
import './dashboard.css';

const SimpleScatterChart = () => {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/ticket_resolution_times/')
            .then(response => response.json())
            .then(data => {
                const scatterData = {
                    datasets: [{
                        label: 'Timp de rezolvare',
                        data: data.map(ticket => ({
                            x: ticket.title,
                            y: ticket.resolution_time
                        })),
                        backgroundColor: 'rgba(253, 237, 232, 1)',
                        borderColor: 'rgb(250,137,107)',
                        borderWidth: 1,
                        pointRadius: 5,
                    }]
                };

                setChartData(scatterData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Eroare la preluarea datelor despre timpii de rezolvare:', error);
                setError('Nu s-au putut prelua datele despre timpii de rezolvare. Vă rugăm să încercați din nou mai târziu.');
                setLoading(false);
            });
    }, []);

    const formatTime = (time) => {
        if (time < 1) {
            return `${(time * 60).toFixed(2)} minute`;
        } else if (time >= 24) {
            return `${(time / 24).toFixed(2)} zile`;
        } else {
            return `${time.toFixed(2)} ore`;
        }
    };

    const formatTooltip = (time) => {
        if (time < 1) {
            return `${(time * 60).toFixed(2)} minute`;
        } else if (time >= 24) {
            const days = Math.floor(time / 24);
            const hours = (time % 24).toFixed(2);
            return `${days} zile și ${hours} ore`;
        } else {
            return `${time.toFixed(2)} ore`;
        }
    };

    if (loading) {
        return <div className="loader">Se încarcă...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="card" role="region" aria-label="Timpul de rezolvare al tichetelor">
            <h2>Timpii de rezolvare a tichetelor</h2>
            <p>Total Tichete: {chartData.datasets[0].data.length}</p>
            <div className="chart-container">
                <Scatter
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'category',
                                title: {
                                    display: false,
                                }
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Timp de rezolvare'
                                },
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.2)',
                                },
                            },
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const time = context.raw.y;
                                        return ` ${formatTooltip(time)}`;
                                    }
                                }
                            },
                            legend: {
                                labels: {
                                    font: {
                                        size: 14,
                                    },
                                    color: '#333',
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default SimpleScatterChart;
