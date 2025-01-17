import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import './Navbar.css';

const Navbar = ({ setSearchTerm, productData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [fuse, setFuse] = useState(null);
  const navigate = useNavigate();

  // Initialize Fuse.js when productData changes
  useEffect(() => {
    if (productData && productData.length > 0) {
      // Create a new Fuse instance with multiple keys (name and category)
      setFuse(new Fuse(productData, { keys: ['name', 'category'], threshold: 0.4 }));
    }
  }, [productData]); // This hook runs whenever `productData` changes

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Perform search if Fuse is initialized
    if (query && fuse) {
      const results = fuse.search(query).map((result) => result.item);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchQuery);
    navigate(`/products?search=${searchQuery}`);
  };

  return (
    <nav className="navbar bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          E-Commerce Store
        </Link>

        <form onSubmit={handleSearchSubmit} className="search-bar flex items-center relative">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 rounded-l-md border border-gray-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>

          {searchResults.length > 0 && (
  <div className="absolute top-full left-0 w-full bg-white text-black border mt-1 max-h-40 overflow-y-auto z-10">
    {searchResults.map((product) => (
      <div
        key={product.id}
        onClick={() => {
          setSearchQuery(product.name);
          setSearchResults([]);
          navigate(`/products/${product.id}`);
        }}
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {product.name}
      </div>
    ))}
  </div>
)}

        </form>

        <div className="space-x-6">
          <Link to="/" className="hover:text-gray-400">Home</Link>
          <Link to="/products" className="hover:text-gray-400">Products</Link>
          <Link to="/cart" className="hover:text-gray-400">Cart</Link>
          <Link to="/checkout" className="hover:text-gray-400">Checkout</Link>
          <Link to="/profile" className="hover:text-gray-400">Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
