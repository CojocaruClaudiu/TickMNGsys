import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import './dashboard.css';

const LineChartWithReferenceLines = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [referenceLines, setReferenceLines] = useState([
        { date: '2023-05-01', label: 'Milestone 1' },
        { date: '2023-06-01', label: 'Milestone 2' },
    ]);

    useEffect(() => {
        fetch('/api/ticket_status_trends/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) {
                    console.warn('No data returned from API');
                }

                const processedData = data.map(item => ({
                    date: new Date(item.date_created).toLocaleDateString(), // Format the date for better readability
                    active: item.active,
                    pending: item.pending,
                    completed: item.completed,
                }));

                console.log("Processed Data: ", processedData);  // Log the processed data to verify
                setChartData(processedData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching ticket status trends:', error);
                setError(error);
                setLoading(false);
            });
    }, []); // No dependencies needed here

    if (loading) {
        return <div className="loader">Încărcare...</div>;
    }

    if (error) {
        return <div className="error">Eroare: {error.message}</div>;
    }

    return (
        <div className="card small-card" role="region" aria-label="Grafic Liniar cu Linii de Referință">
            <div className="header">
                <h2>Tendințe în Schimbarea Statusului Tichete</h2>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 'auto']} /> {/* Adjust the Y-axis scale */}
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="active" stroke="#8884d8" />
                        <Line type="monotone" dataKey="pending" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="completed" stroke="#ffc658" />
                        {referenceLines.map((line, index) => (
                            <ReferenceLine key={index} x={line.date} stroke="red" label={line.label} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LineChartWithReferenceLines;
