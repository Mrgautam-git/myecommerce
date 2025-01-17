import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage error state

  useEffect(() => {
    // Fetch products from FakestoreAPI
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data); // Set the fetched products
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message); // Handle any errors
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to ensure the effect runs only once

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error fetching products: {error}</div>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
          />
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <p><strong>Price: </strong>${product.price}</p>
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
