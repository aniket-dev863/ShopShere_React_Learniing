import { createContext, useEffect, useState } from "react";
const AuthContext = createContext();
function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const storedToken = localStorage.getItem("AccessToken");
    setToken(storedToken);
    setAuthLoading(false);
  }, []); // this runs after which application mounts
  return (
    <AuthContext.Provider value={{ token, setToken, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
export { AuthProvider };
export default AuthContext;
