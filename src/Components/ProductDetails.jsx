import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
      <>
        <h1>Product Page Loading ... </h1>
      </>
    );
  }

  if (error != null) {
    return (
      <>
        <h1>SomeError Here </h1>
        <p>{error.message}</p>
      </>
    );
  }
  return (
    <div className="product-details">
      <h1 className="product-details__title">
        Product Title :{productDetails.title}
      </h1>
      <h2 className="product-details__description">
        Product description:{productDetails.description}
      </h2>
      <h2 className="product-details__price">
        Product Price:{productDetails.price}
      </h2>
      <img className="product-details__image" src={productDetails.images[0]} />
    </div>
  );
}

export default ProductDetails;
