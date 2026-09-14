import { useState, useEffect } from "react";
import "../App.css";
import ProductCard from "../Components/Productcard";
function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      const result = await fetch("https://dummyjson.com/products");

      const data = await result.json();

      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="products-page">
        <h1>Loading Products...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <h1>Something went wrong.</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="page-container products-page">
      <h1 className="page-title">Products</h1>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
