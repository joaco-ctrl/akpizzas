import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">

          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">AK</div>

              <div>
                <h2>AK Pizzas</h2>
                <p>Hamburguesas · Pizzas · Lomos</p>
              </div>
            </div>

            <p className="footer-description">
              Junto a ustedes desde 2016.
              <br />
              Gracias por elegirnos.
            </p>
          </div>

          <div className="footer-column">
            <h3>Horario de Atención</h3>

            <div className="footer-schedule">
              <p>
                <strong>Miércoles a Domingo</strong>
              </p>

              <p>20:00 a 23:30 hs.</p>

              <span className="closed-status">
                <span className="status-dot"></span>
                La tienda se encuentra cerrada para realizar pedidos
              </span>
            </div>
          </div>

          <div className="footer-column">
            <h3>Nosotros</h3>

            <p className="footer-about">
              Junto a ustedes desde 2016, gracias por elegirnos.
            </p>

            <Link to="/menu" className="footer-link">
              Ver nuestro menú →
            </Link>
          </div>

          <div className="footer-column">
            <h3>Encontranos</h3>

            <div className="footer-contact">
              <p>
                <span className="contact-icon">📍</span>
                Mariano Roldán 417
                <br />
                Benito Juárez, Buenos Aires
              </p>

              <p>
                <span className="contact-icon">📞</span>
                +54 9 2281 561721
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>
            © {new Date().getFullYear()} AK Pizzas. Todos los derechos reservados.
          </p>

          <p>Hecho con ❤️ para nuestros clientes</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;