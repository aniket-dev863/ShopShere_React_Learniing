# React AuthContext & useContext — ShopSphere Notes

## 1. Why Authentication State Needs to Be Shared

Authentication information is needed by multiple components:

- `Login` updates authentication state.
- `Navbar` checks whether the user is logged in.
- `Account` needs authentication information.
- `ProtectedRoute` decides whether a page can be accessed.
- `Logout` clears authentication state.

Passing authentication data through props everywhere becomes inconvenient.

React Context lets us keep shared authentication state in one place.

```text
                  AuthProvider
                       |
          +------------+------------+
          |            |            |
        Login        Navbar       Account
          |            |            |
       updates       reads        reads
       auth state   auth state    auth state
```

---

## 2. What Is Context?

React Context provides a way to make data available to components without manually passing props through every level of the component tree.

Create the authentication Context:

```jsx
import { createContext } from "react";

const AuthContext = createContext();

export default AuthContext;
```

`createContext()` creates the Context object. It does not automatically contain our authentication state.

---

## 3. What Is AuthProvider?

`AuthProvider` is a React component that owns authentication state and provides it to components below it.

Basic structure:

```jsx
function AuthProvider({ children }) {
  return (
    <AuthContext.Provider>
      {children}
    </AuthContext.Provider>
  );
}
```

`children` represents whatever components are placed inside the provider.

For example:

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

Tree:

```text
AuthProvider
    |
    +-- App
         |
         +-- Navbar
         +-- Login
         +-- Products
         +-- Account
```

---

## 4. Why AuthProvider Is Above App

In `main.jsx`:

```jsx
<StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
</StrictMode>
```

Authentication is application-wide state, so components inside `App` should be able to access it.

```text
StrictMode
   |
BrowserRouter
   |
AuthProvider
   |
App
   |
+-- Navbar
+-- Home
+-- Products
+-- Login
+-- Account
```

---

## 5. Authentication State with useState

Inside `AuthProvider`:

```jsx
const [token, setToken] = useState(null);
```

Initially:

```text
token = null
```

After successful login:

```text
token = "access-token-value"
```

`setToken()` changes the React state:

```jsx
setToken(data.accessToken);
```

---

## 6. Providing State Through Context

Expose the state and setter through the Provider:

```jsx
<AuthContext.Provider value={{ token, setToken }}>
  {children}
</AuthContext.Provider>
```

The `value` is the data made available to Context consumers.

Here it is:

```js
{
  token,
  setToken
}
```

---

## 7. What Is useContext()?

`useContext()` is the React Hook used by a component to consume a Context.

Example:

```jsx
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";

const { token, setToken } = useContext(AuthContext);
```

This means:

> Give this component the current value supplied by the nearest `AuthContext.Provider`.

If the Provider contains:

```jsx
value={{ token, setToken }}
```

then:

```jsx
useContext(AuthContext)
```

returns that value.

---

## 8. Context vs useContext

This distinction is important.

### `createContext()`

Creates the Context:

```jsx
const AuthContext = createContext();
```

### `AuthContext.Provider`

Provides a value to descendants:

```jsx
<AuthContext.Provider value={{ token, setToken }}>
```

### `useContext()`

Consumes the value inside a component:

```jsx
const { token, setToken } = useContext(AuthContext);
```

Mental model:

```text
createContext()
      |
      v
 AuthContext
      |
      v
   Provider
      |
      | value
      v
 useContext()
      |
      v
 Component
```

---

## 9. Most Important Concept: Context Consumers Re-render

Suppose Navbar has:

```jsx
const { token } = useContext(AuthContext);
```

Initially:

```text
token = null
```

Navbar can render:

```text
Login
```

Then Login executes:

```jsx
setToken(data.accessToken);
```

The state inside `AuthProvider` changes.

The Context value changes.

Navbar consumes that Context value, so React re-renders Navbar.

Now:

```text
token = "eyJ..."
```

Navbar can render:

```text
Logout
```

Flow:

