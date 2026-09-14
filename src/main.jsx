import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import "./index.css";
import App from "./App.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Account from "./Pages/Account.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
