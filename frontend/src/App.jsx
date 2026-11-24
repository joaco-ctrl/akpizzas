import { useCallback, useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import api, { getApiError, getProductImageUrl } from "./services/api";
import { categoryIdFromName } from "./data/categories";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Loginn";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";

function normalizeProduct(product) {
  const categoryName = product.categoria_nombre || "Otros";
  return {
    id: Number(product.id),
    name: product.nombre,
    description: product.descripcion || "",
    price: Number(product.precio),
    image: getProductImageUrl(product.imagen_url),
    categoryName,
    category: categoryIdFromName(categoryName),
    categoryId: Number(product.categoria_id),
  };
}

function isAdminRole(role) {
  return typeof role === "string" && role.trim().toLocaleLowerCase("es-AR") === "admin";
}

function RequireAuth({ user, isLoading, children }) {
  const location = useLocation();
  if (isLoading) return <p className="route-loading">Verificando sesión...</p>;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (isAdminRole(user.rol)) return <Navigate to="/admin/catalogo/productos" replace />;
  return children;
}

function RequireAdmin({ user, isLoading, children }) {
  const location = useLocation();
  if (isLoading) return <p className="route-loading">Verificando permisos...</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isAdminRole(user.rol)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartRows, setCartRows] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(
    Boolean(localStorage.getItem("akpizzas_token"))
  );
  const isAuthenticated = Boolean(user);
  const [catalogError, setCatalogError] = useState("");
  const [notice, setNotice] = useState("");
  const cartItems = useMemo(() => cartRows.map((item) => {
    const product = products.find((entry) => entry.id === Number(item.producto_id));
    return {
      ...product,
      id: Number(item.id),
      productId: Number(item.producto_id),
      orderId: Number(item.pedido_id),
      name: item.nombre,
      categoryName: product?.categoryName || "",
      image: product?.image || "",
      price: Number(item.precio_unitario),
      quantity: Number(item.cantidad),
    };
  }), [cartRows, products]);

  const loadProducts = useCallback(async () => {
    try {
      const { data } = await api.get("/product/productos");
      setProducts(data.map(normalizeProduct));
      setCatalogError("");
    } catch (error) {
      setCatalogError(getApiError(error, "No se pudo cargar el menú."));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("akpizzas_token");
    if (!token) return;

    api.get("/auth/me")
      .then(({ data }) => {
        setUser(data.usuario);
        localStorage.setItem("akpizzas_user", JSON.stringify(data.usuario));
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("akpizzas_token");
          localStorage.removeItem("akpizzas_user");
        } else {
          setNotice(getApiError(error, "No se pudo verificar la sesión."));
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setCartRows([]);
      setAuthLoading(false);
      navigate("/login", { replace: true });
    };
    window.addEventListener("akpizzas:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("akpizzas:unauthorized", handleUnauthorized);
  }, [navigate]);

  useEffect(() => {
    api.get("/product/productos")
      .then(({ data }) => {
        setProducts(data.map(normalizeProduct));
        setCatalogError("");
      })
      .catch((error) => setCatalogError(getApiError(error, "No se pudo cargar el menú.")));
  }, []);

  useEffect(() => {
    if (!isAuthenticated || isAdminRole(user?.rol)) return;

    api.get("/cart/carrito")
      .then(({ data }) => {
        setCartRows(data);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setUser(null);
          setCartRows([]);
        } else {
          setNotice(getApiError(error, "No se pudo cargar el carrito."));
        }
      });
  }, [isAuthenticated, user?.rol]);

  const refreshCart = async () => {
    const { data } = await api.get("/cart/carrito");
    setCartRows(data);
  };

  const handleLogin = (loggedInUser, redirectTo) => {
    setUser(loggedInUser);
    setAuthLoading(false);
    setNotice("");
    const customerRoute = redirectTo && !redirectTo.startsWith("/admin")
      ? redirectTo
      : "/home";
    navigate(isAdminRole(loggedInUser?.rol) ? "/admin/catalogo/productos" : customerRoute);
  };

  const handleAddToCart = async (product, quantity = 1) => {
    if (isAdminRole(user?.rol)) {
      navigate("/admin/catalogo/productos");
      return;
    }
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/cart/carrito", { idProducto: Number(product.id), cantidad: quantity });
      await refreshCart();
      setNotice("Producto agregado al carrito.");
    } catch (error) {
      setNotice(getApiError(error, "No se pudo agregar el producto."));
    }
  };

  const handleUpdateQuantity = async (idDetalle, quantity) => {
    try {
      if (quantity < 1) {
        await api.delete(`/cart/carrito/${idDetalle}`);
      } else {
        await api.put(`/cart/carrito/${idDetalle}`, { cantidad: quantity });
      }
      await refreshCart();
    } catch (error) {
      setNotice(getApiError(error, "No se pudo actualizar el carrito."));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("akpizzas_token");
    localStorage.removeItem("akpizzas_user");
    setCartRows([]);
    setUser(null);
    setNotice("");
    navigate("/");
  };

  return (
    <div className="app">
      <Header
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdminRole(user?.rol)}
        onLogout={handleLogout}
      />
      {notice && <p className="api-notice" role="status" onClick={() => setNotice("")}>{notice}</p>}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home products={products} onAddToCart={handleAddToCart} />} />
          <Route path="/login" element={isAuthenticated
            ? <Navigate to={isAdminRole(user.rol) ? "/admin/catalogo/productos" : "/home"} replace />
            : <Login onLogin={handleLogin} />} />
          <Route path="/registro" element={isAuthenticated
            ? <Navigate to="/" replace />
            : <Register />} />
          <Route path="/home" element={<Home products={products} onAddToCart={handleAddToCart} />} />
          <Route path="/menu" element={<Menu products={products} onAddToCart={handleAddToCart} catalogError={catalogError} />} />
          <Route path="/producto/:id" element={<ProductDetail products={products} onAddToCart={handleAddToCart} />} />
          <Route path="/carrito" element={
            <RequireAuth user={user} isLoading={authLoading}>
              <Cart cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveFromCart={(id) => handleUpdateQuantity(id, 0)} />
            </RequireAuth>
          } />
          <Route path="/checkout" element={
            <RequireAuth user={user} isLoading={authLoading}>
              <Checkout cartItems={cartItems} onOrderPlaced={refreshCart} />
            </RequireAuth>
          } />
          <Route path="/pedido-confirmado" element={
            <RequireAuth user={user} isLoading={authLoading}>
              <OrderConfirmation />
            </RequireAuth>
          } />
          <Route path="/mis-pedidos" element={
            <RequireAuth user={user} isLoading={authLoading}>
              <MyOrders />
            </RequireAuth>
          } />
          <Route path="/admin/catalogo" element={<Navigate to="/admin/catalogo/productos" replace />} />
          <Route path="/admin/productos" element={<Navigate to="/admin/catalogo/productos" replace />} />
          <Route path="/admin/catalogo/productos" element={
            <RequireAdmin user={user} isLoading={authLoading}>
              <AdminProducts onProductsUpdated={loadProducts} />
            </RequireAdmin>
          } />
          <Route path="/admin/catalogo/categorias" element={
            <RequireAdmin user={user} isLoading={authLoading}>
              <AdminCategories />
            </RequireAdmin>
          } />
          <Route path="/admin/pedidos" element={
            <RequireAdmin user={user} isLoading={authLoading}>
              <AdminOrders />
            </RequireAdmin>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;