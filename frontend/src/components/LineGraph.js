import { Line } from 'react-chartjs-2';
import { Chart as Chartjs } from 'chart.js/auto';

export function LineGraph(props) {
    const { displayLabel = false, timeSeries } = props;
    const changingRates = timeSeries.changingRates;
    const timeSeriesRange = timeSeries.timeSeriesRange;
    const min = timeSeries.lowest;
    const max = timeSeries.highest;
    const mid = (max + min) / 2;
    const borderColor = () => {
        if (changingRates[0] > changingRates[changingRates.length - 1]) {
            return '#cd0000';
        } else {
            return '#0ba50b'
        }
    }
    const backgroundColor = () => {
        if (changingRates[0] > changingRates[changingRates.length - 1]) {
            return '#cd0000b0';
        } else {
            return '#0ba50bb0'
        }
    }
    const borderWidth = displayLabel ? 1.5 : 2.3;
    const pointRadius = displayLabel ? 3 : 0;

    const labels = timeSeriesRange;
    const data = {
        labels: labels,
        datasets: [{
            label: 'Currency History',
            data: changingRates,
            fill: false,
            borderColor,
            backgroundColor,
            tension: 0,
        }]
    };

    const plugins = displayLabel ? {
        legend: {
            display: false,
        },
        tooltip: {
            mode: 'index',
            intersect: false
        }
    } : {
        legend: {
            display: false,
        },
    };

    const maxXAxisLabel = () => {
        if (timeSeriesRange.length <= 7) {
            return 7;
        } else if (timeSeriesRange.length <= 31) {
            return 4;
        } else {
            return 12;
        }
    }

    const options = {
        plugins,
        scales: {
            y: {
                display: displayLabel, // Hide Y axis labels
                tickColor: 'black',
                ticks: {
                    // forces step size to be 50 units
                    maxTicksLimit: 4
                }
            },
            x: {
                display: displayLabel, // Hide X axis labels
                grid: {
                    color: 'white',
                    tickColor: 'black',                    
                },
                ticks: {
                    maxTicksLimit: maxXAxisLabel,
                },
            },
        },
        borderWidth,
        pointRadius,
    }
    return (
        <>
            <Line
                data={data}
                options={options}
            />
        </>
    )
}