// src/Dashboard.js
import React from 'react';
import TicketChart from './TicketChart';
import TicketStatusPieChart from './TicketStatusPieChart';
import './dashboard.css';
import TicketsCreatedBarChart from "./TicketsCreatedBarChart";
import TicketSpecifiedDomainRadarChart from "./TicketSpecifiedDomainRadarChart";
import SpecifiedDomainRadarChart from "./TicketSpecifiedDomainRadarChart";
import TicketSimpleRadarChart from "./TicketSimpleRadarChart";

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <TicketChart />
            <TicketStatusPieChart />
            <TicketsCreatedBarChart />
            <TicketSpecifiedDomainRadarChart />
            <TicketSimpleRadarChart />
            {/* Add more card components for different charts and data displays */}
            <div className="card">
                <h2>d</h2>
                {/* Your content here */}
            </div>
            <div className="card">
                <h2>Views</h2>

            </div>
            <div className="card">
                <h2>Sales</h2>
                {/* Your content here */}
            </div>
            {/* Add more cards as needed */}
        </div>
    );
};

export default Dashboard;
