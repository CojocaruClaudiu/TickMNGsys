import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './dashboard.css';

const TicketChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/ticket_data/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Răspunsul rețelei nu a fost ok');
                }
                return response.json();
            })
            .then(data => {
                setChartData({
                    labels: data.dates,
                    datasets: [
                        {
                            label: 'Tichete Create',
                            data: data.total_counts,
                            fill: true,
                            stacked: true,
                            borderColor: '#5e87ff',
                            backgroundColor: 'rgba(94, 135, 255, 0.1)',
                            tension: 0.1,
                            pointBackgroundColor: '#ecf2ff',
                            pointBorderColor: '#5e87ff',
                            pointHoverBackgroundColor: '#5e87ff',
                            pointHoverBorderColor: '#ecf2ff',
                        },
                        {
                            label: 'Tichete Rezolvate',
                            data: data.completed_counts,
                            fill: true,
                            stacked: true,
                            borderColor: '#fa896b',
                            backgroundColor: 'rgba(250, 137, 107, 0.1)',
                            tension: 0.1,
                            pointBackgroundColor: '#fdede8',
                            pointBorderColor: '#fa896b',
                            pointHoverBackgroundColor: '#fa896b',
                            pointHoverBorderColor: '#fdede8',
                        },
                        {
                            label: 'Tichete Active',
                            data: data.active_counts,
                            fill: true,
                            stacked: true,
                            borderColor: '#13deb9',
                            backgroundColor: 'rgba(19, 222, 185, 0.1)',
                            tension: 0.1,
                            pointBackgroundColor: '#e6fffa',
                            pointBorderColor: '#13deb9',
                            pointHoverBackgroundColor: '#13deb9',
                            pointHoverBorderColor: '#e6fffa',
                        },

                    ]
                });
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loader">Încărcare...</div>;
    }

    if (error) {
        return <div className="error">Eroare: {error.message}</div>;
    }

    return (
        <div className="full-width-chart">
            <h3>Statusul Tichetelor în ultima lună:</h3>
            <div className="chart-container">
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                                backgroundColor: 'white',
                                borderColor: '#ccc',
                                borderWidth: 1,
                                padding: 10,
                                cornerRadius: 3,
                                titleColor: '#333',  // Set the title color here
                                bodyColor: '#333',   // Set the body color here
                                titleFont: {
                                    weight: 400,
                                    size: 16,          // Set the title font size here
                                },
                            },
                            legend: {
                                display: true,
                                position: 'top',
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.2)'
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default TicketChart;
