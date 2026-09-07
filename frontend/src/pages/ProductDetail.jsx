import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { products } from "./Menu";
import "./ProductDetail.css";

function ProductDetail({ onAddToCart }) {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === id
  );

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="product-not-found">
        <div>
          <span>🍔</span>
          <h1>Producto no encontrado</h1>
          <p>
            El producto que estás buscando no existe.
          </p>

          <Link to="/menu">
            Volver al menú
          </Link>
        </div>
      </main>
    );
  }

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(product.price);

  const total = product.price * quantity;

  const formattedTotal = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(total);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart?.(product);
    }
  };

  return (
    <main className="product-detail-page">

      <div className="product-detail-container">

        <Link to="/menu" className="back-menu">
          ← Volver al menú
        </Link>

        <div className="product-detail">

          <div className="detail-image">

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
              />
            ) : (
              <div className="detail-placeholder">
                <span>🍔</span>
              </div>
            )}

          </div>

          <div className="detail-info">

            <span className="detail-category">
              {product.categoryName}
            </span>

            <h1>
              {product.name}
            </h1>

            {product.description && (
              <p className="detail-description">
                {product.description}
              </p>
            )}

            <div className="detail-price">
              {formattedPrice}
            </div>

            <div className="quantity-area">

              <span className="quantity-label">
                Cantidad
              </span>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.max(1, value - 1)
                    )
                  }
                >
                  −
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) => value + 1)
                  }
                >
                  +
                </button>

              </div>

            </div>

            <div className="detail-add">

              <div>
                <span>Total</span>
                <strong>{formattedTotal}</strong>
              </div>

              <button
                type="button"
                onClick={handleAdd}
              >
                Agregar al carrito
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default ProductDetail;