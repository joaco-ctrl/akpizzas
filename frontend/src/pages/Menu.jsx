import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { categories } from "../components/CategoryFilter";
import "./Menu.css";

/*
|--------------------------------------------------------------------------
| CATÁLOGO DE PRODUCTOS
|--------------------------------------------------------------------------
*/

export const products = [

  // ============================================================
  // COMBOS HAMBURGUESA + PAPAS + BEBIDA
  // ============================================================

  {
    id: "combo-americana-pepsi",
    name: "Americana + Pepsi",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 15700,
    description:
      "Doble medallón 110grms, lechuga, tomate, cheddar x4, papas y lata Pepsi.",
  },

  {
    id: "combo-americana-pepsi-black",
    name: "Americana + Pepsi Black",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 15700,
    description:
      "Doble medallón 110grms, lechuga, tomate, cheddar x4, papas y lata Pepsi Black.",
  },

  {
    id: "combo-bacon-pepsi-black",
    name: "Bacon + Pepsi Black",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 16700,
    description:
      "Doble medallón 110grms, panceta ahumada crocante, cheddar x4, papas y lata Pepsi Black.",
  },

  {
    id: "combo-bacon-pepsi",
    name: "Bacon + Pepsi",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 16700,
    description:
      "Doble medallón 110grms, panceta ahumada crocante, cheddar x4, papas y lata 7up.",
  },

  {
    id: "combo-cheeseburger-pepsi",
    name: "Cheeseburger + Pepsi",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 15250,
    description:
      "Doble medallón 110 grms, cheddar x4, papas y lata Pepsi.",
  },

  {
    id: "combo-cheeseburger-pepsi-black",
    name: "Cheeseburger + Pepsi Black",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 15250,
    description:
      "Doble medallón 110 grms, cheddar x4, papas y lata Pepsi Black.",
  },

  {
    id: "combo-cuarto-pepsi",
    name: "Cuarto de Libra + Pepsi",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 15700,
    description:
      "Doble medallón 110 grms, cebolla brounise, ketchup, mostaza, cheddar x4, papas y lata Pepsi.",
  },

  {
    id: "combo-cuarto-pepsi-black",
    name: "Cuarto de Libra + Pepsi Black",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 15700,
    description:
      "Doble medallón 110 grms, cebolla brounise, ketchup, mostaza, cheddar x4, papas y lata 7up.",
  },

  {
    id: "combo-americana-7up",
    name: "Americana + 7up",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 15700,
    description:
      "Doble medallón 110grms, lechuga, tomate, cheddar x4, papas y lata 7up.",
  },

  {
    id: "combo-cheeseburger-7up",
    name: "Cheeseburger + 7up",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 15250,
    description:
      "Doble medallón 110 grms, cheddar x4, papas y lata 7up.",
  },

  {
    id: "combo-cuarto-7up",
    name: "Cuarto de Libra + 7up",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 15700,
    description:
      "Doble medallón 110 grms, cebolla brounise, ketchup, mostaza, cheddar x4, papas y lata 7up.",
  },

  {
    id: "combo-bacon-7up",
    name: "Bacon + 7up",
    category: "combos",
    categoryName: "Combo Hamburguesa + Papas + Bebida",
    price: 16500,
    description:
      "Doble medallón 110grms, panceta ahumada crocante, cheddar x4, papas y lata 7up.",
  },

  // ============================================================
  // PROMO PIZZAS
  // ============================================================

  {
    id: "promo-2-muzzas",
    name: "2 Muzzas (sin gaseosa)",
    category: "promo-pizzas",
    categoryName: "Promo Pizzas para Hornear",
    price: 14800,
    description: "",
  },

  {
    id: "promo-muzza-calabreza",
    name: "1 Muzza + 1 Calabreza",
    category: "promo-pizzas",
    categoryName: "Promo Pizzas para Hornear",
    price: 15600,
    description: "",
  },

  {
    id: "promo-2-muzzas-gaseosa",
    name: "2 Muzzas + gaseosa 1.5 lts",
    category: "promo-pizzas",
    categoryName: "Promo Pizzas para Hornear",
    price: 16200,
    description: "",
  },

  // ============================================================
  // VEGGIE
  // ============================================================

  {
    id: "vegetariana",
    name: "Vegetariana",
    category: "veggie",
    categoryName: "Veggie",
    price: 12000,
    description:
      "Pan, medallón veggie (lenteja y zanahoria), cheddar x2, mayonesa, cebolla brounise, lechuga, tomate, papas fritas.",
  },

  {
    id: "vegana",
    name: "Vegana",
    category: "veggie",
    categoryName: "Veggie",
    price: 11500,
    description:
      "Pan, medallón vegano (zanahoria, lenteja), lechuga, tomate, papas fritas.",
  },

  // ============================================================
  // NUGGETS Y AROS
  // ============================================================

  {
    id: "aros-mayonesa",
    name: "Aros de cebolla con mayonesa",
    category: "nuggets-aros",
    categoryName: "Nuggets y Aros de Cebolla",
    price: 7800,
    description: "",
  },

  {
    id: "aros-ketchup",
    name: "Aros de cebolla con ketchup",
    category: "nuggets-aros",
    categoryName: "Nuggets y Aros de Cebolla",
    price: 7800,
    description: "",
  },

  {
    id: "nuggets-mayonesa",
    name: "Nuggets con mayonesa",
    category: "nuggets-aros",
    categoryName: "Nuggets y Aros de Cebolla",
    price: 7800,
    description: "",
  },

  {
    id: "nuggets-ketchup",
    name: "Nuggets con ketchup",
    category: "nuggets-aros",
    categoryName: "Nuggets y Aros de Cebolla",
    price: 7800,
    description: "",
  },

  // ============================================================
  // GASEOSAS
  // ============================================================

  {
    id: "mirinda-lata",
    name: "Lata Mirinda",
    category: "gaseosas",
    categoryName: "Gaseosas",
    price: 3000,
    description: "",
  },

  {
    id: "pepsi-15",
    name: "Pepsi 1.5 lts",
    category: "gaseosas",
    categoryName: "Gaseosas",
    price: 3900,
    description: "",
  },

  {
    id: "mirinda-15",
    name: "Mirinda 1.5 lts",
    category: "gaseosas",
    categoryName: "Gaseosas",
    price: 3900,
    description: "",
  },

  {
    id: "7up-15",
    name: "7up 1.5 lts",
    category: "gaseosas",
    categoryName: "Gaseosas",
    price: 3900,
    description: "",
  },

  {
    id: "paso-toros-15",
    name: "Paso de los Toros 1.5 lts",
    category: "gaseosas",
    categoryName: "Gaseosas",
    price: 3900,
    description: "",
  },

  {
    id: "pepsi-lata",
    name: "Lata Pepsi",
    category: "gaseosas",
    categoryName: "Gaseosas",
    price: 3000,
    description: "",
  },

  {
    id: "7up-lata",
    name: "Lata 7up",
    category: "gaseosas",
    categoryName: "Gaseosas",
    price: 3000,
    description: "",
  },

  // ============================================================
  // PAPAS
  // ============================================================

  {
    id: "porcion-papas",
    name: "Porción de papas",
    category: "papas",
    categoryName: "Papas Fritas",
    price: 4500,
    description: "",
  },

  // ============================================================
  // HAMBURGUESAS SIMPLES
  // ============================================================

  {
    id: "simple-papas",
    name: "Porción de papas",
    category: "simples",
    categoryName: "Hamburguesas Simples",
    price: 4500,
    description: "",
  },

  // ============================================================
  // HAMBURGUESAS DOBLES
  // ============================================================

  {
    id: "bacon-jam",
    name: "Bacon JAM",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 18500,
    description:
      "Pan, medallón x2, cheddar x4, mermelada de panceta, mayonesa de ajo, papas fritas.",
  },

  {
    id: "l-pepin",
    name: "L Pepin",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 15250,
    description:
      "Pan, carne x2, cheddar x4, salsa dijonesa, cebolla, pepinillos y fritas.",
  },

  {
    id: "bacon-doble",
    name: "Bacon",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 20300,
    description:
      "Pan, doble carne, cheddar x3, panceta, papas fritas.",
  },

  {
    id: "americana-doble",
    name: "Americana",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 17800,
    description:
      "Pan, doble carne, cheddar x3, lechuga, tomate, huevo, papas fritas.",
  },

  {
    id: "cuarto-doble",
    name: "Cuarto de Libra",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 17900,
    description:
      "Pan, doble carne, cheddar x3, mostaza, ketchup, cebolla, papas fritas.",
  },

  {
    id: "roquegol",
    name: "Roquegol",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 18100,
    description:
      "Pan, doble carne, cheddar x3, manteca de roquefort, papas fritas.",
  },

  {
    id: "butter-doble",
    name: "Butter",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 17600,
    description:
      "Pan, doble carne, cheddar x3, manteca ahumada, papas fritas.",
  },

  {
    id: "oklahoma-doble",
    name: "Oklahoma",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 17200,
    description:
      "Pan, doble carne, cheddar x3, cebolla smasheada en la plancha, papas fritas.",
  },

  {
    id: "blt-doble",
    name: "Blt",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 17600,
    description:
      "Pan, doble carne, cheddar x3, mayobacon, lechuga, tomate, cebolla, papas fritas.",
  },

  {
    id: "tasty-doble",
    name: "Tasty",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 17500,
    description:
      "Pan, doble medallón, cheddar x4, lechuga, tomate, cebolla, salsa tasty + porción de fritas.",
  },

  {
    id: "mcfly",
    name: "Mcfly",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 18200,
    description:
      "Pan, medallón x2, cheddar x4, salsa AK, cebolla crispy.",
  },

  {
    id: "ultron",
    name: "Ultron",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 19800,
    description:
      "Pan, medallón x2, cheddar x4, salsa AK, lechuga, tomate, bacon, fritas.",
  },

  {
    id: "cheeseburger-doble",
    name: "Chesseburger",
    category: "dobles",
    categoryName: "Hamburguesas Dobles",
    price: 16600,
    description:
      "Pan, doble carne, cheddar x3, papas fritas.",
  },

  // ============================================================
  // HAMBURGUESAS TRIPLES
  // ============================================================

  {
    id: "tasty-triple",
    name: "Tasty",
    category: "triples",
    categoryName: "Hamburguesas Triples",
    price: 21000,
    description:
      "Pan, medallón de carne x3, cheddar x6, lechuga, tomate, cebolla, salsa tasty + porción de fritas.",
  },

  {
    id: "americana-triple",
    name: "Americana",
    category: "triples",
    categoryName: "Hamburguesas Triples",
    price: 21600,
    description:
      "Pan, carne x3, cheddar x3, lechuga, tomate, huevo, papas fritas.",
  },

  {
    id: "bacon-triple",
    name: "Bacon",
    category: "triples",
    categoryName: "Hamburguesas Triples",
    price: 23600,
    description:
      "Pan, carne x3, cheddar x3, panceta, papas fritas.",
  },

  {
    id: "blt-triple",
    name: "Blt",
    category: "triples",
    categoryName: "Hamburguesas Triples",
    price: 19400,
    description:
      "Pan, carne x3, cheddar x3, mayobacon, lechuga, tomate, cebolla, papas fritas.",
  },

  {
    id: "butter-triple",
    name: "Butter",
    category: "triples",
    categoryName: "Hamburguesas Triples",
    price: 21900,
    description:
      "Pan, carne x3, cheddar x3, manteca ahumada, papas fritas.",
  },

  {
    id: "cheeseburger-triple",
    name: "Chesseburger",
    category: "triples",
    categoryName: "Hamburguesas Triples",
    price: 20000,
    description:
      "Pan, carne x3, cheddar x3, papas fritas.",
  },

  {
    id: "cuarto-triple",
    name: "Cuarto de Libra",
    category: "triples",
    categoryName: "Hamburguesas Triples",
    price: 21800,
    description:
      "Pan, carne x3, cheddar x3, mostaza, ketchup, cebolla, papas fritas.",
  },

  {
    id: "l-pepin-triple",
    name: "L Pepin",
    category: "triples",
    categoryName: "Hamburguesas Triples",
    price: 19800,
    description:
      "Pan, carne x3, cheddar x4, salsa dijonesa, cebolla, pepinillos y fritas.",
  },

  {
    id: "oklahoma-triple",
    name: "Oklahoma",
    category: "triples",
    categoryName: "Hamburguesas Triples",
    price: 21600,
    description:
      "Pan, carne x3, cheddar x3, cebolla smasheada, papas fritas.",
  },

  {
    id: "roquegol-triple",
    name: "Roquegol",
    category: "triples",
    categoryName: "Hamburguesas Triples",
    price: 21500,
    description:
      "Pan, carne x3, cheddar x3, manteca de roquefort, papas fritas.",
  },

  // ============================================================
  // HAMBURGUESAS SIN PAPAS
  // ============================================================

  {
    id: "cheeseburger-sin-papas",
    name: "Cheeseburger doble",
    category: "sin-papas",
    categoryName: "Hamburguesas Sin Papas",
    price: 13500,
    description: "",
  },

  {
    id: "cuarto-sin-papas",
    name: "Cuarto de Libra doble",
    category: "sin-papas",
    categoryName: "Hamburguesas Sin Papas",
    price: 14000,
    description: "",
  },

  {
    id: "americana-sin-papas",
    name: "Americana doble",
    category: "sin-papas",
    categoryName: "Hamburguesas Sin Papas",
    price: 14000,
    description: "",
  },

  {
    id: "oklahoma-sin-papas",
    name: "Oklahoma doble",
    category: "sin-papas",
    categoryName: "Hamburguesas Sin Papas",
    price: 14500,
    description: "",
  },

  // ============================================================
  // LOMOS
  // ============================================================

  {
    id: "lomo-completo",
    name: "Completo",
    category: "lomos",
    categoryName: "Lomos",
    price: 20400,
    description:
      "Pan, carne (280grms), jamón, queso, lechuga, tomate, huevo y papas fritas.",
  },

  {
    id: "lomo-jamon-queso",
    name: "Jamón y queso",
    category: "lomos",
    categoryName: "Lomos",
    price: 20000,
    description:
      "Pan, carne (280grms), jamón, queso, papas fritas.",
  },

  {
    id: "lomo-simple",
    name: "Simple",
    category: "lomos",
    categoryName: "Lomos",
    price: 17500,
    description:
      "Pan, carne (280grms), papas fritas.",
  },

  // ============================================================
  // MILANESAS
  // ============================================================

  {
    id: "mila-completa",
    name: "Completo",
    category: "milanesas",
    categoryName: "Milanesas",
    price: 18000,
    description:
      "Pan, jamón, queso, lechuga, tomate, huevo y papas fritas.",
  },

  {
    id: "mila-jamon-queso",
    name: "Jamón y queso",
    category: "milanesas",
    categoryName: "Milanesas",
    price: 17200,
    description:
      "Pan, jamón, queso, papas fritas.",
  },

  {
    id: "mila-simple",
    name: "Simple",
    category: "milanesas",
    categoryName: "Milanesas",
    price: 14400,
    description:
      "Pan, papas fritas.",
  },

  {
    id: "mila-napolitana",
    name: "Napolitana",
    category: "milanesas",
    categoryName: "Milanesas",
    price: 18400,
    description:
      "Pan, jamón, queso, lechuga, tomate, salsa y papas fritas.",
  },

  // ============================================================
  // PIZZAS PARA HORNEAR
  // ============================================================

  {
    id: "pizza-pollo",
    name: "Pollo",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 13200,
    description:
      "Salsa, muzzarella, 200 grms pollo salteado con verdeo y aceite de oliva.",
  },

  {
    id: "pizza-brasilera",
    name: "Brasilera",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 14300,
    description:
      "Salsa, muzzarella, Roquefort, 250 grms de pollo salteado con verdeo y aceite de oliva.",
  },

  {
    id: "pizza-fugazza",
    name: "Fugazza",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 11300,
    description:
      "Salsa, muzzarella, cebolla.",
  },

  {
    id: "pizza-media-fugazza",
    name: "1/2 Fugazza",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 6000,
    description: "",
  },

  {
    id: "pizza-muzza",
    name: "Muzza",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 9000,
    description: "",
  },

  {
    id: "pizza-especial",
    name: "Especial",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 12400,
    description:
      "Muzza, jamón y morrón.",
  },

  {
    id: "pizza-napolitana",
    name: "Napolitana",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 11800,
    description:
      "Muzza, jamón y tomate.",
  },

  {
    id: "pizza-calabreza",
    name: "Calabreza",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 10850,
    description: "",
  },

  {
    id: "pizza-roquefort",
    name: "Roquefort",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 10850,
    description: "",
  },

  {
    id: "pizza-cuatro-quesos",
    name: "Cuatro quesos",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 11200,
    description: "",
  },

  {
    id: "pizza-anchoas",
    name: "Anchoas",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 11350,
    description: "",
  },

  {
    id: "pizza-veneziana",
    name: "Veneziana",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 11000,
    description:
      "Roquefort y verdeo.",
  },

  {
    id: "pizza-champignon",
    name: "Champigñon",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 11000,
    description: "",
  },

  {
    id: "pizza-media-muzza",
    name: "1/2 Muzza",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 6000,
    description: "",
  },

  {
    id: "pizza-media-especial",
    name: "1/2 Especial",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 6250,
    description: "",
  },

  {
    id: "pizza-media-napolitana",
    name: "1/2 Napolitana",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 6250,
    description: "",
  },

  {
    id: "pizza-media-calabreza",
    name: "1/2 Calabreza",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 6000,
    description: "",
  },

  {
    id: "pizza-media-roque",
    name: "1/2 Roque",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 5500,
    description: "",
  },

  {
    id: "pizza-media-cuatro-quesos",
    name: "1/2 Cuatro quesos",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 6000,
    description: "",
  },

  {
    id: "pizza-media-anchoas",
    name: "1/2 Anchoas",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 6250,
    description: "",
  },

  {
    id: "pizza-media-champig",
    name: "1/2 Champig",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 6250,
    description: "",
  },

  {
    id: "pizza-media-veneziana",
    name: "1/2 Veneziana",
    category: "pizzas",
    categoryName: "Pizzas para Hornear",
    price: 6000,
    description: "",
  },
];

