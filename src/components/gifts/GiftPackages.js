import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import GiftCustomization from './GiftCustomization';

const GiftPackages = () => {
  const [giftPackages, setGiftPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState(null);

  useEffect(() => {
    loadGiftPackages();
  }, []);

  const loadGiftPackages = async () => {
    try {
      let data;
      try {
        data = await apiService.getGiftPackages();
      } catch (error) {
        console.log('Gift packages endpoint not available, trying services as fallback');
        data = await apiService.getServices();
        if (data.services) {
          data.giftPackages = data.services.map(service => ({
            ...service,
            basePrice: service.price,
            includes: [service.description]
          }));
        }
      }
      
      const packages = data.giftPackages || data.data || data || [];
      setGiftPackages(packages);
    } catch (error) {
      console.error('Failed to load gift packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomizeGift = (gift) => {
    setSelectedGift(gift);
  };

  const handleGiftComplete = () => {
    setSelectedGift(null);
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
        <h2 className="mb-4">Custom Gift Services</h2>
        <p className="lead">Create the perfect gift package for your loved ones with our customizable options.</p>

        {!selectedGift ? (
          <>
            {giftPackages.length === 0 ? (
              <div className="col-12 text-center">
                <div className="alert alert-info">
                  No gift packages available at the moment.
                </div>
              </div>
            ) : (
              <div className="row">
                {giftPackages.map(gift => {
                  const includesList = Array.isArray(gift.includes)
                    ? gift.includes
                    : [gift.description || 'No details available'];

                  return (
                    <div key={gift._id} className="col-md-4 mb-4">
                      <div className="card h-100">
                        <img 
                          src={gift.image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
                          className="product-image card-img-top" 
                          alt={gift.name}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                          }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{gift.name}</h5>
                          <p className="card-text flex-grow-1">
                            {gift.description || 'No description available'}
                          </p>
                          <p className="card-text"><strong>Includes:</strong></p>
                          <ul className="flex-grow-1">
                            {includesList.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                          <p className="card-text">
                            <strong>From R {gift.basePrice || gift.price || 0}</strong>
                          </p>
                          <button 
                            className="btn btn-primary mt-auto"
                            onClick={() => handleCustomizeGift(gift)}
                          >
                            Customize Gift
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <GiftCustomization 
            gift={selectedGift}
            onComplete={handleGiftComplete}
            onCancel={() => setSelectedGift(null)}
          />
        )}
      </div>
    </section>
  );
};

export default GiftPackages;