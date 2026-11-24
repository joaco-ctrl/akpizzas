import { NavLink } from "react-router-dom";
import "./AdminCatalogNav.css";

function AdminCatalogNav() {
  return (
    <nav className="admin-catalog-nav" aria-label="Secciones del catálogo">
      <NavLink
        to="/admin/catalogo/productos"
        className={({ isActive }) => `admin-catalog-tab${isActive ? " is-active" : ""}`}
      >
        Productos
      </NavLink>
      <NavLink
        to="/admin/catalogo/categorias"
        className={({ isActive }) => `admin-catalog-tab${isActive ? " is-active" : ""}`}
      >
        Categorías
      </NavLink>
    </nav>
  );
}

export default AdminCatalogNav;
