import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

const GiftCustomization = ({ gift, onComplete, onCancel }) => {
  const { currentUser } = useAuth();
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    giftMessage: '',
    deliveryDate: '',
    assignedStaff: ''
  });

  useEffect(() => {
    loadStaffMembers();
    setMinimumDate();
  }, []);

  const loadStaffMembers = async () => {
    try {
      const staff = await apiService.getStaffMembers();
      setStaffMembers(staff);
    } catch (error) {
      console.error('Failed to load staff members:', error);
    }
  };

  const setMinimumDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, deliveryDate: today }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.recipientName || !formData.recipientEmail || !formData.deliveryDate) {
      alert('Please fill in all required fields: Recipient Name, Recipient Email, and Delivery Date');
      return;
    }

    setLoading(true);

    try {
      const giftOrderData = {
        giftPackage: gift._id,
        recipientName: formData.recipientName,
        recipientEmail: formData.recipientEmail,
        message: formData.giftMessage || '',
        deliveryDate: formData.deliveryDate,
        assignedStaff: formData.assignedStaff || null
      };

      await apiService.createGiftOrder(giftOrderData);
      alert(`Gift package created for ${formData.recipientName}! An email will be sent to ${formData.recipientEmail} with the gift details.`);
      onComplete();
    } catch (error) {
      console.error('Gift order error:', error);
      alert('Failed to create gift order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!currentUser) {
    return (
      <div className="alert alert-warning">
        Please <a href="/login">log in</a> to create gift packages.
      </div>
    );
  }

  return (
    <div className="gift-customization">
      <h3>Customize Your Gift</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="giftPackage" className="form-label">Selected Package</label>
          <input 
            type="text" 
            className="form-control" 
            value={gift.name}
            readOnly 
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="recipientName" className="form-label">Recipient Name *</label>
          <input 
            type="text" 
            className="form-control" 
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="recipientEmail" className="form-label">Recipient Email *</label>
          <input 
            type="email" 
            className="form-control" 
            name="recipientEmail"
            value={formData.recipientEmail}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="giftMessage" className="form-label">Personal Message</label>
          <textarea 
            className="form-control" 
            name="giftMessage"
            rows="3"
            value={formData.giftMessage}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className="mb-3">
          <label htmlFor="deliveryDate" className="form-label">Preferred Delivery Date *</label>
          <input 
            type="date" 
            className="form-control" 
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required 
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="assignedStaff" className="form-label">Assign to Staff Member (Optional)</label>
          <select 
            className="form-control" 
            name="assignedStaff"
            value={formData.assignedStaff}
            onChange={handleChange}
          >
            <option value="">Select staff member (optional)</option>
            {staffMembers.map(staff => (
              <option key={staff._id} value={staff._id}>
                {staff.name}
              </option>
            ))}
          </select>
          <small className="text-muted">Assign a staff member to handle this gift order.</small>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Creating Gift...' : 'Create Gift'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GiftCustomization;