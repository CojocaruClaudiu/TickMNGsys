import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';
import './dashboard.css';

const TicketsCreatedBarChart = () => {
    const [chartData, setChartData] = useState(null);
    const [totalTickets, setTotalTickets] = useState(0);
    const [timeInterval, setTimeInterval] = useState('7_days');
    const [activeIndex, setActiveIndex] = useState(null);

    const fetchData = (interval) => {
        fetch(`/api/tickets_created/?interval=${interval}`)
            .then(response => response.json())
            .then(data => {
                const total = data.reduce((acc, day) => acc + day.tickets, 0);

                setTotalTickets(total);

                setChartData(data.map(day => ({
                    date: new Date(day.date).toLocaleDateString(),
                    day: getDayOfWeek(day.date),
                    tickets: day.tickets
                })));
            })
            .catch(error => {
                console.error('Eroare la preluarea datelor de creare a biletelor:', error);
            });
    };

    const getDayOfWeek = (date) => {
        const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
        return days[new Date(date).getDay()];
    };

    useEffect(() => {
        fetchData(timeInterval);
    }, [timeInterval]);

    const handleTimeIntervalChange = (e) => {
        setTimeInterval(e.target.value);
    };

    const handleMouseEnter = (data, index) => {
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    if (!chartData) {
        return <div className="loader">Se încarcă...</div>;
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`Data: ${payload[0].payload.date}`}</p>
                    <p className="value">{`${label}: ${payload[0].value}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="full-width-chart" role="region" aria-label="Diagrama barelor de bilete create">
            <div className="header">
                <div className="header-left">
                    <h2>{totalTickets}</h2>
                    <span className="total-tichete">Tichete Create în:</span>
                </div>
                <div className="selector">
                    <select id="time-interval" className="styled-select" value={timeInterval} onChange={handleTimeIntervalChange}>
                        <option value="7_days">Ultimele 7 zile</option>
                        <option value="1_month">Ultimele 30 de zile</option>
                        <option value="3_month">Ultimele 90 de zile</option>
                        <option value="6_months">Ultimele 6 luni</option>
                        <option value="1_year">Ultimul an</option>
                    </select>
                </div>
            </div>
            <div className="chart-container" style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="tickets"
                            fill="#8884d8"
                            radius={[10, 10, 0, 0]}
                            animationDuration={1500}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === activeIndex ? '#5e87ff' : '#49beff'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TicketsCreatedBarChart;