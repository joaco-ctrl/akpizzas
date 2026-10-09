import { useEffect, useMemo, useState } from "react";
import api, { getApiError } from "../services/api";
import "./AdminProducts.css";

const emptyForm = {
  nombre: "",
  descripcion: "",
  precio: "",
  imagen_url: "",
  categoria_id: "",
  disponible: 1,
};

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function AdminProducts({ onProductsUpdated }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [categoryName, setCategoryName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [{ data: allProducts }, { data: allCategories }] = await Promise.all([
        api.get("/product/admin/productos"),
        api.get("/product/categorias"),
      ]);
      setProducts(allProducts);
      setCategories(allCategories);
      return true;
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudieron cargar los datos del catálogo."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get("/product/admin/productos"),
      api.get("/product/categorias"),
    ])
      .then(([{ data: allProducts }, { data: allCategories }]) => {
        if (!active) return;
        setProducts(allProducts);
        setCategories(allCategories);
      })
      .catch((requestError) => {
        if (active) setError(getApiError(requestError, "No se pudieron cargar los datos del catálogo."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es-AR");
    return products.filter((product) => {
      const isAvailable = Number(product.disponible) === 1;
      const matchesVisibility = visibility === "all" ||
        (visibility === "active" && isAvailable) ||
        (visibility === "inactive" && !isAvailable);
      const matchesSearch = !normalizedSearch ||
        product.nombre.toLocaleLowerCase("es-AR").includes(normalizedSearch) ||
        product.categoria_nombre.toLocaleLowerCase("es-AR").includes(normalizedSearch);
      return matchesVisibility && matchesSearch;
    });
  }, [products, search, visibility]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const editProduct = (product) => {
    setForm({
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio: String(product.precio),
      imagen_url: product.imagen_url || "",
      categoria_id: String(product.categoria_id),
      disponible: Number(product.disponible),
    });
    setEditingId(Number(product.id));
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const productData = {
      ...form,
      nombre: form.nombre.trim(),
      precio: Number(form.precio),
      categoria_id: Number(form.categoria_id),
    };

    try {
      const wasEditing = Boolean(editingId);
      if (editingId) {
        await api.put(`/product/productos/${editingId}`, productData);
      } else {
        await api.post("/product/productos", productData);
      }
      setForm(emptyForm);
      setEditingId(null);
      if (await loadData()) {
        setSuccess(wasEditing ? "Producto actualizado correctamente." : "Producto agregado correctamente.");
      }
      onProductsUpdated?.();
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo guardar el producto."));
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    setSavingCategory(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/product/categorias", { nombre: categoryName.trim() });
      setCategoryName("");
      if (await loadData()) setSuccess("Categoría creada correctamente.");
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo crear la categoría."));
    } finally {
      setSavingCategory(false);
    }
  };

  const setAvailability = async (product, available) => {
    setError("");
    setSuccess("");
    try {
      await api.put(`/product/productos/${product.id}`, {
        nombre: product.nombre,
        descripcion: product.descripcion || "",
        precio: Number(product.precio),
        imagen_url: product.imagen_url || "",
        categoria_id: Number(product.categoria_id),
        disponible: available ? 1 : 0,
      });
      if (await loadData()) {
        setSuccess(available ? "Producto reactivado." : "Producto desactivado.");
      }
      onProductsUpdated?.();
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo cambiar la disponibilidad."));
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-heading">
          <div>
            <span className="section-label">PANEL DE ADMINISTRACIÓN</span>
            <h1>Productos</h1>
            <p>Agregá productos al menú, actualizá precios y administrá su disponibilidad.</p>
          </div>
          <span className="admin-heading-icon" aria-hidden="true">🍕</span>
        </header>

        <section className="admin-stats" aria-label="Resumen del catálogo">
          <article className="admin-stat">
            <span>Productos cargados</span>
            <strong>{products.length}</strong>
          </article>
          <article className="admin-stat">
            <span>Disponibles</span>
            <strong>{products.filter((product) => Number(product.disponible) === 1).length}</strong>
          </article>
          <article className="admin-stat">
            <span>Categorías</span>
            <strong>{categories.length}</strong>
          </article>
        </section>

        <div className="admin-feedback" aria-live="polite">
          {error && <p className="admin-message admin-error" role="alert">{error}</p>}
          {success && <p className="admin-message admin-success" role="status">{success}</p>}
        </div>

        <section className="admin-layout">
          <form className="admin-form-card" onSubmit={handleSubmit}>
            <div className="admin-card-heading">
              <div>
                <span className="section-label">{editingId ? "EDITAR CATÁLOGO" : "NUEVO EN EL MENÚ"}</span>
                <h2>{editingId ? "Editar producto" : "Agregar producto"}</h2>
              </div>
              {editingId && (
                <button type="button" className="admin-cancel-button" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>

            <label className="admin-field">
              Nombre del producto
              <input name="nombre" value={form.nombre} onChange={handleChange} maxLength="150" required />
            </label>

            <label className="admin-field">
              Categoría
              <select name="categoria_id" value={form.categoria_id} onChange={handleChange} required>
                <option value="">Elegí una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.nombre}</option>
                ))}
              </select>
            </label>

            <label className="admin-field">
              Precio
              <div className="admin-price-input">
                <span>$</span>
                <input name="precio" type="number" min="0.01" step="0.01" value={form.precio} onChange={handleChange} required />
              </div>
            </label>

            <label className="admin-field">
              URL de imagen <span className="admin-optional">(opcional)</span>
              <input name="imagen_url" type="url" maxLength="255" value={form.imagen_url} onChange={handleChange} placeholder="https://..." />
            </label>

            {form.imagen_url && (
              <img className="admin-image-preview" src={form.imagen_url} alt={`Vista previa de ${form.nombre || "producto"}`} />
            )}

            <label className="admin-field">
              Descripción <span className="admin-optional">(opcional)</span>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="4" />
            </label>

            <button className="admin-submit-button" type="submit" disabled={saving || categories.length === 0}>
              {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Agregar al menú"}
            </button>
          </form>

          <section className="admin-products-card">
            <div className="admin-card-heading">
              <div>
                <span className="section-label">CATÁLOGO</span>
                <h2>Administrar productos</h2>
              </div>
              <span className="admin-result-count">{filteredProducts.length} resultados</span>
            </div>

            <div className="admin-product-filters">
              <label className="admin-search">
                <span aria-hidden="true">⌕</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto o categoría" aria-label="Buscar producto o categoría" />
              </label>
              <select value={visibility} onChange={(event) => setVisibility(event.target.value)} aria-label="Filtrar disponibilidad">
                <option value="all">Todos</option>
                <option value="active">Disponibles</option>
                <option value="inactive">Desactivados</option>
              </select>
            </div>

            {loading ? (
              <p className="admin-empty-state">Cargando catálogo...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="admin-empty-state">No hay productos que coincidan con la búsqueda.</p>
            ) : (
              <div className="admin-product-list">
                {filteredProducts.map((product) => {
                  const available = Number(product.disponible) === 1;
                  return (
                    <article className="admin-product-row" key={product.id}>
                      <div className="admin-product-image">
                        {product.imagen_url
                          ? <img src={product.imagen_url} alt="" />
                          : <span aria-hidden="true">🍔</span>}
                      </div>
                      <div className="admin-product-info">
                        <div className="admin-product-title">
                          <h3>{product.nombre}</h3>
                          <span className={`admin-status ${available ? "is-available" : "is-unavailable"}`}>
                            {available ? "Disponible" : "Desactivado"}
                          </span>
                        </div>
                        <span>{product.categoria_nombre}</span>
                        <strong>{currency.format(Number(product.precio))}</strong>
                      </div>
                      <div className="admin-product-actions">
                        <button type="button" onClick={() => editProduct(product)}>Editar</button>
                        <button
                          type="button"
                          className={available ? "admin-danger-button" : "admin-reactivate-button"}
                          onClick={() => setAvailability(product, !available)}
                        >
                          {available ? "Desactivar" : "Reactivar"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </section>

        <section className="admin-categories-card">
          <div className="admin-card-heading">
            <div>
              <span className="section-label">ORGANIZÁ EL MENÚ</span>
              <h2>Categorías</h2>
            </div>
            <span className="admin-result-count">{categories.length} categorías</span>
          </div>
          <form className="admin-category-form" onSubmit={handleCreateCategory}>
            <label className="admin-field">
              Nueva categoría
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                maxLength="100"
                placeholder="Ej.: Pizzas especiales"
                required
              />
            </label>
            <button className="admin-submit-button" type="submit" disabled={savingCategory}>
              {savingCategory ? "Guardando..." : "Crear categoría"}
            </button>
          </form>
          <div className="admin-category-list">
            {categories.map((category) => (
              <span className="admin-category-chip" key={category.id}>{category.nombre}</span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminProducts;
