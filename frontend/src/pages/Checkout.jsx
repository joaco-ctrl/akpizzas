import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Checkout.css";

function Checkout({ cartItems = [], clearCart }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    payment: "efectivo",
  });

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const formattedTotal = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(subtotal);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    clearCart?.();

    navigate("/order-confirmation");
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
            Completá tus datos para realizar el pedido.
          </p>
        </div>

        <div className="checkout-layout">

          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >

            <section className="checkout-section">

              <h2>
                Datos de contacto
              </h2>

              <div className="checkout-form-grid">

                <label>
                  Nombre

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                </label>

                <label>
                  Teléfono

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Tu teléfono"
                    required
                  />
                </label>

              </div>

            </section>

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
                  placeholder="Dirección de entrega"
                  required
                />
              </label>

              <label>
                Notas del pedido

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Alguna aclaración para tu pedido..."
                  rows="4"
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
                    value="efectivo"
                    checked={form.payment === "efectivo"}
                    onChange={handleChange}
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
                    value="transferencia"
                    checked={form.payment === "transferencia"}
                    onChange={handleChange}
                  />

                  <span>
                    🏦
                  </span>

                  <div>
                    <strong>
                      Transferencia
                    </strong>

                    <small>
                      Coordinaremos los datos
                    </small>
                  </div>
                </label>

              </div>

            </section>

            <button
              type="submit"
              className="place-order-button"
            >
              Confirmar pedido
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
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        maximumFractionDigits: 0,
                      }).format(item.price)}
                    </span>
                  </div>

                  <strong>
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      maximumFractionDigits: 0,
                    }).format(item.price * item.quantity)}
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