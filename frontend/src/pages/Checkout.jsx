import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api, { getApiError } from "../services/api";
import "./Checkout.css";

const whatsappNumber = "5492281466743";
const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function createWhatsAppTicket(cartItems, orderId, address, total) {
  const productLines = cartItems.map((item) =>
    `• ${item.quantity} × ${item.name}: ${currency.format(item.price * item.quantity)}`
  );
  const message = [
    `Hola AK Pizzas, quiero confirmar el pedido #${orderId}.`,
    "",
    "Detalle del pedido:",
    ...productLines,
    "",
    `Total: ${currency.format(total)}`,
    "Envío: a coordinar",
    `Dirección: ${address.trim()}`,
    "Pago: a coordinar por WhatsApp.",
  ].join("\n");
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function Checkout({ cartItems = [], onOrderPlaced }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("EFECTIVO");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const formattedTotal = currency.format(subtotal);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const idPedido = cartItems[0]?.orderId;
    if (!idPedido) {
      setError("No se encontró el pedido pendiente. Actualizá el carrito e intentá nuevamente.");
      return;
    }

    const whatsappUrl = paymentMethod === "WHATSAPP"
      ? createWhatsAppTicket(cartItems, idPedido, form.address, subtotal)
      : null;
    const whatsappTab = whatsappUrl ? window.open("about:blank", "_blank") : null;
    if (whatsappTab) whatsappTab.opener = null;

    setSubmitting(true);
    setError("");
    try {
      await api.put("/cart/actualizar-entrega", {
        idPedido,
        metodoEntrega: "DELIVERY",
        metodoPago: paymentMethod,
        direccion: form.address,
      });

      await onOrderPlaced?.();
      navigate("/pedido-confirmado", {
        state: { whatsappOrder: Boolean(whatsappUrl), whatsappUrl },
      });
      if (whatsappUrl) {
        if (whatsappTab && !whatsappTab.closed) {
          whatsappTab.location.href = whatsappUrl;
        } else {
          window.location.assign(whatsappUrl);
        }
      }
    } catch (requestError) {
      if (whatsappTab && !whatsappTab.closed) whatsappTab.close();
      setError(getApiError(requestError, "No se pudo confirmar el pedido."));
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">

          <span>🛒</span>

          <h1>
            No hay productos para comprar
          </h1>

          <p>
            Agregá algún producto antes de continuar.
          </p>

          <Link to="/menu">
            Ir al menú
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        <div className="checkout-heading">
          <span className="section-label">
            FINALIZAR PEDIDO
          </span>

          <h1>
            Checkout
          </h1>

          <p>
            Indicá la dirección de entrega y elegí cómo coordinar el pago.
          </p>
        </div>

        <div className="checkout-layout">

          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >
            {error && <p role="alert">{error}</p>}

            <section className="checkout-section">

              <h2>
                Datos de entrega
              </h2>

              <label>
                Dirección

                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  maxLength="255"
                  placeholder="Dirección de entrega"
                  required
                />
              </label>

            </section>

            <section className="checkout-section">

              <h2>
                Medio de pago
              </h2>

              <div className="payment-options">

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="EFECTIVO"
                    checked={paymentMethod === "EFECTIVO"}
                    onChange={() => setPaymentMethod("EFECTIVO")}
                  />

                  <span>
                    💵
                  </span>

                  <div>
                    <strong>
                      Efectivo
                    </strong>

                    <small>
                      Pago al recibir el pedido
                    </small>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="WHATSAPP"
                    checked={paymentMethod === "WHATSAPP"}
                    onChange={() => setPaymentMethod("WHATSAPP")}
                  />

                  <span aria-hidden="true">💬</span>

                  <div>
                    <strong>Coordinar por WhatsApp</strong>
                    <small>Abre el ticket para enviarlo a AK Pizzas</small>
                  </div>
                </label>

              </div>

            </section>

            <button
              type="submit"
              className="place-order-button"
              disabled={submitting}
            >
              {submitting
                ? "Procesando..."
                : paymentMethod === "WHATSAPP"
                  ? "Confirmar y abrir WhatsApp"
                  : "Confirmar pedido"}
            </button>

          </form>

          <aside className="checkout-summary">

            <h2>
              Tu pedido
            </h2>

            <div className="checkout-items">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="checkout-item"
                >

                  <div>
                    <strong>
                      {item.quantity} × {item.name}
                    </strong>

                    <span>
                      {currency.format(item.price)}
                    </span>
                  </div>

                  <strong>
                    {currency.format(item.price * item.quantity)}
                  </strong>

                </div>
              ))}

            </div>

            <div className="checkout-total">
              <span>
                Total
              </span>

              <strong>
                {formattedTotal}
              </strong>
            </div>

            <p className="checkout-info">
              Miércoles a Domingo de 20:00 a 23:30 hs.
            </p>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default Checkout;