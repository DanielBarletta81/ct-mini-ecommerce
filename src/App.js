import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import CustomerForm from '../components/customers/CustomerForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">CT Mini E-Commerce</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/customers">Customers</Nav.Link>
              <Nav.Link href="/products">Products</Nav.Link>
              <Nav.Link href="/orders">Orders</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<h1>Welcome to CT Mini E-Commerce</h1>} />
          <Route path="/customers/new" element={<CustomerForm />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
