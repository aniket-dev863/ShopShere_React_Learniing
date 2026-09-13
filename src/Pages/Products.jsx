import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    <div className="products-page">
      <h1 className="products-page__title">Products</h1>

      <p className="products-page__count">Product Count: {products.length}</p>

      <div className="products-page__grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              className="product-card__image"
              src={product.thumbnail}
              alt={product.title}
            />

            <Link to={`/products/${product.id}`}>
              <h2 className="product-card__title">{product.title}</h2>
            </Link>

            <p className="product-card__price">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