```text
Login
  |
  | setToken(accessToken)
  v
AuthProvider state changes
  |
  v
Context value changes
  |
  v
Navbar re-renders
  |
  v
Navbar sees new token
  |
  v
Logout appears
```

### Key idea

`useContext()` is not merely a one-time read.

A component consuming a Context is subscribed to the Context value. When the consumed Context value changes, React can re-render that component.

---

## 10. Why localStorage Is Also Needed

React state does not survive a full browser refresh.

For example:

```jsx
const [token, setToken] = useState(null);
```

After refreshing:

```text
Browser Refresh
      |
      v
React state starts again
      |
      v
token = null
```

We want authentication information to persist across refreshes.

For this learning project we use browser storage:

```text
React State
    |
    | current application state
    v
  token

localStorage
    |
    | persistence across refresh
    v
accessToken
```

---

## 11. Restoring the Token from localStorage

Inside `AuthProvider`:

```jsx
useEffect(() => {
  const storedToken = localStorage.getItem("accessToken");

  setToken(storedToken);
}, []);
```

Flow:

```text
Application starts
       |
       v
AuthProvider mounts
       |
       v
useEffect()
       |
       v
localStorage.getItem("accessToken")
       |
       v
storedToken
       |
       v
setToken(storedToken)
       |
       v
React authentication state restored
```

The `[]` dependency array means the effect does not re-run because of dependency changes.

---

## 12. localStorage Key Names Are Case-Sensitive

If we store:

```js
localStorage.setItem("accessToken", data.accessToken);
```

we must retrieve it using exactly:

```js
localStorage.getItem("accessToken");
```

This is different from:

```js
localStorage.getItem("AccessToken");
```

For this project, use one consistent key:

```text
accessToken
```

Therefore:

### Store

```js
localStorage.setItem("accessToken", data.accessToken);
```

### Read

```js
localStorage.getItem("accessToken");
```

### Remove

```js
localStorage.removeItem("accessToken");
```

---

## 13. Login + AuthContext

After successful authentication, Login receives an access token from the API.

We want two things to happen:

```text
API
 |
 | accessToken
 v
Login
 |
 +--------------------+
 |                    |
 v                    v
localStorage       setToken()
 |                    |
 v                    v
Persistence       AuthProvider
                     |
                     v
                 Context
```

Example:

```jsx
const { setToken } = useContext(AuthContext);

const login = async () => {
  const response = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  localStorage.setItem("accessToken", data.accessToken);

  setToken(data.accessToken);
};
```

Proper API error handling can be added separately.

---

## 14. Why Do We Need Both setToken() and localStorage?

They solve different problems.

### `setToken()`

Updates React state immediately:

```text
setToken()
   |
   v
AuthProvider
   |
   v
Context changes
   |
   v
Consumers re-render
```

### `localStorage.setItem()`

Persists the token across a browser refresh:

```text
localStorage
    |
    v
survives page refresh
```

Therefore:

```text
setToken()
    = current React state

localStorage
    = persistence
```

---

## 15. Logout

Logout performs the reverse operation.

Example:

```jsx
const { setToken } = useContext(AuthContext);

const logout = () => {
  localStorage.removeItem("accessToken");
  setToken(null);
};
```

Two things happen.

### 1. Remove persisted token

```js
localStorage.removeItem("accessToken");
```

### 2. Clear React authentication state

```js
setToken(null);
```

Flow:

```text
Logout
  |
  +----------------------+
  |                      |
  v                      v
removeItem()          setToken(null)
  |                      |
  v                      v
localStorage          AuthProvider
cleared                   |
                          v
                       Context
                       changes
                          |
                          v
                     Navbar re-renders
                          |
                          v
                        Login
```

---

## 16. Logout Is an Action, Not a Page

Logout is generally an action:

```jsx
<button onClick={logout}>
  Logout
</button>
```

rather than navigation:

```jsx
<Link to="/Logout">
  Logout
</Link>
```

Navigation changes the URL.

Logout changes authentication state.

They are different concepts.

---

## 17. Navbar Using AuthContext

Navbar can consume the token:

```jsx
const { token } = useContext(AuthContext);
```

Then:

