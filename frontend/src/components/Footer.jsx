import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-main">

        <div className="footer-container">

          {/* MARCA */}

          <div className="footer-brand">

            <div className="footer-brand-header">

              <img
  src="/logo.jpg"
  alt="AK Pizzas"
  className="footer-logo-image"
/>

              <div className="footer-brand-name">
                <h2>AK Pizzas</h2>
                <span>La pizzería de tu barrio</span>
              </div>

            </div>

            <p className="footer-description">
              Junto a ustedes desde 2016, preparando
              hamburguesas, pizzas, lomos y mucho más
              para compartir buenos momentos.
            </p>

          </div>


          {/* HORARIOS */}

          <div className="footer-column">

            <h3>Horario de Atención</h3>

            <p className="footer-highlight">
              Miércoles a Domingo
            </p>

            <p>
              20:00 a 23:30 hs.
            </p>

            <div className="closed-status">
              <span className="status-dot"></span>
              Actualmente cerrado
            </div>

          </div>


          {/* NOSOTROS */}

          <div className="footer-column">

            <h3>Nosotros</h3>

            <p>
              Somos AK Pizzas. Desde 2016 compartiendo
              buenos momentos con nuestros clientes.
            </p>

            <Link
              to="/menu"
              className="footer-link"
            >
              Ver nuestro menú →
            </Link>

          </div>


          {/* CONTACTO */}

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


      {/* PARTE INFERIOR */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
            © {new Date().getFullYear()} AK Pizzas.
            Todos los derechos reservados.
          </p>

          <p>
            Hecho con ❤️ para nuestros clientes
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;