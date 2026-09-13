# React Notes — ShopSphere Learning

> **Progress:** Notes up to the current point in the ShopSphere project.
>
> **Goal:** Learn React by building a production-style multipage application, understanding every concept instead of copying code.

---

# 1. What React Is

React is a JavaScript library for building user interfaces using **components**.

The main idea is:

```text
UI = f(state)
```

The UI is produced from the current state/props of the application.

React encourages us to break a large UI into small, reusable components.

For example:

```text
App
├── Navbar
├── Home
└── Products
    ├── ProductGrid
    └── ProductCard
```

---

# 2. Components

A React component is usually a JavaScript function that returns JSX.

Example:

```jsx
function Home() {
  return <h1>Home Page</h1>;
}

export default Home;
```

A component can be used like an HTML element:

```jsx
<Home />
```

## Component Rules

A component:

- Usually starts with a capital letter.
- Returns JSX.
- Can receive data through props.
- Can contain state and hooks.
- Should generally have one clear responsibility.

---

# 3. JSX

JSX allows us to write HTML-like syntax inside JavaScript.

Example:

```jsx
function Home() {
  const name = "Aniket";

  return (
    <div>
      <h1>Hello {name}</h1>
    </div>
  );
}
```

JavaScript expressions can be placed inside `{}`.

```jsx
<h1>{name}</h1>
```

JSX is not actually HTML. It is syntax that React transforms into JavaScript.

---

# 4. Rendering Components

A component can be rendered inside another component.

```jsx
function App() {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}
```

This creates a component hierarchy:

```text
App
├── Navbar
└── Home
```

React uses this component tree to determine what should appear on the screen.

---

# 5. Props

Props are data passed from a parent component to a child component.

Example:

```jsx
function App() {
  return <ProductCard name="iPhone" price={999} />;
}
```

The child receives those values:

```jsx
function ProductCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.price}</p>
    </div>
  );
}
```

A common cleaner syntax is destructuring:

```jsx
function ProductCard({ name, price }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{price}</p>
    </div>
  );
}
```

## Important

Props are passed:

```text
Parent
   ↓
Props
   ↓
Child
```

The child should not directly modify the parent's props.

---

# 6. Arrays and `.map()` in React

React commonly renders lists using JavaScript's `.map()`.

Example:

```jsx
const products = [
  { id: 1, name: "Phone" },
  { id: 2, name: "Laptop" },
];
```

Render:

```jsx
products.map((product) => (
  <ProductCard
    key={product.id}
    name={product.name}
  />
))
```

## Important: `return`

When using `{}` inside an arrow function, an explicit `return` is required.

This does NOT return JSX:

```jsx
products.map((product) => {
  <ProductCard />;
});
```

This works because of implicit return:

```jsx
products.map((product) => (
  <ProductCard />
));
```

Or explicitly:

```jsx
products.map((product) => {
  return <ProductCard />;
});
```

---

# 7. `key` in Lists

React needs a stable `key` when rendering lists.

```jsx
products.map((product) => (
  <ProductCard
    key={product.id}
    product={product}
  />
))
```

The key helps React identify which list item corresponds to which data item.

Prefer a stable unique ID:

```jsx
key={product.id}
```

Avoid using array indexes as keys when the list can change order, items can be inserted, or items can be removed.

---

# 8. State with `useState`

State is data that belongs to a component and can change over time.

Import:

```jsx
import { useState } from "react";
```

Example:

```jsx
const [count, setCount] = useState(0);
```

This gives us:

```text
count      → current state value
setCount   → function used to update state
```

Example:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

When state changes:

```text
setCount(...)
     ↓
State changes
     ↓
Component renders again
     ↓
UI reflects new state
```

---

# 9. Updating State

Do not directly modify state.

Bad:

```jsx
count = count + 1;
```

Good:

```jsx
setCount(count + 1);
```

React uses the state setter to schedule an update and render the component again.

---

# 10. `useEffect`

`useEffect` is used when a component needs to perform a **side effect**.

Typical examples:

- Fetching API data
- Starting a timer
- Subscribing to something
- Synchronizing with an external system
- Adding event listeners

Import:

```jsx
import { useEffect } from "react";
```

Basic structure:

```jsx
useEffect(() => {
  // side effect
}, []);
```

