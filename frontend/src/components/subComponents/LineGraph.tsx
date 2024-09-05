import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as Chartjs, registerables } from 'chart.js';
import { LineChart } from '@mui/x-charts/LineChart';
import { type TimeSerie } from '../../lib/types';

Chartjs.register(...registerables); // register line Chart.js's Line comp

type LineGraphProps = {
    displayLabel: boolean;
    timeSeries: TimeSerie | null;
}

export function LineGraph(props: LineGraphProps) {
    const { displayLabel, timeSeries } = props;
    // console.log("Check passing in TimeSeries: ", timeSeries); // for debugging the response data
    const changingRates: number[] | null = timeSeries !== null ? timeSeries.changingRates : null;
    const timeSeriesRangeLabel = timeSeries !== null && changingRates !== null
        ? (changingRates.length <= 31 ? timeSeries.dayRangeIndicator : timeSeries.monthRangeIndicator)
        : ["1d"];

    // color of the color label within popup box
    const borderColor = () => {
        if (changingRates !== null && changingRates[0] > changingRates[changingRates.length - 1]) {
            return '#cd0000';
        } else {
            return '#0ba50b'
        }
    };

    // color of the color label within popup box
    const backgroundColor = () => {
        if (changingRates !== null && changingRates[0] > changingRates[changingRates.length - 1]) {
            return '#cd0000b0';
        } else {
            return '#0ba50bb0'
        }
    };

    const borderWidth = displayLabel ? 2 : 2.3; // the graph line's thickness
    const labels: string[] = timeSeriesRangeLabel; // the header of popup tag when hover on lin graph
    const data = {
        labels: labels,
        datasets: [{
            label: '',
            data: changingRates,
            fill: false,
            borderColor,
            backgroundColor,
            tension: 0,
        }]
    };

    const targetMode = getTargetMode(displayLabel);
    const maxXAxisLabel = getMaxXAxisLabel(timeSeriesRangeLabel);

    const plugins = displayLabel ? {
        legend: {
            display: false,
        },
        tooltip: {
            mode: targetMode,
            intersect: false
        }
    } : {
        legend: {
            display: false,
        },
    };

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

const getTargetMode = (displayLabel: boolean): "index" | undefined => {
    return displayLabel ? 'index' : undefined;
}

const getMaxXAxisLabel = (timeSeriesRangeLabel: string[]): number => {
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