import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './dashboard.css';

const TicketsCreatedByUsersChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch('/api/tickets_created_by_users/')
            .then(response => response.json())
            .then(data => {
                setChartData(data);
            })
            .catch(error => {
                console.error('Error fetching ticket creation data:', error);
            });
    }, []);

    if (!chartData) {
        return <div className="loader">Loading...</div>;
    }

    return (
        <div className="card">
            <h2>Tickets Created by Users</h2>
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

export default TicketsCreatedByUsersChart;
