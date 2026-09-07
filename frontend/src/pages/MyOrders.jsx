import { Link } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const orders = [
    {
      id: "#AK-001",
      date: "Pedido reciente",
      status: "Confirmado",
      total: 0,
      items: [
        "Tus pedidos aparecerán aquí cuando realices una compra.",
      ],
    },
  ];

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
                    {order.id}
                  </h2>
                </div>

                <span className="order-status">
                  {order.status}
                </span>

              </div>

              <div className="order-body">

                <div className="order-date">
                  {order.date}
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <span key={index}>
                      {item}
                    </span>
                  ))}
                </div>

              </div>

              <div className="order-bottom">

                <span>
                  Total
                </span>

                <strong>
                  {order.total > 0
                    ? new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        maximumFractionDigits: 0,
                      }).format(order.total)
                    : "Sin pedidos todavía"}
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