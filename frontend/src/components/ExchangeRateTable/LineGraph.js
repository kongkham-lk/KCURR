import { Line } from 'react-chartjs-2';
import { Chart as Chartjs } from 'chart.js/auto';

export function LineGraph(props) {
    const { displayLabel = false, timeSeries } = props;
    const changingRates = timeSeries.changingRates;
    const dateRange = timeSeries.dateRange;
    const graphColor = () => {
        if (changingRates[0] > changingRates[changingRates.length - 1]) {
            return '#cd0000';
        } else {
            return '#0ba50b'
        }
    }

    const labels = dateRange;
    const data = {
        labels: labels,
        datasets: [{
            label: 'Currency History',
            data: changingRates,
            fill: false,
            borderColor: graphColor,
            tension: 0,
            pointRadius: 0,
        }]
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                display: displayLabel // Hide Y axis labels
            },
            x: {
                display: displayLabel // Hide X axis labels
            }
        }
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