import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './dashboard.css';

const TicketsCreatedBarChart = () => {
    const [chartData, setChartData] = useState(null);
    const [totalTickets, setTotalTickets] = useState(0);
    const [percentageChange, setPercentageChange] = useState(null);
    const [timeInterval, setTimeInterval] = useState('7_days');
    const [activeIndex, setActiveIndex] = useState(null);

    const fetchData = (interval) => {
        fetch(`/api/tickets_created/?interval=${interval}`)
            .then(response => response.json())
            .then(data => {
                const total = data.reduce((acc, day) => acc + day.tickets, 0);
                const prevTotal = data.slice(1).reduce((acc, day) => acc + day.tickets, 0);
                const change = prevTotal !== 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;

                setTotalTickets(total);
                setPercentageChange(change.toFixed(2));

                setChartData(data.map(day => ({
                    date: getDayOfWeek(day.date),
                    tickets: day.tickets
                })));
            })
            .catch(error => {
                console.error('Eroare la preluarea datelor de creare a biletelor:', error);
            });
    };

    // Funcție utilitară pentru a obține ziua săptămânii dintr-o dată
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
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
                    <p className="label">{`${label} : ${payload[0].value}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="card small-card" role="region" aria-label="Diagrama barelor de bilete create">
            <div className="header">
                <div>
                    <h2>Tichete create:</h2>
                    <span className="total-tichete"> {totalTickets}</span>
                </div>
                <span className="percentage-change" style={{color: percentageChange < 0 ? 'red' : 'green'}}>
                    {percentageChange}%
                </span>
            </div>
            <div className="selector">
                <label htmlFor="time-interval">Alege intervalul de timp: </label>
                <select id="time-interval" className="styled-select" value={timeInterval}
                        onChange={handleTimeIntervalChange}>
                    <option value="3_days">Ultimele 3 zile</option>
                    <option value="7_days">Ultimele 7 zile</option>
                    <option value="1_month">Ultima lună</option>
                    <option value="6_months">Ultimele 6 luni</option>
                    <option value="1_year">Ultimul an</option>
                </select>
            </div>
            <div className="chart-container" style={{height: '300px'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date" tick={false}/>
                        <Tooltip content={<CustomTooltip/>}/>
                        <Bar
                            dataKey="tickets"
                            fill="#00C3FF"
                            radius={10}
                            animationDuration={1500}
                            animationBegin={0}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === activeIndex ? '#13deb9' : '#e6fffa'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TicketsCreatedBarChart;
