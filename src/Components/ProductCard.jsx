import { Link } from "react-router-dom";
import React from "react";
import "../App.css";
function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="product-card">
        <div className="product-image-container">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-image"
          />
        </div>

        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>

          <p className="product-price">${product.price}</p>

          <p className="product-rating">⭐ {product.rating}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
