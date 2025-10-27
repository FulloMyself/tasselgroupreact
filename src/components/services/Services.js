import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import BookingForm from './BookingForm';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await apiService.getServices();
      const servicesList = data.services || data.data || data || [];
      setServices(servicesList);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (service) => {
    setSelectedService(service);
  };

  const handleBookingComplete = () => {
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="content-section">
      <div className="container my-5">
        <h2 className="mb-4">Book Our Services</h2>
        
        {!selectedService ? (
          <>
            {services.length === 0 ? (
              <div className="col-12 text-center">
                <div className="alert alert-info">
                  No services available at the moment.
                </div>
              </div>
            ) : (
              <div className="row">
                {services.map(service => (
                  <div key={service._id} className="col-md-6 mb-4">
                    <div className="card service-card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{service.name}</h5>
                        <p className="card-text">
                          {service.description || 'No description available'}
                        </p>
                        <p className="card-text">
                          <strong>Duration:</strong> {service.duration || 'Not specified'}
                        </p>
                        <p className="card-text">
                          <strong>Price:</strong> R {service.price || 0}
                        </p>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleBookService(service)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <BookingForm 
            service={selectedService}
            onComplete={handleBookingComplete}
            onCancel={() => setSelectedService(null)}
          />
        )}
      </div>
    </section>
  );
};

export default Services;