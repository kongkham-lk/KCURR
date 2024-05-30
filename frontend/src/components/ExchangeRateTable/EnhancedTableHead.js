import PropTypes from 'prop-types';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { visuallyHidden } from '@mui/utils';

export default function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, isMobileScreen } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow style={style.TableRow}>
                {(isMobileScreen ? headCells = headCells.filter(item => item.id !== 'change') : headCells).map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        style={isMobileScreen ? style.TableCell.sm : style.TableCell.lg}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            style={{ marginLeft: headCell.id === 'targetCurr' ? (isMobileScreen ? "0px" : "25px") : "-30px", 
                                     marginRight: headCell.id === 'targetCurr' && "-20px",
                                     padding: isMobileScreen && "0px" }}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell style={isMobileScreen ? style.TableCell.sm : style.TableCell.lg} align="right" >
                    Chart (24h)
                </TableCell>
                <TableCell style={{padding: isMobileScreen && "0px 8px 8px 0px"}} align="right" >
                    {isMobileScreen ? "Del" : "Delete"}
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

let headCells = [
    {
        id: 'targetCurr',
        numeric: false,
        disablePadding: true,
        label: 'Countries',
    },
    {
        id: 'latestRate',
        numeric: true,
        disablePadding: false,
        label: 'Amount',
    },
    {
        id: 'change',
        numeric: true,
        disablePadding: false,
        label: 'Change (24h)',
    },
];

const style = {
    TableRow: { width: "100%" },
    TableCell: {
        lg: { width: "20%" },
        sm: { width: "10%", padding: "0px 0px 10px 10px" }
    },
}