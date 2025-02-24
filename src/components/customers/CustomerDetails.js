import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Alert } from 'react-bootstrap';

import api from '../../services/api';

const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomerDetails();
  }, [id]);

  const loadCustomerDetails = async () => {
    try {
      const response = await api.getCustomer(id);
      setCustomer(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load customer details');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!customer) return <Alert variant="info">No customer found</Alert>;

  return (
    <div className="p-4">
      <Card>
        <Card.Header as="h5">Customer Details</Card.Header>
        <Card.Body>
          <Card.Title>{customer.name}</Card.Title>
          <div className="mb-3">
            <strong>Email: </strong>
            {customer.email}
          </div>
          <div className="mb-3">
            <strong>Phone: </strong>
            {customer.phoneNumber}
          </div>
          <div className="mb-3">
            <strong>Customer ID: </strong>
            {customer.id}
          </div>
          <Button 
            variant="primary" 
            className="me-2"
            onClick={() => navigate(`/customers/edit/${customer.id}`)}
          >
            Edit Customer
          </Button>
          <Button 
            variant="secondary"
            onClick={() => navigate('/customers')}
          >
            Back to Customers
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CustomerDetails;
