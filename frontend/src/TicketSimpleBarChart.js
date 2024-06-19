import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './dashboard.css';

const SimpleBarChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch('/api/tickets_assigned_to_users/')
            .then(response => response.json())
            .then(data => {
                setChartData(data);
            })
            .catch(error => {
                console.error('Error fetching ticket assignment data:', error);
            });
    }, []);

    if (!chartData) {
        return <div className="loader">Loading...</div>;
    }

    return (
        <div className="card">
            <h2>Tickets Assigned to Users</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="user" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="tickets" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SimpleBarChart;
