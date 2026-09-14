# ShopSphere --- Protected Routes in React

## 1. What is a Protected Route?

A **Protected Route** is a route that should only be accessible when the
user is authenticated.

Example:

``` text
Public Routes
├── /
├── /products
├── /products/:id
└── /login

Protected Routes
└── /account
```

If authenticated:

``` text
/account → Account page
```

If not authenticated:

``` text
/account → /login
```

------------------------------------------------------------------------

## 2. AuthContext vs ProtectedRoute

They have different responsibilities.

### AuthContext

Responsible for:

-   storing authentication state
-   providing authentication state to components
-   updating authentication state
-   restoring authentication state from `localStorage`

### ProtectedRoute

Responsible for:

-   consuming authentication state
-   checking whether authentication is ready
-   deciding whether the user can access a route
-   rendering the protected component or redirecting to login

Mental model:

``` text
AuthContext
    ↓
Provides authentication state
    ↓
ProtectedRoute
    ↓
Makes routing decision
```

Do not create another `isLoggedIn` state unnecessarily. You can derive
it from the token:

``` js
const isLoggedIn = token !== null;
```

------------------------------------------------------------------------

## 3. The `children` Concept

A ProtectedRoute is used like this:

``` jsx
<ProtectedRoute>
  <Account />
</ProtectedRoute>
```

The component inside `<ProtectedRoute>` becomes the `children` prop.

Therefore:

``` jsx
function ProtectedRoute({ children }) {
```

means:

> Give me whatever React component/content was placed inside
> ProtectedRoute.

In this example:

``` text
children = <Account />
```

So:

``` jsx
return children;
```

means:

> Render the Account component.

------------------------------------------------------------------------

## 4. `Navigate`

React Router provides:

``` jsx
import { Navigate } from "react-router-dom";
```

`Navigate` redirects the user.

``` jsx
<Navigate to="/login" replace />
```

means:

> Navigate the user to `/login`.

### Why `replace`?

It replaces the current history entry instead of adding another one.

This helps prevent the user from going back to a protected page through
browser history after being redirected.

------------------------------------------------------------------------

## 5. Basic ProtectedRoute Logic

The fundamental logic is:

``` text
Is authentication ready?
        ↓
       YES
        ↓
 Is token present?
    ↙          ↘
  YES           NO
   ↓             ↓
children       /login
```

Basic version:

