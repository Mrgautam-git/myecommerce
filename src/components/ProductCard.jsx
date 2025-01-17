import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card border border-gray-300 rounded-lg overflow-hidden shadow-lg">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <p className="mt-2 text-lg">₹{product.price}</p>
        <Link to={`/product/${product.id}`} className="mt-4 inline-block bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
