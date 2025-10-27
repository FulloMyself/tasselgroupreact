import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { apiService } from '../../services/api';
import Cart from './Cart';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await apiService.getProducts();
      const productsList = data.products || data.data || data || [];
      setProducts(productsList);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!currentUser) {
      alert('Please log in to add items to your cart');
      return;
    }
    addToCart(product);
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
        <h2 className="mb-4">Our Products</h2>
        
        {products.length === 0 ? (
          <div className="col-12 text-center">
            <div className="alert alert-info">
              No products available at the moment.
            </div>
          </div>
        ) : (
          <div className="row">
            {products.map(product => (
              <div key={product._id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
                    className="product-image card-img-top" 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text flex-grow-1">
                      {product.description || 'No description available'}
                    </p>
                    <p className="card-text"><strong>R {product.price || 0}</strong></p>
                    <button 
                      className="btn btn-primary mt-auto" 
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Cart />
      </div>
    </section>
  );
};

export default Products;