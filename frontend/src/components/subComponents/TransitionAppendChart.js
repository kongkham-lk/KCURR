import { useState, useEffect } from 'react';
import Collapse from '@mui/material/Collapse';
import { TransitionGroup } from 'react-transition-group';
import HistoricalRateGraph from './HistoricalRateGraph';
import { Box } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';


export default function TransitionAppendChart(props) {
    const { appendChart } = props;
    const [displayChart, setDisplayChart] = useState(null);

    useEffect(() => {
        const currCode = () => <HistoricalRateGraph {...props} removeMarginTop={true} />;
        const handleDisplayChart = () => {
            if (appendChart) {
                setDisplayChart(currCode);
            } else {
                setDisplayChart(null);
            }
        }
        handleDisplayChart();
    }, [appendChart, props])

    const renderGraph = (item) => {
        return (
            <Box sx={{ padding: appendChart ? '16px' : '0px', paddingTop: '0px', opacity: appendChart ? 1 : 0, transition: 'all 5s ease-out' }} >
                {item}
            </Box>
        );
    };

    return (
        <>
            <TableRow>
                <TableCell colSpan={5} sx={{ padding: 0 }} >
                    <TransitionGroup>
                        <Collapse key={displayChart} style={{ transitionDuration: '1000ms' }} >{renderGraph(displayChart)}</Collapse>
                    </TransitionGroup>
                </TableCell>
            </TableRow>
        </>
    );
}