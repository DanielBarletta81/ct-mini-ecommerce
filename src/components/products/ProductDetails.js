import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Modal } from 'react-bootstrap';
import api from '../../services/api';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const loadProductDetails = useCallback(async () => {
    try {
      const response = await api.getProduct(id);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load product details');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProductDetails();
  }, [loadProductDetails]);

  const handleDelete = async () => {
    try {
      await api.deleteProduct(id);
      navigate('/products', { state: { message: 'Product deleted successfully!' } });
    } catch (error) {
      setError('Failed to delete product');
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!product) return <Alert variant="info">No product found</Alert>;

  return (
    <div className="p-4">
      <Card>
        <Card.Header as="h5">Product Details</Card.Header>
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <div className="mb-3">
            <strong>Price: </strong>
            ${product.price}
          </div>
          <div className="mb-3">
            <strong>Product ID: </strong>
            {product.id}
          </div>
          <Button 
            variant="primary" 
            className="me-2"
            onClick={() => navigate(`/products/edit/${product.id}`)}
          >
            Edit Product
          </Button>
          <Button 
            variant="danger" 
            className="me-2"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Product
          </Button>
          <Button 
            variant="secondary"
            onClick={() => navigate('/products')}
          >
            Back to Products
          </Button>
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete product {product.name}? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductDetails;
