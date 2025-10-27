import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

const BookingForm = ({ service, onComplete, onCancel }) => {
  const { currentUser } = useAuth();
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    assignedStaff: '',
    specialRequests: ''
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
    setFormData(prev => ({ ...prev, date: today }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.assignedStaff) {
      alert('Please select date, time, and staff member for your booking');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        service: service._id,
        date: formData.date,
        time: formData.time,
        assignedStaff: formData.assignedStaff,
        specialRequests: formData.specialRequests || '',
        status: 'confirmed'
      };

      await apiService.createBooking(bookingData);
      alert('Booking confirmed! We look forward to seeing you.');
      onComplete();
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking: ' + error.message);
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
        Please <a href="/login">log in</a> to book services.
      </div>
    );
  }

  return (
    <div className="booking-form">
      <h3>Complete Your Booking</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="serviceName" className="form-label">Service</label>
          <input 
            type="text" 
            className="form-control" 
            value={service.name}
            readOnly 
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Date</label>
          <input 
            type="date" 
            className="form-control" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required 
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="time" className="form-label">Time</label>
          <select 
            className="form-control" 
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          >
            <option value="">Select a time</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="14:00">02:00 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="16:00">04:00 PM</option>
          </select>
        </div>
        
        <div className="mb-3">
          <label htmlFor="assignedStaff" className="form-label">Preferred Staff Member</label>
          <select 
            className="form-control" 
            name="assignedStaff"
            value={formData.assignedStaff}
            onChange={handleChange}
            required
          >
            <option value="">Select a staff member</option>
            {staffMembers.map(staff => (
              <option key={staff._id} value={staff._id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label htmlFor="specialRequests" className="form-label">Special Requests (Optional)</label>
          <textarea 
            className="form-control" 
            name="specialRequests"
            rows="3"
            value={formData.specialRequests}
            onChange={handleChange}
          ></textarea>
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
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;