/*
|--------------------------------------------------------------------------
| MENU
|--------------------------------------------------------------------------
*/

function Menu({ onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get("category") || "todos";

  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);

  const [search, setSearch] = useState("");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === "todos") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }

    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "todos" ||
        product.category === selectedCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        product.name.toLowerCase().includes(searchText) ||
        product.description.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  const currentCategory = categories.find(
    (category) => category.id === selectedCategory
  );

  return (
    <main className="menu-page">

      <section className="menu-header">
        <div className="menu-container">

          <span className="section-label">
            AK PIZZAS
          </span>

          <h1>
            Nuestro <span>Menú</span>
          </h1>

          <p>
            Elegí tus favoritos y armá tu pedido.
          </p>

        </div>
      </section>

      <section className="menu-content">
        <div className="menu-container">

          {/* BUSCADOR */}

          <div className="menu-search">
            <span className="search-icon">
              🔎
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar hamburguesas, pizzas, lomos..."
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>

          {/* CATEGORÍAS */}

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* RESULTADOS */}

          <div className="menu-results-header">

            <div>
              <h2>
                {currentCategory?.name || "Todos"}
              </h2>

              <span>
                {filteredProducts.length} productos
              </span>
            </div>

          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}

            </div>
          ) : (
            <div className="empty-menu">

              <div className="empty-menu-icon">
                🔎
              </div>

              <h3>
                No encontramos productos
              </h3>

              <p>
                Probá con otro nombre o seleccioná otra categoría.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  handleCategoryChange("todos");
                }}
              >
                Ver todo el menú
              </button>

            </div>
          )}

        </div>
      </section>

    </main>
  );
}

export default Menu;