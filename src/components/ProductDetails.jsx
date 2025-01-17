import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import './searchbar.css';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const productDetailsRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        const data = await response.json();
        setProduct(data);

        // Fetch related products
        const relatedResponse = await fetch(`http://localhost:5000/products?category_id=${data.category_id}`);
        if (!relatedResponse.ok) {
          throw new Error(`Failed to fetch related products: ${relatedResponse.statusText}`);
        }
        const relatedData = await relatedResponse.json();
        setRelatedProducts(relatedData.filter((p) => p.id !== data.id));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProduct();
  }, [productId]); // useEffect will run when the productId changes

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);
  // Scroll to product details after the component mounts
  useEffect(() => {
    if (productDetailsRef.current) {
      window.scrollTo({
        top: productDetailsRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [productId]); // Only scroll when productId changes

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!product) {
    return <div className="loading">Loading...</div>;
  }

  // Handle click on related product
  const handleRelatedProductClick = (relatedProductId) => {
    navigate(`/products/${relatedProductId}`);
  };

  return (
    <div className="product-details">
      <div className="product-header" ref={productDetailsRef}>
        <h1 className="product-name">{product.name}</h1>
        <img src={product.image_url} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <div className="description">
          <p><strong>Description:</strong> {product.description}</p>
        </div>
        <div className="pricing">
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Rating:</strong> {product.rating} / 5</p>
          <p><strong>Number of Reviews:</strong> {product.reviews?.length || 0}</p>
        </div>
      </div>

      <div className="related-products">
        <h2>Related Products</h2>
        {relatedProducts.length > 0 ? (
          <div className="product-list ">
            {relatedProducts.map((related) => (
              <div className="list_product" key={related.id} onClick={() => handleRelatedProductClick(related.id)}>
                <img src={related.image_url} alt={related.name} className="related-image" />
                <h3>{related.name}</h3>
                <p>Price: ₹{related.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-related-products">No related products found.</p>
        )}
      </div>
      <div className="related-products">
        <h1>All Products</h1>
        <div className="product-list">
          {products.map((product) => (
            <div className="list_product " key={product.id} onClick={() => handleRelatedProductClick(product.id)}>
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
