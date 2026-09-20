import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import AdminLayout from "./components/AdminLayout";

// Routes
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReviews from "./pages/admin/AdminReviews";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* ================= PROTECTED USER ROUTES ================= */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= PROTECTED ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* /admin */}
          <Route index element={<AdminDashboard />} />
          {/* /admin/products */}
          <Route path="products" element={<AdminProducts />} />
          {/* /admin/products/new */}
          <Route path="products/new" element={<AddProduct />} />
          {/* /admin/products/:id/edit */}
          <Route path="products/:id/edit" element={<EditProduct />} />
          {/* /admin/categories */}
          <Route path="categories" element={<AdminCategories />} />
          {/* /admin/users */}
          <Route path="users" element={<AdminUsers />} />
          {/* /admin/orders */}
          <Route path="orders" element={<AdminOrders />} />
          {/* /admin/reviews */}
          <Route path="reviews" element={<AdminReviews />} />
        </Route>

        {/* ================= 404 ROUTE ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

App.displayName = "App";
export default App;