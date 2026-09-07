import { Link } from "react-router-dom";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "./Menu";
import "./Home.css";

function Home({ onAddToCart }) {
  const [featuredProducts] = useState(() =>
    products.filter((product) =>
      [
        "combo-americana-pepsi",
        "combo-bacon-pepsi-black",
        "bacon-jam",
        "tasty-doble",
        "tasty-triple",
        "pizza-muzza",
      ].includes(product.id)
    )
  );

  return (
    <main className="home">

      {/* HERO */}

      <section className="home-hero">
        <div className="home-hero-overlay"></div>

        <div className="home-container home-hero-content">
          <span className="hero-small-title">
            AK PIZZAS
          </span>

          <h1>
            Hambre de algo
            <span> increíble?</span>
          </h1>

          <p>
            Hamburguesas, pizzas, lomos y mucho más.
            Preparado para vos en Benito Juárez.
          </p>

          <div className="hero-buttons">
            <Link to="/menu" className="hero-primary-button">
              Ver menú
            </Link>

            <Link to="/menu?category=combos" className="hero-secondary-button">
              Ver combos
            </Link>
          </div>
        </div>
      </section>

      {/* PRESENTACIÓN */}

      <section className="home-intro">
        <div className="home-container intro-grid">

          <div className="intro-text">
            <span className="section-label">
              DESDE 2016
            </span>

            <h2>
              Sabor que nos
              <span> acompaña.</span>
            </h2>

            <p>
              Junto a ustedes desde 2016, preparando hamburguesas,
              pizzas, lomos y mucho más para compartir buenos momentos.
            </p>

            <p>
              Elegí tu favorito y armá tu pedido.
            </p>

            <Link to="/menu" className="intro-button">
              Explorar menú
            </Link>
          </div>

          <div className="intro-card">
            <div className="intro-card-icon">
              🍔
            </div>

            <h3>
              Hecho para disfrutar
            </h3>

            <p>
              Productos abundantes, combinaciones clásicas
              y opciones para todos los gustos.
            </p>
          </div>

        </div>
      </section>

      {/* CATEGORÍAS */}

      <section className="home-categories">
        <div className="home-container">

          <div className="section-heading">
            <span className="section-label">
              ELEGÍ LO QUE TENÉS GANAS
            </span>

            <h2>
              Nuestro menú
            </h2>

            <p>
              Todo lo que podés encontrar en AK Pizzas.
            </p>
          </div>

          <div className="category-grid">

            <Link
              to="/menu?category=combos"
              className="category-card category-card-red"
            >
              <span className="category-icon">🍔</span>
              <h3>Combos</h3>
              <p>Hamburguesa + papas + bebida</p>
            </Link>

            <Link
              to="/menu?category=dobles"
              className="category-card"
            >
              <span className="category-icon">🍔</span>
              <h3>Hamburguesas Dobles</h3>
              <p>Dos medallones y mucho sabor</p>
            </Link>

            <Link
              to="/menu?category=triples"
              className="category-card"
            >
              <span className="category-icon">🍔</span>
              <h3>Hamburguesas Triples</h3>
              <p>Para los que vienen con hambre</p>
            </Link>

            <Link
              to="/menu?category=pizzas"
              className="category-card"
            >
              <span className="category-icon">🍕</span>
              <h3>Pizzas</h3>
              <p>Pizzas para hornear</p>
            </Link>

            <Link
              to="/menu?category=lomos"
              className="category-card"
            >
              <span className="category-icon">🥪</span>
              <h3>Lomos</h3>
              <p>Completos, simples y más</p>
            </Link>

            <Link
              to="/menu?category=veggie"
              className="category-card"
            >
              <span className="category-icon">🥬</span>
              <h3>Veggie</h3>
              <p>Opciones vegetarianas y veganas</p>
            </Link>

          </div>
        </div>
      </section>

      {/* DESTACADOS */}

      <section className="home-featured">
        <div className="home-container">

          <div className="section-heading featured-heading">
            <div>
              <span className="section-label">
                PARA ARRANCAR
              </span>

              <h2>
                Algunos favoritos
              </h2>
            </div>

            <Link to="/menu" className="view-all-link">
              Ver todo →
            </Link>
          </div>

          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}

      <section className="home-cta">
        <div className="home-container">

          <div className="cta-content">
            <span className="section-label">
              ¿YA SABÉS QUÉ QUERÉS?
            </span>

            <h2>
              Armá tu pedido
            </h2>

            <p>
              Elegí tus productos favoritos y agregalos al carrito.
            </p>

            <Link to="/menu" className="cta-button">
              Ir al menú
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Home;