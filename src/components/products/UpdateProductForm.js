import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UpdateProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.getProduct(id);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        setMessage({ type: 'danger', text: 'Error loading product data.' });
        setLoading(false);
      }
    };
    fetchProduct();
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
      const response = await api.updateProduct(id, formData);
      setMessage({ 
        type: 'success', 
        text: `Product ${response.data.name} updated successfully!` 
      });
      setTimeout(() => navigate(`/products/${id}`), 2000);
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error updating product. Please try again.' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2>Update Product</h2>
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

        <Button variant="primary" type="submit" className="me-2">
          Update Product
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/products/${id}`)}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default UpdateProductForm;
