import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

export const StyledPaperComponent = (props) => {
    const { children } = props;
    return (
        <Container maxWidth="m" sx={sxStyle.container}>
            <Paper elevation={3} sx={sxStyle.paper}>
                {children}
            </Paper>
        </Container>
    )
}

const sxStyle = {
    container: { width: "100%", maxWidth: 1000, bgcolor: "background.paper", marginTop: "50px" },
    paper: { m: 2, p: 4 },
};