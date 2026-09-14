import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import Logout from "../Pages/Logout";
import "../App.css";
function Navbar() {
  const { token } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ShopSphere
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>

          <Link to="/products" className="navbar-link">
            Products
          </Link>

          {token === null ? (
            <Link to="/login" className="navbar-login">
              Login
            </Link>
          ) : (
            <Logout />
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
