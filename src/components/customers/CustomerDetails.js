
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Modal } from 'react-bootstrap';
import api from '../../services/api';

const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const loadCustomerDetails = useCallback(async () => {
    try {
      const response = await api.getCustomer(id);
      setCustomer(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load customer details');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCustomerDetails();
  }, [loadCustomerDetails]);

  const handleDelete = async () => {
    try {
      await api.deleteCustomer(id);
      navigate('/customers', { state: { message: 'Customer deleted successfully!' } });
    } catch (error) {
      setError('Failed to delete customer');
      setShowDeleteModal(false);
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
            variant="danger" 
            className="me-2"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Customer
          </Button>
          <Button 
            variant="secondary"
            onClick={() => navigate('/customers')}
          >
            Back to Customers
          </Button>
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete customer {customer.name}? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Customer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerDetails;
