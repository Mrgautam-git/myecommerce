import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Categories from './Categories';
import FeaturedProducts from './FeaturedProducts';
import Banner from '../components/Banner';
import './Home.css'; // Assuming you've already styled the Home page in this file
import { auth } from '../components/Firebase';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true); // Loading state for categories
  const [error, setError] = useState(''); // Error state to store error messages
  const [products, setProducts] = useState([]);
  const [selectedCategory, SelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setCart] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://ecommbackend-2-f8pa.onrender.com/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError('Error fetching categories. Please try again.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = selectedCategory
          ? `https://ecommbackend-2-f8pa.onrender.com/products?category_id=${selectedCategory}`
          : 'https://ecommbackend-2-f8pa.onrender.com/products';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const addToCart = async (product) => {
    try {
      const user = auth.currentUser; // Get the current logged-in user

      if (!user) {
        setError('Please log in to add items to the cart');
        return;
      }

      setAddingToCart(product.id); // Disable button for the product being added

      // Prepare the data to be sent to the server
      const cartData = {
        firebase_user_id: user.uid, // Firebase user ID from auth
        user_id: 1, // Set user_id as needed. Ensure it's passed here.
        product_id: product.id,
        quantity: 1, // Assuming you want to add 1 product to the cart
      };

      console.log("Cart Data Sent:", cartData); // Debug: Log cart data to verify it's correct

      // Send the data to your backend server to update the cart
      const response = await fetch('https://ecommbackend-2-f8pa.onrender.com/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Inform the server of JSON payload
        },
        body: JSON.stringify(cartData), // Send the cart data as JSON
      });

      if (!response.ok) {
        // Handle errors from the server response
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product to cart');
      }

      const responseData = await response.json(); // Parse the successful response

      alert('Product added to cart successfully!'); // Optional success message
      console.log('Cart updated:', responseData);

      // Update cart state to reflect the change in frontend cart
      setCart((prevCart) => {
        const existingProduct = prevCart.find((item) => item.id === product.id);
        if (existingProduct) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { ...product, quantity: 1 }];
      });

    } catch (error) {
      console.error('Error adding to cart:', error.message); // Log the error for debugging
      setError(error.message); // Display the error to the user
    } finally {
      setAddingToCart(null); // Re-enable the button after operation
    }
  };

  return (
    <div className="home">
      {/* Products Section */}
      <div className="categoryfilter">
        <div className="category-buttons">
          <button onClick={() => SelectedCategory(null)} className="category-btn">
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => SelectedCategory(category.id)}
              className="category-btn"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <Banner />
      <Categories

        categories={categories}
        loading={loadingCategories}
        error={error}
        onSelectCategory={SelectedCategory}
      />
      <FeaturedProducts />
      <div className="product">
        <h2>Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="products">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/products/${product.id}`} className="view-details-btn">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>₹{Number(product.price) ? Number(product.price).toFixed(2) : 'N/A'}</p>
                    </div>

                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={addingToCart === product.id}
                    className={`add-to-cart-btn ${addingToCart === product.id ? 'loading' : ''}`}
                  >
                    {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
