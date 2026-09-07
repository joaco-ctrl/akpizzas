import "./CategoryFilter.css";

const categories = [
  {
    id: "todos",
    name: "Todos",
  },
  {
    id: "combos",
    name: "Combo Hamburguesa + Papas + Bebida",
  },
  {
    id: "promo-pizzas",
    name: "Promo Pizzas para Hornear",
  },
  {
    id: "veggie",
    name: "Veggie",
  },
  {
    id: "nuggets-aros",
    name: "Nuggets y Aros de Cebolla",
  },
  {
    id: "gaseosas",
    name: "Gaseosas",
  },
  {
    id: "papas",
    name: "Papas Fritas",
  },
  {
    id: "simples",
    name: "Hamburguesas Simples",
  },
  {
    id: "dobles",
    name: "Hamburguesas Dobles",
  },
  {
    id: "triples",
    name: "Hamburguesas Triples",
  },
  {
    id: "sin-papas",
    name: "Hamburguesas Sin Papas",
  },
  {
    id: "lomos",
    name: "Lomos",
  },
  {
    id: "milanesas",
    name: "Milanesas",
  },
  {
    id: "pizzas",
    name: "Pizzas para Hornear",
  },
];

function CategoryFilter({
  selectedCategory = "todos",
  onCategoryChange,
}) {
  return (
    <div className="category-filter">

      <div className="category-scroll">

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`category-button ${
              selectedCategory === category.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              onCategoryChange?.(category.id)
            }
          >
            {category.name}
          </button>
        ))}

      </div>

    </div>
  );
}

export { categories };
export default CategoryFilter;