import { useEffect, useMemo, useState } from "react";
import api, { getApiError } from "../services/api";
import "./AdminOrders.css";

const orderStates = [
  { value: "EN_PREPARACION", label: "En preparación" },
  { value: "LISTO", label: "Listo" },
  { value: "EN_CAMINO", label: "En camino" },
  { value: "ENTREGADO", label: "Entregado" },
  { value: "CANCELADO", label: "Cancelado" },
];

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateTime = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("EN_PREPARACION");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    let active = true;
    const loadOrders = () => {
      api.get("/admin/pedidos")
        .then(({ data }) => {
          if (!active) return;
          setOrders(data);
          setError("");
        })
        .catch((requestError) => {
          if (active) setError(getApiError(requestError, "No se pudieron cargar los pedidos."));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };

    loadOrders();
    const refreshTimer = window.setInterval(loadOrders, 30_000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, [refreshIndex]);

  const filteredOrders = useMemo(() => filter === "TODOS"
    ? orders
    : orders.filter((order) => order.estadoPedido === filter), [filter, orders]);

  const updateStatus = async (orderId, estado) => {
    setUpdatingOrderId(orderId);
    setError("");
    try {
      await api.put(`/admin/pedidos/${orderId}/estado`, { estado });
      setRefreshIndex((current) => current + 1);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo actualizar el pedido."));
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <main className="admin-orders-page">
      <div className="admin-orders-container">
        <header className="admin-orders-heading">
          <div>
            <span className="section-label">PANEL DE ADMINISTRACIÓN</span>
            <h1>Pedidos</h1>
            <p>Revisá las compras confirmadas y actualizá su estado de preparación y entrega.</p>
          </div>
          <button
            type="button"
            className="admin-orders-refresh"
            onClick={() => setRefreshIndex((current) => current + 1)}
            disabled={loading}
          >
            ↻ <span>Actualizar</span>
          </button>
        </header>

        <section className="admin-orders-stats" aria-label="Resumen de pedidos">
          <article>
            <span>Por preparar</span>
            <strong>{orders.filter((order) => order.estadoPedido === "EN_PREPARACION").length}</strong>
          </article>
          <article>
            <span>Listos / en camino</span>
            <strong>{orders.filter((order) => ["LISTO", "EN_CAMINO"].includes(order.estadoPedido)).length}</strong>
          </article>
          <article>
            <span>Entregados</span>
            <strong>{orders.filter((order) => order.estadoPedido === "ENTREGADO").length}</strong>
          </article>
        </section>

        {error && <p className="admin-orders-error" role="alert">{error}</p>}

        <div className="admin-orders-toolbar">
          <div>
            <span className="section-label">COMANDAS</span>
            <h2>{filter === "EN_PREPARACION" ? "Nuevos pedidos" : "Pedidos confirmados"}</h2>
          </div>
          <label>
            Mostrar
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="EN_PREPARACION">Por preparar</option>
              <option value="LISTO">Listos</option>
              <option value="EN_CAMINO">En camino</option>
              <option value="ENTREGADO">Entregados</option>
              <option value="CANCELADO">Cancelados</option>
              <option value="TODOS">Todos</option>
            </select>
          </label>
        </div>

        {loading ? (
          <p className="admin-orders-empty">Cargando pedidos...</p>
        ) : filteredOrders.length === 0 ? (
          <section className="admin-orders-empty">
            <span aria-hidden="true">🍕</span>
            <h2>{filter === "EN_PREPARACION" ? "No hay pedidos por preparar" : "No hay pedidos en esta lista"}</h2>
            <p>Los pedidos aparecen acá cuando el cliente confirma su compra.</p>
          </section>
        ) : (
          <section className="admin-orders-list" aria-label="Lista de pedidos">
            {filteredOrders.map((order) => (
              <article className="admin-order-card" key={order.id}>
                <header className="admin-order-header">
                  <div>
                    <span>Pedido</span>
                    <h2>#{String(order.id).padStart(5, "0")}</h2>
                  </div>
                  <div className={`admin-order-status status-${order.estadoPedido.toLowerCase()}`}>
                    {orderStates.find((state) => state.value === order.estadoPedido)?.label || order.estadoPedido}
                  </div>
                </header>

                <div className="admin-order-content">
                  <section className="admin-order-customer">
                    <h3>Cliente</h3>
                    <strong>{order.cliente.nombre || "Sin nombre"}</strong>
                    <span>{order.cliente.telefono || "Sin teléfono informado"}</span>
                    <span>{order.cliente.email}</span>
                    <span>{dateTime.format(new Date(order.fecha))}</span>
                  </section>

                  <section className="admin-order-delivery">
                    <h3>Entrega y pago</h3>
                    <strong>{order.metodoEntrega === "DELIVERY" ? "Envío a domicilio" : "Retiro en el local"}</strong>
                    {order.direccion && <span>{order.direccion}</span>}
                    <span>{order.metodoPago === "EFECTIVO" ? "Efectivo · pago al recibir" : order.metodoPago.replaceAll("_", " ")}</span>
                    {order.costoEnvio > 0 && <span>Envío: {currency.format(order.costoEnvio)}</span>}
                  </section>
                </div>

                <div className="admin-order-items">
                  <h3>Productos</h3>
                  {order.productos.map((product, index) => (
                    <div className="admin-order-item" key={`${product.id}-${index}`}>
                      <span>{product.cantidad} × {product.nombre}</span>
                      <strong>{currency.format(product.cantidad * product.precio)}</strong>
                    </div>
                  ))}
                </div>

                <footer className="admin-order-footer">
                  <div className="admin-order-total">
                    <span>Total del pedido</span>
                    <strong>{currency.format(order.total)}</strong>
                  </div>
                  <label className="admin-order-state-control">
                    Estado
                    <select
                      value={order.estadoPedido}
                      onChange={(event) => updateStatus(order.id, event.target.value)}
                      disabled={updatingOrderId === order.id}
                    >
                      {orderStates.map((state) => (
                        <option key={state.value} value={state.value}>{state.label}</option>
                      ))}
                    </select>
                  </label>
                </footer>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default AdminOrders;
