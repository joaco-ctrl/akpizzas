import { useEffect, useMemo, useRef, useState } from "react";
import "./CategoryFilter.css";

function CategoryFilter({
  categories = [],
  selectedCategory = "todos",
  onCategoryChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [opensUp, setOpensUp] = useState(false);
  const [availableHeight, setAvailableHeight] = useState(440);
  const filterRef = useRef(null);
  const triggerRef = useRef(null);
  const selected = categories.find((category) => category.id === selectedCategory);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es-AR");
    if (!normalizedSearch) return categories;
    return categories.filter((category) =>
      category.name.toLocaleLowerCase("es-AR").includes(normalizedSearch)
    );
  }, [categories, search]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!filterRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    if (isMobile) document.body.style.overflow = "hidden";

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const closePicker = () => {
    setIsOpen(false);
    setSearch("");
  };

  const togglePicker = () => {
    if (isOpen) {
      closePicker();
      return;
    }

    const triggerBounds = triggerRef.current?.getBoundingClientRect();
    if (triggerBounds) {
      const spaceBelow = window.innerHeight - triggerBounds.bottom - 16;
      const spaceAbove = triggerBounds.top - 16;
      const openAbove = spaceBelow < 440 && spaceAbove > spaceBelow;
      setOpensUp(openAbove);
      setAvailableHeight(Math.max(180, Math.min(440, openAbove ? spaceAbove : spaceBelow)));
    }
    setIsOpen(true);
  };

  const chooseCategory = (categoryId) => {
    onCategoryChange?.(categoryId);
    closePicker();
    triggerRef.current?.focus();
  };

  return (
    <div className={`category-filter${isOpen ? " is-open" : ""}`} ref={filterRef}>
      <button
        ref={triggerRef}
        type="button"
        className="category-filter-trigger"
        aria-expanded={isOpen}
        aria-controls="category-filter-picker"
        onClick={togglePicker}
      >
        <span className="category-filter-trigger-label">Categoría</span>
        <strong>{selected?.name || "Todas"}</strong>
        <span className={`category-filter-chevron${isOpen ? " is-open" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="category-filter-backdrop"
            aria-hidden="true"
            onClick={closePicker}
          />
          <section
            id="category-filter-picker"
            className={`category-picker${opensUp ? " opens-up" : ""}`}
            role="dialog"
            aria-label="Elegir categoría"
            style={{ "--category-picker-max-height": `${availableHeight}px` }}
          >
            <header className="category-picker-header">
              <h2>Elegí una categoría</h2>
              <button
                type="button"
                className="category-picker-close"
                onClick={closePicker}
                aria-label="Cerrar categorías"
              >
                ×
              </button>
            </header>

            <label className="category-picker-search-label">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar categoría"
                aria-label="Buscar categoría"
              />
            </label>

            <div className="category-picker-list">
              {filteredCategories.length > 0 ? filteredCategories.map((category) => {
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`category-picker-option${isSelected ? " is-selected" : ""}`}
                    aria-pressed={isSelected}
                    onClick={() => chooseCategory(category.id)}
                  >
                    <span>{category.name}</span>
                    {isSelected && <span className="category-picker-check" aria-hidden="true">✓</span>}
                  </button>
                );
              }) : (
                <p className="category-picker-empty">No hay categorías que coincidan.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default CategoryFilter;
