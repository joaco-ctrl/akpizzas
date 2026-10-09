import "./CategoryFilter.css";
import categories from "../data/categories";

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

export default CategoryFilter;