import { Link } from "react-router-dom";
import "./Header.css";

function Header({ cartCount = 0 }) {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <div className="logo-icon">AK</div>

          <div className="logo-text">
            <span className="logo-name">AK PIZZAS</span>
            <span className="logo-subtitle">Hamburguesas · Pizzas · Lomos</span>
          </div>
        </Link>

        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Inicio
          </Link>

          <Link to="/menu" className="nav-link">
            Menú
          </Link>

          <Link to="/menu?category=combos" className="nav-link nav-highlight">
            Combos
          </Link>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="account-button" title="Mi cuenta">
            <span className="account-icon">👤</span>
          </Link>

          <Link to="/cart" className="cart-button" title="Carrito">
            <span className="cart-icon">🛒</span>

            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;