import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as Chartjs, registerables } from 'chart.js';
import { type TimeSerie } from '../../lib/types';

Chartjs.register(...registerables); // register line Chart.js's Line comp

type LineGraphProps = {
    displayLabel: boolean;
    timeSeries: TimeSerie | null;
}

export function LineGraph(props: LineGraphProps) {
    const { displayLabel, timeSeries } = props;
    // console.log("Check passing in TimeSeries: ", timeSeries); // for debugging the response data
    const changingRates: number[] | null = timeSeries !== null && timeSeries !== undefined ? timeSeries.changingRates : null;
    const timeSeriesRangeLabel = timeSeries !== null && changingRates !== null
        ? (changingRates.length <= timeRange.m1 ? timeSeries.dayRangeIndicator : timeSeries.monthRangeIndicator)
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
        }],
    };

    const targetMode = getTargetMode(displayLabel);
    const maxXAxisLabel = getMaxXAxisLabel(timeSeriesRangeLabel.length);

    const plugins = displayLabel ? {
        legend: {
            display: false
        },
        tooltip: {
            mode: targetMode,
            intersect: false,
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
                    color: '#adadad80',
                    tickColor: '#adadad',
                },
                ticks: {
                    // forces step size to be 50 units
                    maxTicksLimit: 4,
                    color: '#a1a1a1',
                },
                border: {
                    dash: [6, 6]
                },
            },
            x: {
                display: displayLabel, // Hide X axis labels
                grid: {
                    color: '#adadad80',
                    tickColor: '#adadad',
                },
                ticks: {
                    maxTicksLimit: maxXAxisLabel,
                    alwaysShowLastTick: true,
                    color: '#a1a1a1',
                },
            },
        },
                fontColor: "blue",
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

const getMaxXAxisLabel = (length: number): number => {
    console.log(length)
    if (length <= timeRange.w1) { // week
        return 7;
    } else if (length <= timeRange.m1) { // month
        return 4;
    } else if (length <= timeRange.m3) { // 3 months
        return 3;
    } else if (length <= timeRange.m6) { // 6 months
        return 6;
    } else if (length <= timeRange.m9) { // 9 months
        return 9;
    } else { // 1 year
        return 12;
    }
}

const timeRange = {
    d1: 2,
    w1: 7,
    m1: 32,
    m3: 31 * 3,
    m6: 31 * 6,
    m9: 31 * 9
}