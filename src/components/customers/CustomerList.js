import { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.getCustomers();
        console.log('API Response:', response); // Add this to see the data
        setCustomers(response.data);
        setLoading(false);
      } catch (error) {
        console.log('Error:', error); 
        setError('Failed to load customers');
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customers</h2>
        <Button onClick={() => navigate('/customers/new')}>Add New Customer</Button>
      </div>
      {location.state?.message && (
        <Alert variant="success">{location.state.message}</Alert>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <Button 
                  variant="info" 
                  size="sm" 
                  className="me-2"
                  onClick={() => navigate(`/customers/${customer.id}`)}
                >
                  View
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => navigate(`/customers/edit/${customer.id}`)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomerList;
