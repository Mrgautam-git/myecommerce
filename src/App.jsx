import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Singup';

// Pages
import Loading from './pages/loading'; // Loading component
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './components/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import FeaturedProducts from './pages/FeaturedProducts';

// Admin Pages

// Other Components
import NotFound from './pages/NotFound';

const App = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Simulate loading for 3 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulate 3 seconds of loading time
  }, []);
  const [user, setUser] = useState(null);  // State to store the logged-in user

  // Fetch the user from localStorage if they are already logged in
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <Router>
      {/* Conditional Rendering: If loading, show the Loading component, else show the content */}
      {isLoading ? <Loading /> : (
        <>
          <Navbar setSearchTerm={setSearchTerm} />          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products searchTerm={searchTerm} />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/banner" element={<Banner />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/featured-products" element={<FeaturedProducts />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            {/* Catch-all for 404s */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Footer is common across pages */}
          <Footer />
        </>
      )}
    </Router>
  );
};

export default App;
