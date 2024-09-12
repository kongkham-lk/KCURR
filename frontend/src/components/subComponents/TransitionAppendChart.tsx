import { useState, useEffect } from 'react';
import Collapse from '@mui/material/Collapse';
import { TransitionGroup } from 'react-transition-group';
import RateChangeGraphFeature from './RateChangeGraphFeature';
import { Box } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import React from 'react';
import { type ConversionData } from '../../lib/types';

type TransitionAppendChartProps = {
    appendChart: boolean;
    isDisplaySM: boolean;
    currencyRateData: ConversionData | null;
    removeMarginTop?: boolean
    isChartFeatureEnable? : boolean
}

export default function TransitionAppendChart(props: TransitionAppendChartProps) {
    const { appendChart, currencyRateData, isDisplaySM } = props;
    const [displayChart, setDisplayChart] = useState<React.JSX.Element | null>(null);

    useEffect(() => {
        const currListDisplay = () => <RateChangeGraphFeature {...props} removeMarginTop={true} passDownUpdateRequestFlag={false} />;
        const handleDisplayChart = () => {
            if (appendChart) {
                // console.log(">>> append row!!!")
                setDisplayChart(currListDisplay);
            } else {
                // console.log("<<< clear row!!!")
                setDisplayChart(null);
            }
        }
        handleDisplayChart();
    }, [appendChart, props])

    const renderGraph = (item: React.JSX.Element | null) => {
        return (
            <Box sx={appendChart ? isDisplaySM ? sxStyle.renderGraphSm : sxStyle.renderGraphLg : sxStyle.renderNon} >
                {item}
            </Box>
        );
    };

    const targetKey = currencyRateData !== null ? currencyRateData.targetCurr : "";

    // console.log("key: ", (currencyRateData.targetCurr + "_Chart"))
    return (
        <>
            {/* {console.log("Include hidden rows!!!")} */}
            <TableRow key={targetKey + "_ChartRow"}>
                <TableCell key={targetKey + "_ChartCell"} colSpan={5} sx={sxStyle.tableCell} >
                    <TransitionGroup style={isDisplaySM ? style.TransitionGroupSm : style.TransitionGroupLg}>
                        <Collapse key={targetKey + "Chart"} sx={isDisplaySM ? style.CollapseSm : style.CollapseLg} >{renderGraph(displayChart)}</Collapse>
                    </TransitionGroup>
                </TableCell>
            </TableRow>
        </>
    );
}

const commonStyle = {
    smallerWidth: { width: '99%' },
    transition: { transition: 'all 0.6s ease-out' },
    transitionDuration: { transitionDuration: '600ms' },
}

const sxStyle = {
    renderGraphSm: { padding: '0px 0px 10px 10px', opacity: 1, ...commonStyle.transition },
    renderGraphLg: { padding: '0px 16px 16px', opacity: 1, ...commonStyle.transition },
    renderNon: { padding: '0px', opacity: 0, ...commonStyle.transition },
    tableCell: { padding: 0, border: 'none' }
}

const style = {
    TransitionGroupSm: { marginRight: '-25px', ...commonStyle.smallerWidth },
    TransitionGroupLg: { marginRight: '0px', ...commonStyle.smallerWidth },
    CollapseSm: { ...commonStyle.transitionDuration },
    CollapseLg: { ...commonStyle.transitionDuration, ...commonStyle.smallerWidth },
}