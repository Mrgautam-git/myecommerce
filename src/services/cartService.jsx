// src/services/cartService.js
export const addToCart = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Include JWT token
      },
      body: JSON.stringify({ productId, quantity }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }
  
    const data = await response.json();
    return data;
  };
  