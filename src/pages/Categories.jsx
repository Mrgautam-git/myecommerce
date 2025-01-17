import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Categories.css'; // Import the CSS file

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/categories');
        if (!response.ok) {
          throw new Error('Unable to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message || 'Something went wrong while loading categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category_id=${categoryId}`);
  };

  return (
    <div className="categories-page">
      <h1 className="categories-title">
        Explore Categories
      </h1>

      {loading && <p className="loading-text">Loading categories...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && categories.length > 0 && (
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="category-card"
            >
              <div className="category-card-content">
                <h2 className="category-name">{category.name}</h2>
                <p className="category-description">
                  {category.description || 'No description available'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="no-categories">No categories available at the moment.</p>
      )}
    </div>
  );
};

export default Categories;
