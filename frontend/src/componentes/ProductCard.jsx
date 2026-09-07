import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product, onAddToCart }) {
  const {
    id,
    name,
    description,
    price,
    category,
    image,
  } = product;

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <article className="product-card">

      <Link to={`/producto/${id}`} className="product-image-link">
        <div className="product-image">

          {image ? (
            <img src={image} alt={name} />
          ) : (
            <div className="product-placeholder">
              <span>🍔</span>
            </div>
          )}

          {category && (
            <span className="product-category">
              {category}
            </span>
          )}
        </div>
      </Link>

      <div className="product-content">

        <Link to={`/producto/${id}`} className="product-title-link">
          <h3 className="product-title">
            {name}
          </h3>
        </Link>

        {description && (
          <p className="product-description">
            {description}
          </p>
        )}

        <div className="product-footer">

          <span className="product-price">
            {formattedPrice}
          </span>

          <button
            type="button"
            className="add-product-button"
            onClick={() => onAddToCart?.(product)}
            aria-label={`Agregar ${name} al carrito`}
          >
            <span>+</span>
          </button>

        </div>

      </div>
    </article>
  );
}

export default ProductCard;