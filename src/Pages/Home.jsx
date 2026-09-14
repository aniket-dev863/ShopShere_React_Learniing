import "../App.css";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">WELCOME TO SHOPSPHERE</p>

          <h1 className="hero-title">
            Everything you need,
            <br />
            all in one place.
          </h1>

          <p className="hero-description">
            Discover products, explore categories, and find something you'll
            love.
          </p>

          <Link to="/products" className="hero-button">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