```jsx
{token === null ? (
  <Link to="/login">Login</Link>
) : (
  <Logout />
)}
```

Conceptually:

```text
token === null
     |
     +---- YES ---> Login
     |
     +---- NO ----> Logout
```

When `token` changes, Navbar re-renders.

---

## 18. Complete AuthContext

Our current learning version:

```jsx
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");

    setToken(storedToken);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };

export default AuthContext;
```

---

## 19. Complete Mental Model

Keep this diagram in your notebook:

```text
                         API
                          |
                          | accessToken
                          v
                       Login
                      /                          /                           v         v
             localStorage   setToken()
                    |           |
                    |           v
                    |      AuthProvider
                    |           |
                    |           v
                    |        Context
                    |           |
                    |      +----+----+
                    |      |         |
                    |      v         v
                    |    Navbar    Account
                    |
              Browser Refresh
                    |
                    v
               AuthProvider
                    |
                    v
                 useEffect
                    |
                    v
             getItem(accessToken)
                    |
                    v
                setToken()
                    |
                    v
              Context restored
```

---

## 20. Three Core APIs to Remember

### `createContext()`

Creates the shared Context.

```jsx
const AuthContext = createContext();
```

### `Provider`

Makes data available to descendants.

```jsx
<AuthContext.Provider value={{ token, setToken }}>
```

### `useContext()`

Reads/consumes the Context in a component.

```jsx
const { token, setToken } = useContext(AuthContext);
```

Remember:

```text
CREATE
  ↓
PROVIDE
  ↓
CONSUME
```

or:

```text
createContext()
      ↓
Provider
      ↓
useContext()
```

---

## 21. Common Mistakes

### Mistake 1 — Forgetting the Provider

A component consuming the Context needs to be under the appropriate Provider.

### Mistake 2 — Providing one shape and consuming another

If Provider gives:

```jsx
value={{ token, setToken }}
```

consumers should expect:

```jsx
const { token, setToken } = useContext(AuthContext);
```

### Mistake 3 — Confusing Context with localStorage

Context:

```text
React application state
```

localStorage:

```text
Browser persistence
```

They are not the same thing.

### Mistake 4 — Assuming localStorage automatically updates React

This:

```js
localStorage.setItem("accessToken", token);
```

does not automatically update React's `token` state.

You explicitly update React state:

```js
setToken(token);
```

### Mistake 5 — Forgetting to clear both during logout

Use:

```js
localStorage.removeItem("accessToken");
setToken(null);
```

Otherwise authentication state can become inconsistent.

---

## 22. Security Note

For this learning project, `localStorage` is being used to understand persistence.

However, storing authentication tokens in browser storage is a security/design decision. JavaScript-accessible storage can be exposed if an application has a serious XSS vulnerability.

Real authentication systems may instead use appropriately configured cookies, including security attributes such as `HttpOnly`, `Secure`, and `SameSite`, depending on the architecture.

Therefore:

```text
localStorage ≠ automatically the best production auth storage
```

We are using it here primarily to understand the React architecture.

---

## 23. What We Have Built

You now have:

```text
                  ShopSphere Auth
                        |
          +-------------+-------------+
          |             |             |
        Login         Context       Logout
          |             |             |
          |             |             |
       API token    token state    clear token
          |             |             |
          +-------> localStorage <----+
                        |
                        v
                    Persistence
```

React's role:

```text
Authentication state
        |
        v
   AuthProvider
        |
        v
    AuthContext
        |
        v
   useContext()
        |
        +---- Navbar
        +---- Login
        +---- Account
        +---- ProtectedRoute
```

---

## 24. Next Concept — Protected Routes

The authentication system currently gives us authentication state, but it does not yet enforce access to pages.

For example, someone could manually visit:

```text
/account
```

even without being logged in.

We want:

```text
/account
   |
   v
ProtectedRoute
   |
   v
Is token present?
   |
   +------ YES ------> Account
   |
   +------- NO ------> Login
```

This will combine:

```text
React Context
       +
React Router
       +
Authentication state
```

and create the protected-route system for ShopSphere.
