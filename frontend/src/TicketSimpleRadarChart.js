import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './dashboard.css';

const SimpleRadarChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch('/api/tickets_by_priority/')
            .then(response => response.json())
            .then(data => {
                // Process the data to fit the radar chart format
                const processedData = data.map(item => ({
                    priority: item.priority,
                    count: item.count,
                    color: item.color
                }));

                setChartData(processedData);
            })
            .catch(error => {
                console.error('Error fetching ticket data by priority:', error);
            });
    }, []);

    if (!chartData) {
        return <div className="loader">Încărcare...</div>;
    }

    return (
        <div className="card small-card" role="region" aria-label="Grafic Radar Tichete pe Prioritate">
            <div className="header">
                <h2>Tichete pe Prioritate</h2>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData} >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="priority" />
                        <PolarRadiusAxis angle={30} domain={[0, Math.max(...chartData.map(item => item.count))]}/>
                        <Tooltip />
                        <Radar
                            name="Tichete"
                            dataKey="count"
                            stroke="#13deb9"
                            fill="#13deb9"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SimpleRadarChart;