---

# 11. `useEffect` Dependency Array

The second argument controls when the effect runs.

## Empty dependency array

```jsx
useEffect(() => {
  console.log("Effect");
}, []);
```

The effect is associated with the component's initial mount.

In development, React `StrictMode` can intentionally run effect setup/cleanup more than once to help detect problems. This is a development behavior and should not be confused with normal production behavior.

---

## Dependency

```jsx
useEffect(() => {
  console.log(username);
}, [username]);
```

The effect runs when `username` changes.

It also runs for the initial render.

Conceptually:

```text
Initial render
      ↓
Effect runs

username changes
      ↓
Component renders
      ↓
Effect runs again
```

---

## Multiple dependencies

```jsx
useEffect(() => {
  // effect
}, [username, user]);
```

The effect can run when either dependency changes.

React compares dependencies between renders.

---

# 12. Dependency Comparison

React compares dependency values between renders.

Primitive values are compared by value.

Examples:

```js
"hello" === "hello" // true
10 === 10           // true
true === true       // true
```

Objects, arrays, and functions are compared by reference.

Example:

```js
{} === {} // false
```

Even though both objects look identical, they are different objects in memory.

This matters when using objects/arrays/functions in dependency arrays.

---

# 13. `useEffect` Cleanup

An effect can return a cleanup function.

Example:

```jsx
useEffect(() => {
  const interval = setInterval(() => {
    console.log("Running...");
  }, 1000);

  return () => {
    clearInterval(interval);
  };
}, []);
```

The cleanup function is used to undo work created by the effect.

Examples:

```text
Effect creates:
- interval
- event listener
- subscription

Cleanup removes:
- interval
- event listener
- subscription
```

General structure:

```jsx
useEffect(() => {
  // setup

  return () => {
    // cleanup
  };
}, []);
```

Cleanup is important because otherwise external resources can continue running after the component no longer needs them.

---

# 14. React Strict Mode

Vite React projects commonly use:

```jsx
import { StrictMode } from "react";
```

Then:

```jsx
<StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</StrictMode>
```

Strict Mode helps detect certain problems during development.

One important effect-related behavior is that React may perform an extra setup/cleanup cycle in development.

Therefore, code should be written so that effects can safely be set up and cleaned up.

This does not mean React normally mounts the production application twice.

---

# 15. React Router

React itself does not provide URL routing.

For our multipage React application we use:

```bash
npm install react-router-dom
```

React Router allows URLs to map to React components.

Example:

```text
/           → Home
/products   → Products
```

---

# 16. `BrowserRouter`

`BrowserRouter` provides routing functionality to the React application.

In `main.jsx`:

```jsx
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

Conceptually:

```text
BrowserRouter
      ↓
     App
      ↓
 React Router
      ↓
 Current URL
      ↓
 Matching Route
      ↓
 Component
```

---

# 17. `Routes` and `Route`

`Routes` contains route definitions.

Example:

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
</Routes>
```

`Route` connects:

```text
URL path
   ↓
React component
```

For example:

```jsx
<Route
  path="/products"
  element={<Products />}
/>
```

When the browser URL is:

```text
/products
```

React Router renders:

```jsx
<Products />
```

---

# 18. `Link`

Use React Router's `Link` for navigation inside the React application.

Example:

```jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
    </nav>
  );
}
```

Instead of using:

```html
<a href="/products">Products</a>
```

for internal React Router navigation, use:

```jsx
<Link to="/products">Products</Link>
```

This allows React Router to handle the navigation without requiring a full browser document reload.

---

# 19. Layouts

A layout contains UI that should remain common across multiple routes.

For ShopSphere, the Navbar belongs in the main layout.

Example:

```jsx
function MainLayout() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}
```

Conceptually:

```text
MainLayout
├── Navbar
└── Outlet
    ├── Home
    └── Products
```

The layout stays common while the content inside `Outlet` changes.

---

# 20. `Outlet`

`Outlet` is provided by React Router.

```jsx
import { Outlet } from "react-router-dom";
```

It represents the location where a child route should render.

Example:

```jsx
function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
```

If the current route is `/`:

```text
Navbar
Home
```

If the current route is `/products`:

```text
Navbar
Products
```

The layout is shared.

---

# 21. Nested Routes

