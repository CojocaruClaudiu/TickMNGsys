import React, {useEffect, useState} from 'react';
import {Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer} from 'recharts';
import './dashboard.css';

const SpecifiedDomainRadarChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch('/api/tickets_by_category/')
            .then(response => response.json())
            .then(data => {
                // Procesarea datelor pentru a se potrivi cu formatul graficului radar
                const processedData = data.map(item => ({
                    category: item.category,
                    count: item.count,
                }));

                setChartData(processedData);
            })
            .catch(error => {
                console.error('Eroare la preluarea datelor despre tichete pe categorii:', error);
            });
    }, []);

    if (!chartData) {
        return <div className="loader">Încărcare...</div>;
    }

    return (
        <div className="card small-card" role="region" aria-label="Grafic Radar Tichete pe Categorii">
            <div className="header">
                <h2>Tichete pe Categorii:</h2>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid/>
                        <PolarAngleAxis dataKey="category" tick={{textAnchor: 'middle', fontSize: 14}}/>
                        <PolarRadiusAxis/>
                        <Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #ccc'}}/>
                        <Radar name="Tichete" dataKey="count" stroke="#5e87ff" fill="#49beff" fillOpacity={0.6}/>
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SpecifiedDomainRadarChart;
