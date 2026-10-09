import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getApiError } from "../services/api";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cart/pedidos")
      .then(({ data }) => setOrders(data))
      .catch((requestError) => setError(getApiError(requestError, "No se pudieron cargar tus pedidos.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="orders-page">

      <div className="orders-container">

        <div className="orders-heading">

          <span className="section-label">
            MI CUENTA
          </span>

          <h1>
            Mis pedidos
          </h1>

          <p>
            Consultá tus pedidos realizados.
          </p>

        </div>

        <div className="orders-list">

          {loading && <p>Cargando pedidos...</p>}
          {error && <p role="alert">{error}</p>}
          {!loading && !error && orders.length === 0 && <p>Todavía no tenés pedidos realizados.</p>}
          {orders.map((order) => (
            <article
              className="order-card"
              key={order.id}
            >

              <div className="order-top">

                <div>
                  <span>
                    Pedido
                  </span>

                  <h2>
                    #{String(order.id).padStart(5, "0")}
                  </h2>
                </div>

                <span className="order-status">
                  {order.estadoPedido.replaceAll("_", " ")}
                </span>

              </div>

              <div className="order-body">

                <div className="order-date">
                  {new Date(order.fecha).toLocaleDateString("es-AR")}
                </div>

                <div className="order-items">
                  {order.productos.map((item) => (
                    <span key={item.id}>
                      {item.cantidad} × {item.nombre}
                    </span>
                  ))}
                </div>

              </div>

              <div className="order-bottom">

                <span>
                  Total
                </span>

                <strong>
                  {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        maximumFractionDigits: 0,
                      }).format(order.total)}
                </strong>

              </div>

            </article>
          ))}

        </div>

        <div className="orders-cta">

          <h2>
            ¿Querés hacer un pedido?
          </h2>

          <p>
            Explorá nuestro menú y elegí tus favoritos.
          </p>

          <Link to="/menu">
            Ver menú
          </Link>

        </div>

      </div>

    </main>
  );
}

export default MyOrders;