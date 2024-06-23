import React from "react";
import "./dashboard.css";
import TicketChart from "./TicketChart";
import TicketStatusPieChart from "./TicketStatusPieChart";
import TicketsCreatedBarChart from "./TicketsCreatedBarChart";
import TicketSpecifiedDomainRadarChart from "./TicketSpecifiedDomainRadarChart";
import TicketSimpleRadarChart from "./TicketSimpleRadarChart";
import TicketLineChart from "./TicketLineChart";
import TicketSimpleBarChart from "./TicketSimpleBarChart";
import TicketCreatedByUsersChart from "./TicketCreatedByUsersChart";
import TicketResolutionScatterChart from "./TicketResolutionScatterChart";
import NumberCard from "./NumberCard";
import CalendarHeatmapChart from "./CalendarHeatmapChart";
import UserStatsCards from "./UserStatsCards";
import TicketProgressBar from "./TicketProgressBar";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="number-cards-container">
        <NumberCard
          title="Total Tichete"
          fetchUrl="/api/ticket_summary/totalTickets"
          cardType="total-tickets"
        />
        <NumberCard
          title="Tichete în aşteptare"
          fetchUrl="/api/ticket_summary/pendingTickets"
          cardType="pending-tickets"
        />
        <NumberCard
          title="Tichete Deschise"
          fetchUrl="/api/ticket_summary/activeTickets"
          cardType="open-tickets"
        />
        <NumberCard
          title="Tichete Închise"
          fetchUrl="/api/ticket_summary/resolvedTickets"
          cardType="closed-tickets"
        />
      </div>
      <TicketSimpleRadarChart />
      <TicketStatusPieChart />
      <TicketSpecifiedDomainRadarChart />
      <TicketsCreatedBarChart />
      <TicketChart />
      <div className="bigger-card">
        <div className="header">
          <h3>Distribuirea Tichetelor pe Utilizatori</h3>
        </div>
        <div className="charts-container">
          <TicketCreatedByUsersChart />
          <TicketSimpleBarChart />
        </div>
      </div>
      <TicketResolutionScatterChart />
      <TicketLineChart />

      <UserStatsCards />
      <CalendarHeatmapChart />
      <TicketProgressBar />
      <div className="dashboard">
        <div className="dashboard-cards"></div>
      </div>
    </div>
  );
};

export default Dashboard;
