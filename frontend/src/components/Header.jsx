import { Link } from "react-router-dom";
import "./Header.css";

function Header({ cartCount = 0, isAuthenticated = false, isAdmin = false }) {
  return (
    <header className="header">
      <div className="header-container">

        {/* LOGO + NOMBRE */}
        <Link to="/" className="header-logo">

          <img
            src="/logo.jpg"
            alt="AK Pizzas"
            className="header-logo-image"
          />

          <span className="header-logo-name">
            AK PIZZAS
          </span>

        </Link>


        {/* NAVEGACIÓN */}
        <nav className="header-nav">

          <Link to="/" className="nav-link">
            Inicio
          </Link>

          <Link to="/menu" className="nav-link">
            Menú
          </Link>

          {isAdmin && (
            <>
              <Link to="/admin/pedidos" className="nav-link nav-highlight">
                Pedidos
              </Link>
              <Link to="/admin/catalogo/productos" className="nav-link nav-highlight nav-admin-catalog">
                Catálogo
              </Link>
            </>
          )}

          <Link
            to="/menu?category=combos"
            className="nav-link nav-highlight"
          >
            Combos
          </Link>

        </nav>


        {/* ACCIONES */}
        <div className="header-actions">

          <Link
            to={isAuthenticated ? "/perfil" : "/login"}
            className="account-button"
            title="Mi perfil"
            aria-label="Mi perfil"
          >
            <span className="account-icon">👤</span>
          </Link>

          <Link
            to="/carrito"
            className="cart-button"
            title="Carrito"
          >
            <span className="cart-icon">🛒</span>

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}

          </Link>

        </div>

      </div>
    </header>
  );
}

export default Header;