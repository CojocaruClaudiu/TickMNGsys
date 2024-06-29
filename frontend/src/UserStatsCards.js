import React, {useEffect, useState} from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './dashboard.css';

const UserStatsCards = () => {
    const [stats, setStats] = useState({customers: 0, engineers: 0, admins: 0});
    const totalUsers = stats.customers + stats.engineers + stats.admins;

    useEffect(() => {
        // Fetch stats data
        fetch('/api/user_stats/')
            .then(response => response.json())
            .then(data => {
                setStats({
                    customers: data.customers,
                    engineers: data.engineers,
                    admins: data.admins
                });
            })
            .catch(error => {
                console.error('Eroare la preluarea statisticilor utilizatorilor:', error);
            });
    }, []);

    return (
        <div className="stats-cards-container">
            <div className="number-card bg-customers ticket-card">
                <div className="ticket-card-body">
                    <i className="bi bi-people-fill" style={{fontSize: '2rem'}}></i>
                    <div className="ticket-card-number">{stats.customers}</div>
                    <div className="ticket-card-title">Clienți</div>
                </div>
            </div>
            <div className="number-card bg-engineers ticket-card">
                <div className="ticket-card-body">
                    <i className="bi bi-tools" style={{fontSize: '2rem'}}></i>
                    <div className="ticket-card-number">{stats.engineers}</div>
                    <div className="ticket-card-title">Ingineri</div>
                </div>
            </div>
            <div className="number-card bg-admins ticket-card">
                <div className="ticket-card-body">
                    <i className="bi bi-person-badge-fill" style={{fontSize: '2rem'}}></i>
                    <div className="ticket-card-number">{stats.admins}</div>
                    <div className="ticket-card-title">Admini</div>
                </div>
            </div>
            <div className="number-card bg-total ticket-card">
                <div className="ticket-card-body">
                    <i className="bi bi-graph-up" style={{fontSize: '2rem'}}></i>
                    <div className="ticket-card-number">{totalUsers}</div>
                    <div className="ticket-card-title">Total Utilizatori</div>
                </div>
            </div>


        </div>
    );
};

export default UserStatsCards;