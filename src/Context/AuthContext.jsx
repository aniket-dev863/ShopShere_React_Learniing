import { createContext, useEffect, useState } from "react";
const AuthContext = createContext();
function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("AccessToken");
    setToken(storedToken);
  }, []); // this runs after which application mounts
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
export { AuthProvider };
export default AuthContext;
