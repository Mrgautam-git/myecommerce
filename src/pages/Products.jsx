import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import './Product.css';
import { auth } from '../components/Firebase';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setCart] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]); // To store the list of categories
  
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://ecommbackend-2-f8pa.onrender.com/categories'); // Fetch your categories from backend
        const data = await response.json();
        setCategories(data); // Store categories in state
      } catch (err) {
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Extract search query and category from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    setSearchQuery(query || ''); // Set the search query

    const category = params.get('category_id');
    setSelectedCategory(category || null); // Set the selected category if exists
  }, [location.search]);

  // Fetch products based on search query or category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `https://ecommbackend-2-f8pa.onrender.com/products?search=${encodeURIComponent(
          searchQuery
        )}&category_id=${selectedCategory || ''}`;
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory]);

  // Apply Fuse.js for fuzzy search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
      return;
    }

    const fuseOptions = {
      keys: ['name', 'description'], // Adjust based on fields available in your products
      threshold: 0.3, // Control fuzziness
    };

    const fuse = new Fuse(products, fuseOptions);
    const results = fuse.search(searchQuery);
    setFilteredProducts(results.map((result) => result.item));
  }, [searchQuery, products]);


  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    navigate(
      `/products?search=${encodeURIComponent(searchQuery)}&category_id=${categoryId}`
    );
  };

// Import your Firebase configuration

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
    const response = await fetch('https://ecommbackend-2-f8pa.onrender.com/cart', {
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
    <div>
      {/* Search Bar */}
      {/* Category Filter */}
      <div className="category-filter">
        <div className="category-buttons">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`category-btn ${
              selectedCategory === null ? 'active' : ''
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`category-btn ${
                selectedCategory === category.id ? 'active' : ''
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="products">
  {loading && <p className="loading-message">Loading products...</p>}
  {error && <p className="error-message">{error}</p>}
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <div key={product.id} className="product-card">
        <Link to={`/products/${product.id}`} className="product-link">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="product-image"
          />
        </Link>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">Price: ₹{product.price}</p>
        </div>
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
    <p className="no-products-message">No products found matching your filters.</p>
  )}
</div>

          {/* Cart Section */}
    
    </div>
  );
};

export default Products;
