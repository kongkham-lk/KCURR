import './App.css';
import * as React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor';

// import CurrType from './components/CurrType';

function App() {
  return (
    <div className="App">
      <MainNav />
      <Container maxWidth="m" sx={{ width: "100%", maxWidth: 1000, bgcolor: "background.paper", marginTop: "50px" }}>
        <Paper className="paper">
          <Convertor />
        </Paper>
        </Container>
    </div>
  );
}

export default App;
