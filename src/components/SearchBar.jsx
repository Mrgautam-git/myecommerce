import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import './searchbar.css';

const SearchBar = ({ productData, setSearchTerm }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [fuse, setFuse] = useState(null);
  const navigate = useNavigate();

  // Initialize Fuse.js when productData changes
  useEffect(() => {
    if (productData && productData.length > 0) {
      setFuse(new Fuse(productData, { keys: ['name'], threshold: 0.4 }));
    }
  }, [productData]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

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
  );
};

export default SearchBar;
