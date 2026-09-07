import { Link } from "react-router-dom";
import "./Cart.css";

function Cart({
  cartItems = [],
  onUpdateQuantity,
  onRemoveFromCart,
}) {
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const formattedSubtotal = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(subtotal);

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container cart-empty">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h1>
            Tu carrito está vacío
          </h1>

          <p>
            Todavía no agregaste ningún producto.
          </p>

          <Link to="/menu">
            Ver menú
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="cart-container">

        <div className="cart-heading">
          <span className="section-label">
            TU PEDIDO
          </span>

          <h1>
            Carrito
          </h1>

          <p>
            Revisá tus productos antes de continuar.
          </p>
        </div>

        <div className="cart-layout">

          <div className="cart-products">

            {cartItems.map((item) => {
              const itemTotal =
                item.price * item.quantity;

              const formattedItemTotal =
                new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  maximumFractionDigits: 0,
                }).format(itemTotal);

              return (
                <article
                  key={item.id}
                  className="cart-item"
                >

                  <div className="cart-item-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <span>🍔</span>
                    )}
                  </div>

                  <div className="cart-item-info">

                    <h2>
                      {item.name}
                    </h2>

                    <p>
                      {item.categoryName}
                    </p>

                    <strong>
                      {formattedItemTotal}
                    </strong>

                  </div>

                  <div className="cart-item-actions">

                    <div className="cart-quantity">

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity?.(
                            item.id,
                            item.quantity - 1
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity?.(
                            item.id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                    <button
                      type="button"
                      className="remove-item"
                      onClick={() =>
                        onRemoveFromCart?.(item.id)
                      }
                    >
                      Eliminar
                    </button>

                  </div>

                </article>
              );
            })}

            <Link to="/menu" className="continue-shopping">
              ← Seguir comprando
            </Link>

          </div>

          <aside className="cart-summary">

            <h2>
              Resumen
            </h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formattedSubtotal}</strong>
            </div>

            <div className="summary-row">
              <span>Envío</span>
              <strong>A coordinar</strong>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>{formattedSubtotal}</strong>
            </div>

            <Link
              to="/checkout"
              className="checkout-button"
            >
              Continuar pedido
            </Link>

            <p className="cart-note">
              El costo y modalidad de entrega se
              coordinarán durante el pedido.
            </p>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default Cart;