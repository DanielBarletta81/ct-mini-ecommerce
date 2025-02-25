import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: ''
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
      const response = await api.createProduct(formData);
      setMessage({ 
        type: 'success', 
        text: `Product ${response.data.name} created successfully!` 
      });
      setFormData({ name: '', price: '' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error creating product. Please try again.' });
    }
  };

  return (
    <div className="p-4">
      <h2>Create New Product</h2>
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
            placeholder="Enter product name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="Enter price"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Product
        </Button>
      </Form>
    </div>
  );
};

export default ProductForm;
