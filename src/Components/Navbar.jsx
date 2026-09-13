import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import Logout from "../Pages/Logout";
function Navbar() {
  const { token } = useContext(AuthContext);
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      {token === null ? <Link to="/login">Login</Link> : <Logout />}
    </nav>
  );
}
export default Navbar;
