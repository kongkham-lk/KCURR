import { useState, useEffect } from 'react';
import Collapse from '@mui/material/Collapse';
import { TransitionGroup } from 'react-transition-group';
import RateChangeGraphFeature from './RateChangeGraphFeature';
import { Box } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';


export default function TransitionAppendChart(props) {
    const { appendChart, currencyRateData, isDisplaySM, isDisplayMD } = props;
    const [displayChart, setDisplayChart] = useState(null);

    useEffect(() => {
        const currCode = () => <RateChangeGraphFeature {...props} removeMarginTop={true} />;
        const handleDisplayChart = () => {
            if (appendChart) {
                // console.log(">>> append row!!!")
                setDisplayChart(currCode);
            } else {
                // console.log("<<< clear row!!!")
                setDisplayChart(null);
            }
        }
        handleDisplayChart();
    }, [appendChart, props])

    const renderGraph = (item) => {
        return (
            <Box sx={{ padding: appendChart ? isDisplaySM ? '0px 0px 10px 10px' : '0px 16px 16px' : '0px', opacity: appendChart ? 1 : 0, transition: 'all 0.6s ease-out' }} >
                {item}
            </Box>
        );
    };
    // console.log("key: ", (currencyRateData.targetCurr + "_Chart"))
    return (
        <>
            {/* {console.log("Include hidden rows!!!")} */}
            <TableRow key={currencyRateData.targetCurr + "_ChartRow"}>
                <TableCell key={currencyRateData.targetCurr + "_ChartCell"} colSpan={6} sx={{ padding: 0, border: 'none' }} >
                    <TransitionGroup style={{marginRight: isDisplaySM && '-25px', width: isDisplaySM &&  '99%'}}>
                        <Collapse key={currencyRateData.targetCurr + "Chart"} style={{width: !isDisplaySM && '99%', transitionDuration: '600ms' }} >{renderGraph(displayChart)}</Collapse>
                    </TransitionGroup>
                </TableCell>
            </TableRow>
        </>
    );
}