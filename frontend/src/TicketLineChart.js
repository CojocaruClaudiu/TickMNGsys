import React, {useEffect, useState} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine} from 'recharts';
import './dashboard.css';

const LineChartWithReferenceLines = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [referenceLines, setReferenceLines] = useState([
        {date: '2023-05-01', label: 'Milestone 1'},
        {date: '2023-06-01', label: 'Milestone 2'},
    ]);

    const [lineVisibility, setLineVisibility] = useState({
        customers: true,
        engineers: true,
        admins: true,
    });

    const [timeInterval, setTimeInterval] = useState('30'); // Default to last 30 days

    useEffect(() => {
        fetch(`/api/user_stats_trends/?days=${timeInterval}`)
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0) {
                    console.warn('No data returned from API');
                }

                const processedData = data.map(item => ({
                    date: new Date(item.date).toLocaleDateString('en-CA'), // Ensure the date is in YYYY-MM-DD format
                    customers: item.customers,
                    engineers: item.engineers,
                    admins: item.admins,
                }));

                console.log("Processed Data: ", processedData);  // Log the processed data to verify
                setChartData(processedData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user stats trends:', error);
                setError(error);
                setLoading(false);
            });
    }, [timeInterval]); // Update data when timeInterval changes

    const handleLegendClick = (dataKey) => {
        setLineVisibility(prevVisibility => ({
            ...prevVisibility,
            [dataKey]: !prevVisibility[dataKey]
        }));
    };

    const handleTimeIntervalChange = (e) => {
        setTimeInterval(e.target.value);
    };

    const CustomLegend = () => (
        <div className="custom-legend">
            <span onClick={() => handleLegendClick('customers')}
                  style={{color: lineVisibility.customers ? '#33c3f0' : '#e6f7ff', cursor: 'pointer'}}>
                <i className="bi bi-people-fill"></i> Clienți
            </span>
            <span onClick={() => handleLegendClick('engineers')}
                  style={{color: lineVisibility.engineers ? '#8cc63f' : '#f4f9ec', cursor: 'pointer', marginLeft: 10}}>
                 <i className="bi bi-tools"></i> Ingineri
            </span>
            <span onClick={() => handleLegendClick('admins')}
                  style={{color: lineVisibility.admins ? '#e83e8c' : '#f9e6f7', cursor: 'pointer', marginLeft: 10}}>
                <i className="bi bi-person-badge"></i> Admini
            </span>
        </div>
    );

    if (loading) {
        return <div className="loader">Încărcare...</div>;
    }

    if (error) {
        return <div className="error">Eroare: {error.message}</div>;
    }

    return (
        <div className="card small-card" role="region" aria-label="Grafic Liniar cu Linii de Referință">
            <div className="header">
                <div className="header-left">
                    <h2>Tendinta Tipul de Utilizatori:</h2>
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
            <CustomLegend/>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date" tick={{fill: '#8884d8'}}/>
                        <YAxis domain={[0, 'auto']} tick={{fill: '#8884d8'}}/>
                        <Tooltip contentStyle={{backgroundColor: 'white', border: '1px solid #ccc'}}/>
                        {lineVisibility.customers &&
                            <Line type="monotone" dataKey="customers" stroke="#33c3f0" strokeWidth={2} dot={{r: 3}}/>}
                        {lineVisibility.engineers &&
                            <Line type="monotone" dataKey="engineers" stroke="#8cc63f" strokeWidth={2} dot={{r: 3}}/>}
                        {lineVisibility.admins &&
                            <Line type="monotone" dataKey="admins" stroke="#e83e8c" strokeWidth={2} dot={{r: 3}}/>}
                        {referenceLines.map((line, index) => (
                            <ReferenceLine key={index} x={line.date} stroke="red"
                                           label={{position: 'top', value: line.label, fill: 'red'}}/>
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LineChartWithReferenceLines;
