import React, { useState, useEffect } from 'react';
import { auth } from '../components/Firebase';
import "./Checkout.css";


const Checkout = () => {
  const [cart, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [existingAddress, setExistingAddress] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchCartData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cart?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }
        const cartData = await response.json();

        const cartWithProductDetails = await Promise.all(cartData.map(async (item) => {
          const productResponse = await fetch(`http://localhost:5000/api/products/${item.product_id}`);
          const productData = await productResponse.json();
          return {
            ...item,
            product_name: productData.name,
            product_price: productData.price,
            product_image: productData.image_url,
          };
        }));

        setCartItems(cartWithProductDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAddress = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/addresses?userId=${userId}`);
        if (response.ok) {
          const addressData = await response.json();
          setExistingAddress(addressData);
          setShippingAddress(addressData);
        } else {
          setExistingAddress(null);
        }
      } catch (err) {
        setError('Failed to fetch address data.');
      }
    };

    fetchCartData();
    fetchAddress();
  }, [userId]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product_price * item.quantity, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };
 
  const handleSubmitOrder = async () => {
    try {
      const user = auth.currentUser; // Get the current logged-in user
  
      if (!user) {
        setError('Please log in to place an order.');
        return;
      }
  
      // Ensure cart contains items before proceeding
      if (!cart || cart.length === 0) {
        setError('Your cart is empty.');
        return;
      }
  
      // Prepare the data to be sent to the backend
      const orderData = {
        firebaseToken: user.uid, // Firebase authentication token
        shippingAddress: shippingAddress, // Shipping address filled by the user
        items: cart.map((product) => ({
          productId: product.cart_id, // Product ID from the cart
          quantity: product.quantity || 1, // Quantity (default to 1 if not provided)
          price: product.product_price, // Product price
        })),
      };
  
      console.log("Order Data Sent:", orderData); // Debug: Log order data to verify it's correct
  
      // Send the order data to your backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Inform the server of JSON payload
        },
        body: JSON.stringify(orderData), // Send the order data as JSON
      });
  
      if (!response.ok) {
        // Handle errors from the server response
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }
  
      const responseData = await response.json(); // Parse the successful response
  
      alert(`Order placed successfully! Order ID: ${responseData.orderId}`); // Success message
      console.log('Order Response:', responseData);
  
      // Optionally, clear the cart or reset states after order placement
      setCartItems([]); // Clear the cart
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error placing order:', error.message); // Log the error for debugging
      setError(error.message); // Display the error to the user
    }
  };
  
  
  


  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = existingAddress ? `http://localhost:5000/api/addresses/update` : `http://localhost:5000/api/addresses`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id:1,
          firebase_user_id: userId,
          fullName: shippingAddress.fullName,
          address: shippingAddress.streetAddress,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip_code: shippingAddress.zipCode,
          country: shippingAddress.country,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      setOrderStatus(existingAddress ? 'Address updated successfully!' : 'Address added successfully!');
      setExistingAddress(shippingAddress);
      setIsEditing(false);
    } catch (err) {
      setOrderStatus('Error saving address. Please try again.');
    }
  };

  const handleEditAddress = () => {
    setIsEditing(true);
  };

  const handleDeleteAddress = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/addresses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      setExistingAddress(null);
      setShippingAddress({
        fullName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      });
      setOrderStatus('Address deleted successfully!');
    } catch (err) {
      setOrderStatus('Error deleting address. Please try again.');
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-summary">
          <h3>Cart Summary</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.cart_id}>
                <p>{item.product_name}  </p>
                <p>(x{item.quantity})</p>
                <p>(₹{item.product_price * item.quantity})</p>
                <img src={item.product_image} alt={item.product_name} width="100" />
              </li>
            ))}
          </ul>
          <p className="total-price">Total: ₹{calculateTotal()}</p>
        </div>
      )}

      <h3>Shipping Address</h3>
      {existingAddress && !isEditing ? (
        <div className="existing-address">
          <p>{existingAddress.fullName}</p>
          <p>{existingAddress.address}</p>
          <p>{existingAddress.city}, {existingAddress.state} {existingAddress.zip_code}</p>
          <p>{existingAddress.country}</p>
          <button onClick={handleEditAddress}>Edit Address</button>
          <button onClick={handleDeleteAddress}>Delete Address</button>
        </div>
      ) : (
        <form onSubmit={handleAddressSubmit}>
      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={shippingAddress.fullName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="streetAddress">Street Address</label>
        <input
          type="text"
          id="streetAddress"
          name="streetAddress"
          value={shippingAddress.streetAddress}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={shippingAddress.city}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="state">State</label>
        <input
          type="text"
          id="state"
          name="state"
          value={shippingAddress.state}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="zipCode">Zip Code</label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          value={shippingAddress.zipCode}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="country">Country</label>
        <input
          type="text"
          id="country"
          name="country"
          value={shippingAddress.country}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Save Address</button>
    </form>
      )}

      {orderStatus && <p className="order-status">{orderStatus}</p>}

      {cart.length > 0 && (
        <div className="order-form">
          <button onClick={handleSubmitOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
