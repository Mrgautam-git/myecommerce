import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);

      // Fetch cart and wishlist from the backend for the logged-in user
      const fetchCartAndWishlist = async () => {
        const responseCart = await fetch(`/api/cart/${user.userId}`);
        const cartData = await responseCart.json();
        setCart(cartData);

        const responseWishlist = await fetch(`/api/wishlist/${user.userId}`);
        const wishlistData = await responseWishlist.json();
        setWishlist(wishlistData);
      };

      fetchCartAndWishlist();
    }
  }, []);

  return (
    <div>
      <h2>{userData.username}'s Dashboard</h2>
      <h3>Cart</h3>
      <ul>
        {cart.map(item => (
          <li key={item.id}>{item.name}</li> // Display item name or other details
        ))}
      </ul>
      <h3>Wishlist</h3>
      <ul>
        {wishlist.map(item => (
          <li key={item.id}>{item.name}</li> // Display item name or other details
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
