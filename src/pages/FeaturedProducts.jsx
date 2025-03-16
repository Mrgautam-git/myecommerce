import React, { useEffect, useState } from 'react';
import './Cart.css'; // Make sure to import your CSS file


function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null);     // State to manage error state
       // State to manage cart data
// State for adding to cart
  // Assuming a hardcoded user ID for now

    // Fetch featured products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://ecommbackend-2-f8pa.onrender.com/featured_product');
                if (!response.ok) {
                    throw new Error('Failed to fetch featured products');
                }
                const data = await response.json();
                setProducts(data); // Set the fetched data
                setLoading(false);  // Set loading to false after fetching is done
            } catch (error) {
                setError(error.message); // Capture any errors
                setLoading(false);       // Set loading to false in case of error
            }
        };

        fetchProducts();
    }, []); // Empty dependency array ensures the effect runs only once



    return (
        <div className="featured-products-container">
            <h1>Featured Products</h1>
            {loading ? (
                <p>Loading...</p> // Show a loading message while data is being fetched
            ) : error ? (
                <p>Error: {error}</p> // Show error message if something went wrong
            ) : products.length === 0 ? (
                <p>No featured products available.</p> // If no products are available
            ) : (
                <div className="product-list">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="product-card"
                            style={{ animationDelay: `${Math.random() * 0.5}s` }} // Randomize animation delay for a more dynamic effect
                        >
                            <img
                                src={product.image_url}
                                alt={product.product_name}
                                className="product-image"
                            />
                            <h2>{product.product_name}</h2>
                            <p>{product.description}</p>                         
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FeaturedProducts;
