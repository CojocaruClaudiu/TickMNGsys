import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import './dashboard.css';

const SimpleBarChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/tickets_assigned_to_users/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Răspunsul rețelei nu a fost ok');
                }
                return response.json();
            })
            .then(data => {
                setChartData({
                    labels: data.map(item => item.user),
                    datasets: [
                        {
                            label: 'Tichete Alocate',
                            data: data.map(item => item.tickets),
                            backgroundColor: '#8cc63f',
                            borderColor: '#8cc63f',
                            borderWidth: 1,
                            borderRadius: Number.MAX_VALUE,
                            borderSkipped: false
                        },
                    ],
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
        <div className="card">
            <h2>Tichete Alocate Inginerilor</h2>
            <div className="chart-container">
                <Bar
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
                            },
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false,
                                },
                            },
                            y: {
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.2)',
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default SimpleBarChart;