import { useState, useEffect } from 'react';
import { Form, Button, Alert, Table } from 'react-bootstrap';
import api from '../../services/api';

const OrderForm = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    orderDate: new Date().toISOString().split('T')[0],
    products: []
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, productsResponse] = await Promise.all([
          api.getCustomers(),
          api.getProducts()
        ]);
        setCustomers(customersResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        setMessage({ type: 'danger', text: 'Error loading data' });
      }
    };
    fetchData();
  }, []);

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts(selectedProducts.map(product => 
      product.id === productId ? { ...product, quantity: parseInt(quantity) } : product
    ));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => 
      total + (product.price * product.quantity), 0
    ).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      ...formData,
      products: selectedProducts.map(p => ({ productId: p.id, quantity: p.quantity })),
      totalPrice: calculateTotal()
    };

    try {
      const response = await api.createOrder(orderData);
      setMessage({ type: 'success', text: `Order created successfully! Order ID: ${response.data.id}` });
      setSelectedProducts([]);
      setFormData({ ...formData, customerId: '' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error creating order' });
    }
  };

  return (
    <div className="p-4">
      <h2>Place New Order</h2>
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Customer</Form.Label>
          <Form.Select 
            value={formData.customerId}
            onChange={(e) => setFormData({...formData, customerId: e.target.value})}
            required
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Order Date</Form.Label>
          <Form.Control
            type="date"
            value={formData.orderDate}
            onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Add Product</Form.Label>
          <Form.Select onChange={(e) => handleProductSelect(e.target.value)}>
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {selectedProducts.length > 0 && (
          <Table striped bordered hover className="mb-3">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    />
                  </td>
                  <td>${(product.price * product.quantity).toFixed(2)}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => setSelectedProducts(selectedProducts.filter(p => p.id !== product.id))}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                <td colSpan="2"><strong>${calculateTotal()}</strong></td>
              </tr>
            </tbody>
          </Table>
        )}

        <Button variant="primary" type="submit" disabled={selectedProducts.length === 0}>
          Place Order
        </Button>
      </Form>
    </div>
  );
};

export default OrderForm;
