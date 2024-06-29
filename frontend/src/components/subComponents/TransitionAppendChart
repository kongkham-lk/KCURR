
import { useState, useEffect, useMemo } from 'react';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransitionGroup } from 'react-transition-group';
import HistoricalRateGraph from './HistoricalRateGraph';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const currCode = "usd";

export default function TransitionAppendChart(props) {
    // const { isOpen } = props;
    const show = true;
    const isOutLineTheme = false;
    const isDisplaySM = false;
    const [displayChart, setDisplayChart] = useState(currCode);

    const renderGraph = (item) => {
        return (
            // <HistoricalRateGraph {...props} />
            <div>{item}</div>
        );
    }
    
    useEffect(() => {
            if (show) {
                setDisplayChart(currCode);
            } else {
                setDisplayChart("");
            }
    }, [show])

    // const addFruitButton = (
    //     <Button
    //         variant="contained"
    //         onClick={() => handleDisplayChart(currCode)}
    //     >
    //         Add fruit to basket
    //     </Button>
    // );

    const Item = styled(Paper)(({ theme }) => ({
        height: 'auto',
        // margin: isDisplaySM ? '20px' : '32px',
        padding: isDisplaySM ? '25px' : '32px'
    }));

    const outlinedProps = {
        variant: 'outlined',
        square: true,
    };

    const elevationProps = {
        variant: 'elevation',
        elevation: 8,
    };

    return (
        <Item key="Convertor" {...(isOutLineTheme ? outlinedProps : elevationProps)} sx={{width: '-webkit-fill-available'}} >
            {/* {addFruitButton} */}
            <TransitionGroup style={{ marginTop: '10px' }}>
                <Collapse key={displayChart}>{renderGraph(displayChart)}</Collapse>
            </TransitionGroup>
        </Item>
    );
}