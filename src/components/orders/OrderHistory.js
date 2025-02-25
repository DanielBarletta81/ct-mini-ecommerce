import { useState, useEffect } from 'react';
import { Table, Button, Alert, Badge } from 'react-bootstrap';
import api from '../../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.getOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error loading orders' });
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.cancelOrder(orderId);
      setMessage({ type: 'success', text: 'Order cancelled successfully' });
      loadOrders();
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error cancelling order' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2>Order History</h2>
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Products</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer.name}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>
                {order.products.map(product => (
                  <div key={product.id}>
                    {product.name} x {product.quantity}
                  </div>
                ))}
              </td>
              <td>${order.totalPrice}</td>
              <td>
                <Badge bg={order.status === 'CANCELLED' ? 'danger' : 'success'}>
                  {order.status}
                </Badge>
              </td>
              <td>
                {order.status !== 'CANCELLED' && (
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderHistory;
