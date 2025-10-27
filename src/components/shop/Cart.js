import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { currentUser } = useAuth();
  const [selectedStaff, setSelectedStaff] = useState('');
  const [staffMembers, setStaffMembers] = useState([]);

  const handleCheckout = async (paymentMethod) => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getCartTotal(),
        type: 'order',
        staffId: selectedStaff || null
      };

      if (paymentMethod === 'online') {
        const paymentResponse = await apiService.initiatePayment(orderData);
        if (paymentResponse.success) {
          // Redirect to Payfast
          window.location.href = paymentResponse.payfastUrl;
        }
      } else {
        const manualResponse = await apiService.createManualOrder(orderData);
        if (manualResponse.success) {
          clearCart();
          alert('Order placed successfully! Confirmation email sent.');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process order: ' + error.message);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="mt-5">
      <h3>Your Cart</h3>
      <div className="mb-3">
        {cart.map((item, index) => (
          <div key={index} className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <span>{item.name}</span>
              <div className="btn-group btn-group-sm ms-2">
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => updateCartQuantity(index, -1)}
                >
                  -
                </button>
                <span className="btn btn-outline-secondary disabled">{item.quantity}</span>
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => updateCartQuantity(index, 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <span>R {(item.price * item.quantity).toFixed(2)}</span>
              <button 
                className="btn btn-sm btn-outline-danger ms-2" 
                onClick={() => removeFromCart(index)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        
        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
          <strong>Total</strong>
          <strong>R {getCartTotal().toFixed(2)}</strong>
        </div>
      </div>

      {/* Staff assignment */}
      <div className="mb-3">
        <label htmlFor="cartStaff" className="form-label">
          Staff Member Assisting You (Optional)
        </label>
        <select 
          className="form-control" 
          id="cartStaff"
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
        >
          <option value="">Select staff member (optional)</option>
          {staffMembers.map(staff => (
            <option key={staff._id} value={staff._id}>
              {staff.name}
            </option>
          ))}
        </select>
        <small className="text-muted">
          Selecting a staff member helps us track who provided excellent service.
        </small>
      </div>

      <div className="d-grid gap-2">
        <button 
          className="btn btn-success" 
          onClick={() => handleCheckout('online')}
        >
          <i className="fas fa-credit-card me-2"></i>Pay Online
        </button>
        <button 
          className="btn btn-outline-primary" 
          onClick={() => handleCheckout('manual')}
        >
          <i className="fas fa-envelope me-2"></i>Email Order (Pay Later)
        </button>
      </div>
    </div>
  );
};

export default Cart;