import { Line } from 'react-chartjs-2';
import { Chart as Chartjs } from 'chart.js/auto';

export function LineGraph(props) {
    const { displayLabel = false } = props;
    const labels = [0, 20, 40, 60, 80, 100];
    const data = {
        labels: labels,
        datasets: [{
            label: 'Currency History',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.4,
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