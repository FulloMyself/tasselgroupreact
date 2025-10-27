import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AppProvider } from './contexts/AppContext';
import Navigation from './components/common/Navigation';
import { Navigate } from "react-router-dom";
import Footer from './components/common/Footer';
import Notification from './components/common/Notification';
import Home from './components/Home';
import Shop from './components/shop/Products';
import Services from './components/services/Services';
import Gifts from './components/gifts/GiftPackages';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import Dashboard from './components/dashboard/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import './styles/components.css';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navigation />
            <Notification />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/services" element={<Services />} />
                <Route path="/gifts" element={<Gifts />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;