import { Link } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  return (
    <main className="confirmation-page">

      <div className="confirmation-card">

        <div className="confirmation-icon">
          ✓
        </div>

        <span className="section-label">
          AK PIZZAS
        </span>

        <h1>
          ¡Pedido confirmado!
        </h1>

        <p>
          Recibimos tu pedido correctamente.
          Pronto nos estaremos comunicando para
          coordinar los detalles de la entrega.
        </p>

        <div className="confirmation-info">

          <div>
            <span>
              Horario de atención
            </span>

            <strong>
              Miércoles a Domingo
            </strong>

            <small>
              20:00 a 23:30 hs.
            </small>
          </div>

          <div>
            <span>
              Dirección
            </span>

            <strong>
              Mariano Roldán 417
            </strong>

            <small>
              Benito Juárez, Buenos Aires
            </small>
          </div>

        </div>

        <div className="confirmation-actions">

          <Link to="/menu">
            Seguir comprando
          </Link>

          <Link to="/my-orders">
            Ver mis pedidos
          </Link>

        </div>

      </div>

    </main>
  );
}

export default OrderConfirmation;