``` jsx
function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (token === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### Why no `else`?

Because this:

``` jsx
if (token === null) {
  return <Navigate to="/login" replace />;
}
```

ends the function when the condition is true.

Therefore:

``` jsx
return children;
```

naturally represents the remaining case.

------------------------------------------------------------------------

## 6. How to Derive the Logic Yourself

Ask:

### If the user is NOT authenticated?

Redirect:

``` jsx
if (token === null) {
  return <Navigate to="/login" replace />;
}
```

### If the user IS authenticated?

Render the protected page:

``` jsx
return children;
```

Therefore:

``` jsx
function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (token === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

------------------------------------------------------------------------

# 7. The Authentication Initialization Problem

Our first ProtectedRoute implementation exposed an important issue.

AuthContext initially had:

``` jsx
const [token, setToken] = useState(null);
```

and restored the token with:

``` jsx
useEffect(() => {
  const storedToken = localStorage.getItem("AccessToken");
  setToken(storedToken);
}, []);
```

The problem is that `useEffect` runs **after the initial render**.

So this can happen:

``` text
Application starts
      ↓
token = null
      ↓
App renders
      ↓
ProtectedRoute renders
      ↓
token === null
      ↓
Redirect to /login
      ↓
useEffect runs
      ↓
Read token from localStorage
      ↓
setToken(storedToken)
```

Even though the user has a token in localStorage, ProtectedRoute
initially sees `null`.

------------------------------------------------------------------------

# 8. React State and localStorage Are Different

These are separate:

``` text
localStorage
    ↓
AccessToken = "ABC123"
```

and:

``` text
React state
    ↓
token = null
```

React does not automatically synchronize its state with localStorage.

We explicitly restore it:

``` jsx
const storedToken = localStorage.getItem("AccessToken");
setToken(storedToken);
```

------------------------------------------------------------------------

# 9. The Three Authentication States

Authentication is not simply:

``` text
Logged in
Logged out
```

During application startup there is a third state:

``` text
Initializing
Logged in
Logged out
```

More precisely:

``` text
              Authentication
                    │
          ┌─────────┼─────────┐
          ↓         ↓         ↓
     Initializing  Logged    Logged
                   in        out
```

### Initializing

We have not finished checking whether a stored token exists.

### Logged in

Initialization is finished and a token exists.

### Logged out

Initialization is finished and no token exists.

------------------------------------------------------------------------

# 10. `authLoading`

Represent the initialization state with:

``` jsx
const [authLoading, setAuthLoading] = useState(true);
```

Why `true` initially?

Because:

> We are currently checking authentication.

Then:

``` jsx
useEffect(() => {
  const storedToken = localStorage.getItem("AccessToken");

  setToken(storedToken);
  setAuthLoading(false);
}, []);
```

Sequence:

``` text
Application starts
      ↓
authLoading = true
token = null
      ↓
ProtectedRoute
      ↓
Authentication still being checked
      ↓
Show loading UI
      ↓
useEffect
      ↓
Read localStorage
      ↓
setToken(...)
      ↓
setAuthLoading(false)
      ↓
Authentication initialization finished
```

------------------------------------------------------------------------

# 11. Final ProtectedRoute Logic

ProtectedRoute consumes both values:

``` jsx
const { token, authLoading } = useContext(AuthContext);
```

Decision:

``` text
              ProtectedRoute
                    ↓
          Is authLoading true?
             ↙           ↘
           YES            NO
            ↓              ↓
         Loading       Is token null?
                       ↙          ↘
                     YES           NO
                      ↓             ↓
                  Navigate       children
                   /login
```

Example:

``` jsx
function ProtectedRoute({ children }) {
  const { token, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return <h1>Checking authentication...</h1>;
  }

  if (token === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

Important ordering:

``` jsx
if (authLoading) {
  // Wait
}

if (token === null) {
  // Definitely logged out
}

return children;
```

Do not check `token === null` before checking `authLoading`.

------------------------------------------------------------------------

# 12. Complete AuthContext

The learning-project version:

``` jsx
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("AccessToken");

    setToken(storedToken);
    setAuthLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
export default AuthContext;
```

------------------------------------------------------------------------

# 13. Complete ProtectedRoute

``` jsx
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { token, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return <h1>Checking authentication...</h1>;
  }

  if (token === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

------------------------------------------------------------------------

# 14. Using ProtectedRoute in App.jsx

ProtectedRoute belongs inside the route tree.

``` jsx
<Route
  path="/account"
  element={
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  }
/>
```

Meaning:

``` text
/account
   ↓
ProtectedRoute
   ↓
Authentication check
   ↓
 ┌──────────────┐
 ↓              ↓
Authenticated   Not authenticated
 ↓              ↓
Account         /login
```

------------------------------------------------------------------------

# 15. What `main.jsx` Should Do

`main.jsx` sets up the application and global providers.

Correct:

``` jsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

Do not put:

``` jsx
<ProtectedRoute>
  <Account />
</ProtectedRoute>
```

directly beside `<App />`.

ProtectedRoute is a routing decision and belongs inside the route
definitions.

------------------------------------------------------------------------

# 16. Authentication Flow

## Login

``` text
Login
  ↓
POST username + password
  ↓
API
  ↓
accessToken
  ├────────────→ localStorage
  └────────────→ setToken()
                       ↓
                  AuthContext
                       ↓
                  Consumers update
```

## Refresh

``` text
Refresh
  ↓
AuthProvider starts
  ↓
token = null
authLoading = true
  ↓
useEffect
  ↓
localStorage.getItem()
  ↓
setToken(storedToken)
  ↓
setAuthLoading(false)
  ↓
ProtectedRoute can safely decide
```

## Logout

``` text
Logout
  ↓
localStorage.removeItem()
  ↓
setToken(null)
  ↓
AuthContext changes
  ↓
Navbar updates
  ↓
ProtectedRoute blocks protected pages
```

------------------------------------------------------------------------

# 17. Producer → Consumer Mental Model

A useful mental model:

``` text
AuthProvider
     ↓
Provides authentication state
     ↓
AuthContext
     ↓
Consumers
 ┌───┼───────────────┐
 ↓   ↓               ↓
Navbar ProtectedRoute Login
```

For example:

### Login changes state

``` jsx
setToken(data.accessToken);
```

### Navbar consumes state

``` jsx
const { token } = useContext(AuthContext);
```

### ProtectedRoute consumes state

``` jsx
const { token, authLoading } = useContext(AuthContext);
```

The consumer must also know whether the state is **ready to be
consumed**.

That is why `authLoading` exists.

------------------------------------------------------------------------

# 18. Why `authLoading` Solves the Problem

Before:

``` text
token = null
```

could mean:

``` text
"User is logged out"
```

OR:

``` text
"We haven't restored authentication yet"
```

After adding `authLoading`:

``` text
authLoading = true
```

means:

``` text
"We haven't finished checking."
```

while:

``` text
authLoading = false
token = null
```

means:

``` text
"We checked. There is no token. User is logged out."
```

This removes the ambiguity.

------------------------------------------------------------------------

# 19. Debugging Technique

When `/account` unexpectedly redirected to `/login`, inspect the value
used by the condition:

``` jsx
console.log("ProtectedRoute token:", token);
```

If it shows:

``` text
ProtectedRoute token: null
```

then the redirect condition is genuinely executing.

Follow the chain:

``` text
Redirect
  ↓
Why?
  ↓
token === null
  ↓
Why is token null?
  ↓
useState(null)
  ↓
When is token restored?
  ↓
useEffect
  ↓
After initial render
  ↓
Authentication initialization problem
```

Useful debugging principle:

> When a condition unexpectedly executes, inspect the exact value that
> made the condition true.

------------------------------------------------------------------------

# 20. Key Lessons

### 1. AuthContext and ProtectedRoute have different jobs

``` text
AuthContext
→ Provides authentication state

ProtectedRoute
→ Makes routing decisions using that state
```

### 2. `children` is the protected component

``` jsx
<ProtectedRoute>
  <Account />
</ProtectedRoute>
```

means:

``` text
children = <Account />
```

### 3. Early return can replace `else`

``` jsx
if (condition) {
  return something;
}

return somethingElse;
```

### 4. localStorage and React state are different

A token in localStorage does not mean React state already contains it.

### 5. `useEffect` runs after the initial render

This can create an authentication initialization gap.

### 6. Authentication has an initialization state

``` text
Initializing
Authenticated
Unauthenticated
```

### 7. `authLoading` prevents premature redirects

Do not interpret:

``` js
token === null
```

as "logged out" until authentication initialization has finished.

------------------------------------------------------------------------

# 21. One-Sentence Revision

> **AuthContext provides authentication state, ProtectedRoute consumes
> that state to decide whether a route can be accessed, and
> `authLoading` prevents ProtectedRoute from treating the initial
> uninitialized `token = null` as a genuine logout.**

------------------------------------------------------------------------

# 22. Quick Revision Questions

Try answering these without looking back:

1.  What is the responsibility of AuthContext?
2.  What is the responsibility of ProtectedRoute?
3.  What does `children` represent in
    `<ProtectedRoute><Account /></ProtectedRoute>`?
4.  Why can `token === null` be misleading during application startup?
5.  When does `useEffect` run relative to the initial render?
6.  Why do we need `authLoading`?
7.  What should ProtectedRoute render when `authLoading === true`?
8.  What should it render when loading is finished and `token === null`?
9.  What should it render when loading is finished and the token exists?
10. Why does ProtectedRoute belong inside `App.jsx`'s route tree rather
    than directly in `main.jsx`?
