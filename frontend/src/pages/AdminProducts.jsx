import { useEffect, useMemo, useRef, useState } from "react";
import api, { getApiError, getProductImageUrl } from "../services/api";
import AdminCatalogNav from "../components/AdminCatalogNav";
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const imageInputRef = useRef(null);
  const productNameRef = useRef(null);
  const formDialogRef = useRef(null);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("all");
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

  useEffect(() => {
    if (!imagePreview.startsWith("blob:")) return undefined;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  useEffect(() => {
    const dialog = formDialogRef.current;
    if (!dialog) return;
    if (formOpen && !dialog.open) {
      dialog.showModal();
      productNameRef.current?.focus();
    } else if (!formOpen && dialog.open) {
      dialog.close();
    }
  }, [formOpen]);

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
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setFormOpen(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
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
    setImageFile(null);
    setImagePreview(getProductImageUrl(product.imagen_url));
    if (imageInputRef.current) imageInputRef.current.value = "";
    setEditingId(Number(product.id));
    setFormOpen(true);
    setError("");
    setSuccess("");
  };

  const openNewProductForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : getProductImageUrl(form.imagen_url));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const productFields = {
      ...form,
      nombre: form.nombre.trim(),
      precio: Number(form.precio),
      categoria_id: Number(form.categoria_id),
    };
    const productData = new FormData();
    Object.entries(productFields).forEach(([name, value]) => productData.append(name, String(value)));
    if (imageFile) productData.append("imagen", imageFile);

    try {
      const wasEditing = Boolean(editingId);
      if (editingId) {
        await api.put(`/product/productos/${editingId}`, productData);
      } else {
        await api.post("/product/productos", productData);
      }
      resetForm();
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

        <AdminCatalogNav />

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
                        ? <img src={getProductImageUrl(product.imagen_url)} alt="" />
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

        <dialog
          ref={formDialogRef}
          className="admin-form-dialog"
          aria-labelledby="admin-product-form-title"
          onCancel={(event) => {
            event.preventDefault();
            resetForm();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) resetForm();
          }}
        >
          <form className="admin-form-card" onSubmit={handleSubmit}>
            <div className="admin-card-heading">
              <div>
                <span className="section-label">{editingId ? "EDITAR CATÁLOGO" : "NUEVO EN EL MENÚ"}</span>
                <h2 id="admin-product-form-title">{editingId ? "Editar producto" : "Agregar producto"}</h2>
              </div>
              <button type="button" className="admin-cancel-button" onClick={resetForm}>
                {editingId ? "Cancelar" : "Cerrar"}
              </button>
            </div>

            {error && <p className="admin-message admin-error" role="alert">{error}</p>}

            <label className="admin-field">
              Nombre del producto
              <input ref={productNameRef} name="nombre" value={form.nombre} onChange={handleChange} maxLength="150" required />
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
              Archivo de imagen <span className="admin-optional">(opcional · JPG, PNG, GIF o WEBP · máx. 5 MB)</span>
              <input
                ref={imageInputRef}
                name="imagen"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,.jpeg,.jpg,.png,.gif,.webp"
                onChange={handleImageChange}
              />
            </label>

            {imagePreview && (
              <img className="admin-image-preview" src={imagePreview} alt={`Vista previa de ${form.nombre || "producto"}`} />
            )}

            <label className="admin-field">
              Descripción <span className="admin-optional">(opcional)</span>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="4" />
            </label>

            <button className="admin-submit-button" type="submit" disabled={saving || categories.length === 0}>
              {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Agregar al menú"}
            </button>
          </form>

        </dialog>

        <button type="button" className="admin-create-floating" onClick={openNewProductForm}>
          <span aria-hidden="true">+</span>
          Nuevo producto
        </button>

      </div>
    </main>
  );
}

export default AdminProducts;
