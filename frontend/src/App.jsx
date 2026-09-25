import { Routes, Route, Navigate } from "react-router-dom";

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

function App() {
  return (
    <div className="app">

      <Header />

      <main className="app-main">
        <Routes>

          {/* LOGIN */}
          <Route path="/" element={<Login />} />

          {/* REGISTRO */}
          <Route path="/registro" element={<Register />} />

          {/* HOME */}
          <Route path="/home" element={<Home />} />

          {/* MENÚ */}
          <Route path="/menu" element={<Menu />} />

          {/* DETALLE DEL PRODUCTO */}
          <Route path="/producto/:id" element={<ProductDetail />} />

          {/* CARRITO */}
          <Route path="/carrito" element={<Cart />} />

          {/* CHECKOUT */}
          <Route path="/checkout" element={<Checkout />} />

          {/* PEDIDO CONFIRMADO */}
          <Route
            path="/pedido-confirmado"
            element={<OrderConfirmation />}
          />

          {/* MIS PEDIDOS */}
          <Route
            path="/mis-pedidos"
            element={<MyOrders />}
          />

          {/* CUALQUIER RUTA QUE NO EXISTA */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </main>

      <Footer />

    </div>
  );
}

export default App;