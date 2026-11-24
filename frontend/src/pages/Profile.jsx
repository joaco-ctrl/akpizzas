import { Link } from "react-router-dom";
import "./Profile.css";

function Profile({ user, onLogout }) {
  const isAdmin = typeof user?.rol === "string" &&
    user.rol.trim().toLocaleLowerCase("es-AR") === "admin";

  return (
    <main className="profile-page">
      <div className="profile-container">
        <header className="profile-heading">
          <span className="section-label">MI CUENTA</span>
          <h1>Mi perfil</h1>
          <p>Consultá tu cuenta y administrá tu sesión.</p>
        </header>

        <section className="profile-card" aria-label="Información de la cuenta">
          <div className="profile-avatar" aria-hidden="true">👤</div>
          <div className="profile-details">
            <div>
              <span>Correo electrónico</span>
              <strong>{user?.email || "No disponible"}</strong>
            </div>
            <div>
              <span>Tipo de cuenta</span>
              <strong>{isAdmin ? "Administrador" : "Cliente"}</strong>
            </div>
          </div>

          <div className="profile-actions">
            {isAdmin ? (
              <Link to="/admin/catalogo/productos" className="profile-secondary-action">
                Ir al catálogo
              </Link>
            ) : (
              <Link to="/mis-pedidos" className="profile-secondary-action">
                Mis pedidos
              </Link>
            )}
            <button type="button" className="profile-logout-button" onClick={onLogout}>
              Cerrar sesión
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;