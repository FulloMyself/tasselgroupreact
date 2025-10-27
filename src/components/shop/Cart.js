import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

const Cart = () => {
    const { cart, updateCartQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
    const { currentUser } = useAuth();
    const [selectedStaff, setSelectedStaff] = useState('');
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);

    useEffect(() => {
        loadStaffMembers();
    }, []);

    const loadStaffMembers = async () => {
        try {
            const staff = await apiService.getStaffMembers();
            setStaffMembers(staff);
        } catch (error) {
            console.error('Failed to load staff members:', error);
        }
    };

    // Function to redirect to Payfast using form submission
    const redirectToPayfast = (payfastUrl, payfastData) => {
        // Create a form element
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payfastUrl;
        form.style.display = 'none';

        // Add all Payfast data as hidden inputs
        Object.keys(payfastData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = payfastData[key];
            form.appendChild(input);
        });

        // Add form to page and submit
        document.body.appendChild(form);
        console.log('🔄 Submitting to Payfast with data:', payfastData);
        form.submit();
    };

    // In your existing Cart component - UPDATE THIS PART:
    const handleCheckout = async (paymentMethod) => {
  if (cart.length === 0 || !currentUser) {
    alert(cart.length === 0 ? 'Your cart is empty' : 'Please log in to checkout');
    return;
  }

  setLoading(true);

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
      staffId: selectedStaff || null,
      customer: {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      },
      merchantReference: `TASSEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      returnUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/payment/cancelled`,
      notifyUrl: `${window.location.origin}/api/payment/notify`
    };

    console.log('🛒 Enhanced checkout data:', orderData);

    if (paymentMethod === 'online') {
      const paymentResponse = await apiService.initiatePayment(orderData);
      
      // DEBUG: Log the full response to see what's actually returned
      console.log('🔍 FULL PAYMENT RESPONSE:', paymentResponse);
      console.log('🔍 Response keys:', Object.keys(paymentResponse));
      console.log('🔍 Response type:', typeof paymentResponse);
      
      // Check what properties actually exist
      if (paymentResponse.payfastData) {
        console.log('✅ Payfast data found:', paymentResponse.payfastData);
        redirectToPayfast(paymentResponse.payfastUrl, paymentResponse.payfastData);
      } else if (paymentResponse.payfastUrl) {
        console.log('✅ Payfast URL found:', paymentResponse.payfastUrl);
        // Maybe it's a direct URL redirect
        window.location.href = paymentResponse.payfastUrl;
      } else if (paymentResponse.url) {
        console.log('✅ URL found:', paymentResponse.url);
        window.location.href = paymentResponse.url;
      } else {
        // Log the actual response to see what we're getting
        console.log('❌ Unexpected response structure:', paymentResponse);
        throw new Error('Payment service returned unexpected response format');
      }
    } else {
      const manualResponse = await apiService.createManualOrder(orderData);
      if (manualResponse.success) {
        clearCart();
        setShowPaymentOptions(false);
        alert('Order placed successfully! Confirmation email sent.');
      }
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Failed to process order: ' + error.message);
  } finally {
    setLoading(false);
  }
};

    const showPaymentModal = () => {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        setShowPaymentOptions(true);
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
                                    disabled={loading}
                                >
                                    -
                                </button>
                                <span className="btn btn-outline-secondary disabled">{item.quantity}</span>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => updateCartQuantity(index, 1)}
                                    disabled={loading}
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
                                disabled={loading}
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
                    disabled={loading}
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
                    className="btn btn-primary"
                    onClick={showPaymentModal}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Processing...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-shopping-cart me-2"></i>Proceed to Checkout
                        </>
                    )}
                </button>
            </div>

            {/* Payment Options Modal */}
            {showPaymentOptions && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select Payment Method</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowPaymentOptions(false)}
                                    disabled={loading}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleCheckout('online')}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-credit-card me-2"></i>Pay Online with Payfast
                                    </button>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => handleCheckout('manual')}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-envelope me-2"></i>Email Order (Pay Later)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;