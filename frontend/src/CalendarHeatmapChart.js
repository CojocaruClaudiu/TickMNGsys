import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import 'react-calendar-heatmap/dist/styles.css';
import 'react-tooltip/dist/react-tooltip.css';
import './dashboard.css';

import { subDays } from 'date-fns';

const CalendarHeatmapChart = () => {
    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {
        fetch('/api/tickets_calendar_data/')
            .then(response => response.json())
            .then(data => {
                const formattedData = Object.keys(data).map(date => ({
                    date,
                    count: data[date]
                }));
                setHeatmapData(formattedData);
            })
            .catch(error => {
                console.error('Eroare la preluarea datelor calendaristice:', error);
            });
    }, []);

    return (
        <div className="calendar-heatmap-container">
            <h3>Harta Termografică a Tichetelor în ultimul an</h3>
            <CalendarHeatmap
                startDate={subDays(new Date(), 365)}
                endDate={new Date()}
                values={heatmapData}
                classForValue={value => {
                    if (!value) {
                        return 'color-empty';
                    }
                    return `color-github-${Math.min(value.count, 4)}`;
                }}
                tooltipDataAttrs={value => {
                    return {
                        'data-tooltip-id': 'heatmap-tooltip',
                        'data-tooltip-content': value.date
                            ? `${value.date}: ${value.count} Tichete`
                            : 'Niciun Tichet'
                    };
                }}
                showWeekdayLabels
            />
            <ReactTooltip id="heatmap-tooltip" />
        </div>
    );
};

export default CalendarHeatmapChart;
