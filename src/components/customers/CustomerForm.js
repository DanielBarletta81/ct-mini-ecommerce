import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from './services/api';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createCustomer(formData);
      setMessage({ type: 'success', text: 'Customer created successfully!' });
      setFormData({ name: '', email: '', phoneNumber: '' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error creating customer. Please try again.' });
    }
  };

  return (
    <div className="p-4">
      <h2>Create New Customer</h2>
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

        <Button variant="primary" type="submit">
          Create Customer
        </Button>
      </Form>
    </div>
  );
};

export default CustomerForm;