A layout can be used as a parent route.

Example:

```jsx
<Routes>
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Products />} />
  </Route>
</Routes>
```

The parent route provides the layout.

The child route determines what appears inside:

```jsx
<Outlet />
```

Conceptually:

```text
Route
└── MainLayout
    ├── /
    │   └── Home
    │
    └── /products
        └── Products
```

---

# 22. Dynamic Routes

A route can contain a dynamic URL segment.

Example:

```jsx
<Route
  path="/products/:productId"
  element={<ProductDetails />}
/>
```

The `:productId` part is dynamic.

These URLs all match the same route:

```text
/products/1
/products/25
/products/999
```

The value changes.

```text
/products/:productId
          ↑
      dynamic value
```

---

# 23. `useParams`

React Router provides `useParams()` to access dynamic route parameters.

Example:

```jsx
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { productId } = useParams();

  return (
    <div className="product-details">
      <h1>Product ID: {productId}</h1>
    </div>
  );
}
```

If the URL is:

```text
/products/42
```

then:

```jsx
productId
```

will contain:

```text
"42"
```

Important:

> URL parameters are strings.

So:

```js
productId === "42"
```

not:

```js
productId === 42
```

If an API requires a number, convert it explicitly when necessary.

---

# 24. Dynamic Routing + API

Dynamic routing becomes especially useful for product detail pages.

Example:

```text
/products/1
/products/2
/products/3
```

The route tells us which product the user wants.

Conceptually:

```text
URL
 ↓
productId
 ↓
API request
 ↓
Product data
 ↓
ProductDetails component
```

For ShopSphere:

```text
/products/:productId
```

will eventually connect to the DummyJSON product endpoint.

---

# 25. API Data in React

When fetching API data, the common React pattern is:

```text
State
 +
Effect
 +
API request
 =
Fetched data displayed in UI
```

Typical state:

```jsx
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

Then the effect performs the request.

The important separation is:

```text
useEffect
   ↓
perform side effect (API request)

useState
   ↓
store the result

render
   ↓
display the result
```

We will implement this progressively in the next stage.

---

# 26. Loading, Error, and Data States

An API-driven component should not assume data is immediately available.

A useful mental model is:

```text
Loading
   ↓
Success → Display data
   ↓
Error   → Display error
```

Typical UI states:

```text
Loading...
```

```text
Products
Product
Product
Product
```

or:

```text
Something went wrong.
```

This is important for production-quality applications.

---

# 27. Vite

Vite is the development/build tool used to create the ShopSphere project.

Create a React project with:

```bash
npm create vite@latest
```

Then install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Vite provides:

- Development server
- Fast Hot Module Replacement (HMR)
- Modern JavaScript tooling
- Production build support

Vite is **not React itself**.

Think:

```text
React
→ UI library

Vite
→ Development/build tool

React Router
→ Routing library
```

---

# 28. Parcel vs Vite

Both Parcel and Vite are tools used during development/building.

### Parcel

Parcel focuses heavily on a zero-configuration developer experience.

### Vite

Vite uses modern ESM-based development and provides fast development startup/HMR with optimized production builds.

The important point:

> Knowing Parcel is not wasted knowledge.

The concepts transfer:

```text
React application
      ↓
Build/dev tool
      ↓
Browser
```

For ShopSphere we are using Vite so that we also understand a modern React project workflow.

---

# 29. Project Architecture

We do not need to create every folder immediately.

We build the architecture as the application grows.

The planned architecture is:

```text
src/
├── components/
│   ├── Navbar/
│   ├── ProductCard/
│   ├── ProductGrid/
│   ├── SearchBar/
│   ├── FilterPanel/
│   ├── Pagination/
│   ├── Loading/
│   └── ErrorMessage/
│
├── pages/
│   ├── Home/
│   ├── Products/
│   ├── ProductDetails/
│   ├── Categories/
│   ├── CategoryProducts/
│   ├── Cart/
│   ├── Login/
│   └── Account/
│
├── layouts/
│   ├── MainLayout/
│   └── AuthLayout/
│
├── services/
│   └── api.js
│
├── hooks/
├── utils/
├── data/
│
├── App.jsx
└── main.jsx
```

The folders will be introduced when we actually need them.

---

# 30. Pages vs Components

A useful distinction:

## Pages

Pages represent route-level screens.

Examples:

```text
Home
Products
ProductDetails
Cart
Login
Account
```

## Components

Components are reusable UI pieces.

Examples:

```text
Navbar
ProductCard
ProductGrid
SearchBar
Pagination
Loading
```

Conceptually:

```text
Route
 ↓
