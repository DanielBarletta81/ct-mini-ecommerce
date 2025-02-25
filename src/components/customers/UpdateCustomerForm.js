import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UpdateCustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.getCustomer(id);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        setMessage({ type: 'danger', text: 'Error loading customer data.' });
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.updateCustomer(id, formData);
      setMessage({ 
        type: 'success', 
        text: `Customer ${response.data.name} updated successfully!` 
      });
      setTimeout(() => navigate(`/customers/${id}`), 2000);
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error updating customer. Please try again.' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2>Update Customer</h2>
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter customer name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="me-2">
          Update Customer
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/customers/${id}`)}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default UpdateCustomerForm;
