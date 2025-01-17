import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Assuming you will create Banner.css for styling

const Banner = () => {
  return (
    <section className="banner bg-cover bg-center text-white" style={{ backgroundImage: 'url(/images/banner.jpg)' }}>
      <div className="banner-overlay flex justify-center items-center h-screen">
        <div className="banner-content text-center px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our E-Commerce Store</h1>
          <p className="text-lg md:text-xl mb-6">Discover a wide range of products at amazing prices!</p>
          <Link to="/products" className="btn-shop-now bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;