Page
 ↓
Components
```

Example:

```text
/products
    ↓
Products Page
    ↓
ProductGrid
    ↓
ProductCard
```

---

# 31. Planned ShopSphere Routes

The initial route plan is:

```text
/
├── Home

/products
├── Products

/products/:productId
├── Product Details

/categories
├── Categories

/categories/:category
├── Category Products

/cart
├── Cart

/login
├── Login

/account
└── Account
```

Later, Account can contain nested routes:

```text
/account
├── /account/profile
├── /account/orders
└── /account/settings
```

This will give us practical experience with nested routing.

---

# 32. DummyJSON

ShopSphere uses DummyJSON as a free practice API.

It provides endpoints for:

- Products
- Categories
- Users
- Authentication
- Carts
- Search
- Pagination
- Sorting

This makes it suitable for learning API-driven React applications.

The API will allow us to build realistic features without creating our own backend.

---

# 33. Current ShopSphere Architecture

At the current point, the routing architecture is conceptually:

```text
main.jsx
   │
   └── BrowserRouter
          │
          └── App
               │
               └── Routes
                    │
                    └── MainLayout
                         │
                         ├── Navbar
                         │
                         └── Outlet
                              │
                              ├── Home
                              └── Products
```

Dynamic product routing will extend this:

```text
MainLayout
│
├── Navbar
│
└── Outlet
     │
     ├── Home
     ├── Products
     └── ProductDetails
          ↑
          /products/:productId
```

---

# 34. Important React Mental Models

## Component Tree

React applications are trees of components.

```text
App
├── Layout
│   ├── Navbar
│   └── Page
│       ├── Component
│       └── Component
```

---

## Data Flow

React normally follows one-way data flow.

```text
Parent
  ↓
Props
  ↓
Child
```

---

## State Flow

State updates cause a new render.

```text
State
 ↓
Render
 ↓
UI
```

When state changes:

```text
setState()
   ↓
React schedules update
   ↓
Component renders again
   ↓
UI reflects new state
```

---

## Effects

Effects interact with things outside normal rendering.

```text
Component
    ↓
useEffect
    ↓
External system
```

Examples:

```text
API
Timer
Event listener
Subscription
```

---

## Routing

Routing decides which page/component belongs to the current URL.

```text
URL
 ↓
Router
 ↓
Matching Route
 ↓
