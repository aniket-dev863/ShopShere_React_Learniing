import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import MainLayout from "./Layouts/MainLayout";
import ProductDetails from "./Components/ProductDetails";
import Login from "./Pages/Login";
import Logout from "./Pages/Logout";
import Account from "./Pages/Account";
import ProtectedRoute from "./Components/ProtectedRoute";
const App = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
