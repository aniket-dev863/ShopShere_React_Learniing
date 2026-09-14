import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
function ProductDetails() {
  const { id } = useParams();

  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async (pId) => {
    try {
      const response = await fetch("https://dummyjson.com/product/" + pId);

      const data = await response.json();

      setProductDetails(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(id);
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <h1>Product Page Loading...</h1>
      </div>
    );
  }

  if (error != null) {
    return (
      <div className="error-message">
        <h1>Some Error Here</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="page-container product-details-page">
      <div className="product-details">
        <div className="product-details-image">
          <img src={productDetails.images[0]} alt={productDetails.title} />
        </div>

        <div className="product-details-info">
          <h1 className="product-details-title">{productDetails.title}</h1>

          <p className="product-details-description">
            {productDetails.description}
          </p>

          <p className="product-details-price">${productDetails.price}</p>

          <p className="product-details-rating">⭐ {productDetails.rating}</p>

          <button className="add-to-cart-button">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
