import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './dashboard.css';

const TicketChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeInterval, setTimeInterval] = useState(30); // Default to the last 30 days

    const fetchData = (interval) => {
        setLoading(true);
        fetch(`/api/ticket_data/?interval=${interval}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
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
    };

    useEffect(() => {
        fetchData(timeInterval);
    }, [timeInterval]);

    const handleTimeIntervalChange = (event) => {
        setTimeInterval(event.target.value);
    };

    if (loading) {
        return <div className="loader">Încărcare...</div>;
    }

    if (error) {
        return <div className="error">Eroare: {error.message}</div>;
    }

    return (
        <div className="full-width-chart">
            <div className="header">
                <div className="header-left">
                    <h2>Evoluția Tichetelor</h2>
                </div>
                <div className="selector">
                    <select id="time-interval" className="styled-select" value={timeInterval}
                            onChange={handleTimeIntervalChange}>
                        <option value="7">Ultimele 7 zile</option>
                        <option value="30">Ultimele 30 de zile</option>
                        <option value="90">Ultimele 90 de zile</option>
                        <option value="180">Ultimele 6 luni</option>
                        <option value="365">Ultimul an</option>
                    </select>
                </div>
            </div>
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
                                titleColor: '#333',
                                bodyColor: '#333',
                                titleFont: {
                                    weight: 400,
                                    size: 16,
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
