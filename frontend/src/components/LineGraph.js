import { Line } from 'react-chartjs-2';
import { Chart as Chartjs } from 'chart.js/auto';

export function LineGraph(props) {
    const { displayLabel = false, timeSeries = null } = props;
    // console.log("Check passing in TimeSeries: ", timeSeries); // for debugging the response data
    const changingRates = timeSeries !== null ? timeSeries.changingRates : null;
    const timeSeriesRangeLabel = timeSeries !== null ? (changingRates.length <= 31 ? timeSeries.dayRangeIndicator : timeSeries.monthRangeIndicator) : "1d";
    const borderColor = () => {
        if (changingRates !== null && changingRates[0] > changingRates[changingRates.length - 1]) {
            return '#cd0000';
        } else {
            return '#0ba50b'
        }
    };
    
    const backgroundColor = () => {
        if (changingRates !== null && changingRates[0] > changingRates[changingRates.length - 1]) {
            return '#cd0000b0';
        } else {
            return '#0ba50bb0'
        }
    };

    const borderWidth = displayLabel ? 2 : 2.3;
    const labels = timeSeriesRangeLabel;
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
        if (timeSeriesRangeLabel.length <= 7) {
            return 7;
        } else if (timeSeriesRangeLabel.length <= 31) {
            return 7;
        } else if (timeSeriesRangeLabel.length < 31 * 3) {
            return 4;
        } else {
            return 7;
        }
    }

    const options = {
        plugins,
        scales: {
            y: {
                display: displayLabel, // Hide Y axis labels
                grid: {
                    tickColor: '#adadad',
                },
                ticks: {
                    // forces step size to be 50 units
                    maxTicksLimit: 4
                },
                border: {
                    dash: [6, 6]
                },
                min: Math.floor(timeSeries.lowest * 1000) / 1000,
                max: Math.ceil(timeSeries.highest * 1000) / 1000,
            },
            x: {
                display: displayLabel, // Hide X axis labels
                grid: {
                    color: 'white',
                    tickColor: '#adadad',
                },
                ticks: {
                    maxTicksLimit: maxXAxisLabel,
                    alwaysShowLastTick: true,
                },
            },
        },
        borderWidth,
        pointRadius: 0,
        maintainAspectRatio: false,
    }
    
    return (
        <Line
            data={data}
            options={options}
        />
    )
}