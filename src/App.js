import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';

import CustomerForm from './components/customers/CustomerForm';
import CustomerDetails from './components/customers/CustomerDetails';
import UpdateCustomerForm from './components/customers/UpdateCustomerForm';
import ProductForm from './components/products/ProductForm';
import ProductDetails from './components/products/ProductDetails';
import UpdateProductForm from './components/products/UpdateProductForm';
//import OrderForm from './components/orders/OrderForm';
//import OrderDetails from './components/orders/OrderDetails';
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
        
          <Route path="/customers/:id" element={<CustomerDetails />} />

          <Route path="/customers/:id/edit" element={<UpdateCustomerForm />} />
          <Route path="/products/new" element={<ProductForm />} />  
          <Route path="/products/:id" element={<ProductDetails />} /> 
          <Route path="/products/edit/:id" element={<UpdateProductForm />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
