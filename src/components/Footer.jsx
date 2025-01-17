import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 E-Commerce Store. All Rights Reserved.</p>
        <div className="mt-4">
          <a href="/about" className="mx-2 text-gray-400 hover:text-white">About Us</a>
          <a href="/contact" className="mx-2 text-gray-400 hover:text-white">Contact</a>
          <a href="/terms" className="mx-2 text-gray-400 hover:text-white">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
