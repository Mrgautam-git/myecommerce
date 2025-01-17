// import React, { useState, useEffect } from 'react';
// import { auth } from '../components/Firebase'; // Import the Firebase auth module
// import { Link } from 'react-router-dom';

// const Cart = () => {
//   const [cart, setCartItems] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userId, setUserId] = useState(null); // State to store the userId

//   // Get the current user from Firebase
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setUserId(user.uid); // Set the user ID when the user is authenticated
//       } else {
//         setUserId(null); // If no user is logged in, set userId to null
//       }
//     });

//     return () => unsubscribe(); // Cleanup on unmount
//   }, []);

//   // Fetch cart data when userId is available
//   useEffect(() => {
//     if (!userId) return; // Don't fetch if there's no userId

//     const fetchCartData = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/cart?userId=${userId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch cart data');
//         }
//         const cartData = await response.json();
        
//         // Fetch product details for each cart item
//         const cartWithProductDetails = await Promise.all(cartData.map(async (item) => {
//           const productResponse = await fetch(`http://localhost:5000/api/products/${item.product_id}`);
//           const productData = await productResponse.json();

//           return {
//             ...item,
//             product_name: productData.name,
//             product_price: productData.price,
//             product_image: productData.image_url, // Assuming product data contains image_url
//           };
//         }));

//         setCartItems(cartWithProductDetails);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCartData();
//   }, [userId]); // The effect runs whenever the userId changes

//   // Remove product from cart
//   const removeFromCart = async (cartItemId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) {
//         throw new Error('Failed to remove item from cart');
//       }
//       // Remove the item from the local state
//       setCartItems(cart.filter(item => item.cart_id !== cartItemId));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const calculateTotal = () => {
//     return cart.reduce((total, item) => total + item.product_price * item.quantity, 0);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h2>Your Cart</h2>
//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <ul>
//           {cart.map((item) => (
//             <li key={item.cart_id}>
//               <p>{item.product_name}</p>
//               <p>Price: ₹{item.product_price}</p>
//               <p>Quantity: {item.quantity}</p>
//               <img src={item.product_image} alt={item.product_name} width="100" />
//               <p>Product ID: {item.product_id}</p>
//               {/* Remove button */}
//               <button onClick={() => removeFromCart(item.cart_id)}>Remove</button>
//             </li>
//           ))}
//         </ul>
//       )}

//       <div className="cart-section">
//         <h2>Cart</h2>
//         {cart.length > 0 ? (
//           <>
//             <ul>
//               {cart.map((item) => (
//                 <li key={item.id}>
//                   {item.product_name} (x{item.quantity}) - ₹{item.product_price * item.quantity}
//                   <button onClick={() => removeFromCart(item.cart_id)}>Remove</button>
//                 </li>
//               ))}
//             </ul>
//             <p className="cart-total">Total: ₹{calculateTotal()}</p>
//             <Link to="/checkout" className="hover:text-gray-400">Checkout</Link>
//           </>
//         ) : (
//           <p>Your cart is empty.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;
import React, { useState, useEffect } from 'react';
import { auth } from '../components/Firebase'; // Import the Firebase auth module
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cart, setCartItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // State to store the userId

  // Get the current user from Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID when the user is authenticated
      } else {
        setUserId(null); // If no user is logged in, set userId to null
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Fetch cart data when userId is available
  useEffect(() => {
    if (!userId) return; // Don't fetch if there's no userId

    const fetchCartData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cart?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }
        const cartData = await response.json();
        console.log("Cart data:", cartData); // Log the fetched data to see if cart_id exists
        
        const cartWithProductDetails = await Promise.all(cartData.map(async (item) => {
          const productResponse = await fetch(`http://localhost:5000/api/products/${item.product_id}`);
          const productData = await productResponse.json();
    
          return {
            ...item,
            product_name: productData.name,
            product_price: productData.price,
            product_image: productData.image_url, // Assuming product data contains image_url
          };
        }));
    
        setCartItems(cartWithProductDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [userId]); // The effect runs whenever the userId changes

  // Remove product from cart
  const removeFromCart = async (id) => {
    console.log("Removing item with id:", id);
  
    if (!id) {
      console.error('ID is missing');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/cart/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
  
      // Update the local cart state
      setCartItems((prevCartItems) => prevCartItems.filter(item => item.id !== id));
  
      console.log(`Item with ID ${id} removed successfully`);
    } catch (err) {
      console.error('Error:', err.message);
      setError(err.message);
    }
  };

  // Update product quantity
  const updateQuantity = async (id, newQuantity) => {
    try {
      console.log(`Updating quantity for item with id: ${id} to ${newQuantity}`);
  
      const response = await fetch(`http://localhost:5000/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }), // Pass the new quantity
      });
  
      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }
  
      // Update the cart in the state after the quantity is updated
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
  
      console.log(`Item with ID ${id} updated successfully`);
    } catch (err) {
      console.error('Error:', err.message);
      setError(err.message);
    }
  };
  

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product_price * item.quantity, 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            <div className="cart-item">
              <img src={item.product_image} alt={item.product_name} width="100" />
              <div className="cart-item-details">
                <p>{item.product_name}</p>
                <p>Price: ₹{item.product_price}</p>
                <p>Quantity: 
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  {item.quantity}
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </p>
                <p>Product ID: {item.product_id}</p>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {cart.length > 0 && (
        <div className="cart-summary">
          <p>Total: ₹{calculateTotal()}</p>
          <Link to="/checkout" className="hover:text-gray-400">Proceed to Checkout</Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