Page Component
```

---

# 35. Common Mistakes We Encountered

## Mistake 1 — Forgetting `return` in `.map()`

Wrong:

```jsx
items.map((item) => {
  <Card />;
});
```

Correct:

```jsx
items.map((item) => (
  <Card />
));
```

or:

```jsx
items.map((item) => {
  return <Card />;
});
```

---

## Mistake 2 — Incorrect Props Destructuring

If a component is called:

```jsx
<RestaurantSection resData={data} />
```

Then:

```jsx
function RestaurantSection(props) {
  console.log(props.resData);
}
```

or directly:

```jsx
function RestaurantSection({ resData }) {
  console.log(resData);
}
```

But:

```jsx
function RestaurantSection(resData) {
```

means `resData` is actually the entire props object, not the value itself.

---

## Mistake 3 — Rendering Navbar Twice

If Navbar is inside:

```jsx
<MainLayout>
  <Navbar />
  <Outlet />
</MainLayout>
```

then it should not also be rendered separately in `App`.

Otherwise:

```text
Navbar
Navbar
Page
```

would appear.

A shared layout should own the shared UI.

---

## Mistake 4 — `React.StrictMode` Without `React`

If using:

```jsx
import { StrictMode } from "react";
```

then use:

```jsx
<StrictMode>
```

not:

```jsx
<React.StrictMode>
```

unless `React` itself has also been imported.

---

# 36. CSS Strategy for This Project

The main learning objective is **React**, not CSS.

Therefore, during development:

- Use meaningful `className`s.
- Focus on React logic first.
- Avoid spending large amounts of time styling every component while learning functionality.
- Complete the functionality first.
- Apply/refine the complete styling later.

Example:

```jsx
<div className="product-card">
  <img className="product-card__image" />
  <h2 className="product-card__title"></h2>
</div>
```

The class names establish the structure without distracting from React concepts.

---

# 37. Development Workflow

For each ShopSphere feature, follow this cycle:

```text
1. Understand the requirement
        ↓
2. Identify React concepts needed
        ↓
3. Build a small piece
        ↓
4. Run the application
        ↓
5. Inspect the result
        ↓
6. Debug
        ↓
7. Refactor
        ↓
8. Understand why it works
        ↓
9. Move to the next feature
```

The goal is **not**:

```text
Copy code → project works → move on
```

The goal is:

```text
Understand → Build → Debug → Explain → Improve
```

---

# 38. Production-Style Learning Roadmap

ShopSphere will progressively cover:

### Phase 1 — Foundation

- Vite
- React project structure
- Components
- JSX
- Props
- State
- Effects

### Phase 2 — Routing

- BrowserRouter
- Routes
- Route
- Link
- Layouts
- Outlet
- Nested routes
- Dynamic routes
- useParams

### Phase 3 — API Integration

- `fetch`
- API requests
- useEffect
- Loading states
- Error states
- Empty states
- Rendering API data

### Phase 4 — Product Features

- Product grid
- Search
- Filtering
- Sorting
- Pagination
- Product details
- Categories

### Phase 5 — Global State

- Cart
- Context API
- `useContext`
- Shared application state

### Phase 6 — Reusable Logic

- Custom hooks
- API service layer
- Separation of concerns

### Phase 7 — Authentication

- Login
- Authentication state
- Protected routes
- Account pages

### Phase 8 — Advanced React

- Nested account routes
- Lazy loading
- Performance
- Memoization where appropriate
- Refactoring
- Production-oriented architecture

---

# 39. Current Learning Position

At this point, the important concepts understood are:

```text
React
├── Components
├── JSX
├── Props
├── Lists / map()
├── Keys
├── useState
├── useEffect
│   ├── Dependencies
│   ├── Dependency comparison
│   └── Cleanup
│
├── React Router
│   ├── BrowserRouter
│   ├── Routes
│   ├── Route
│   ├── Link
│   ├── Layouts
│   ├── Outlet
│   ├── Nested routes
│   ├── Dynamic routes
│   └── useParams
│
├── Vite
└── Project architecture
```

---

# 40. Next React Topic

The next major step is:

## API Integration for Product Details

We will connect:

```text
/products/:productId
```

to the DummyJSON API.

The learning flow will be:

```text
URL
 ↓
useParams()
 ↓
productId
 ↓
useEffect()
 ↓
fetch()
 ↓
API response
 ↓
useState()
 ↓
Loading / Error / Success
 ↓
ProductDetails UI
```

This will combine several concepts already learned into one realistic React feature.

---

# Quick Revision Cheat Sheet

## Component

```jsx
function Component() {
  return <div>Hello</div>;
}
```

## Props

```jsx
<Component name="Aniket" />
```

```jsx
function Component({ name }) {
  return <h1>{name}</h1>;
}
```

## State

```jsx
const [value, setValue] = useState(initialValue);
```

## Effect

```jsx
useEffect(() => {
  // side effect
}, [dependencies]);
```

## Cleanup

```jsx
useEffect(() => {
  // setup

  return () => {
    // cleanup
  };
}, []);
```

## Route

```jsx
<Route
  path="/products"
  element={<Products />}
/>
```

## Link

```jsx
<Link to="/products">
  Products
</Link>
```

## Layout

```jsx
function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
```

## Dynamic Route

```jsx
<Route
  path="/products/:productId"
  element={<ProductDetails />}
/>
```

## Dynamic Parameter

```jsx
const { productId } = useParams();
```

---

# Core Rule to Remember

When learning React, always ask:

> **What is responsible for this?**

- UI structure → **Component**
- Data passed into a component → **Props**
- Data that changes → **State**
- External side effect → **Effect**
- URL → page mapping → **React Router**
- Shared route UI → **Layout**
- Child route location → **Outlet**
- Dynamic URL value → **useParams**
- API result → usually **State**, populated through an **Effect**
