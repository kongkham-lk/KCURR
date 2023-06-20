// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

// import CurrType from './components/CurrType';

function App() {
  return (
    <div className="App">
      <MainNav />
      
    <Container className="mt-5">
      {/* <form onSubmit={handleSubmit} className="Converter"> */}
      <Card style={{
        width: '100%',
        margin: 'auto'
      }}>
        <Card.Body>
      <Convertor />
      {/* <CurrType /> */}
      
      </Card.Body>
      </Card>
    </Container>
    </div>
  );
}

export default App;
