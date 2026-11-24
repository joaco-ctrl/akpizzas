import { useCallback, useEffect, useRef, useState } from "react";
import api, { getApiError } from "../services/api";
import AdminCatalogNav from "../components/AdminCatalogNav";
import "./AdminProducts.css";
import "./AdminCategories.css";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const categoryNameRef = useRef(null);
  const formDialogRef = useRef(null);

  const fetchCategories = useCallback(async () => {
    const { data } = await api.get("/product/categorias");
    return data;
  }, []);

  useEffect(() => {
    let active = true;
    fetchCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((requestError) => {
        if (active) setError(getApiError(requestError, "No se pudieron cargar las categorías."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [fetchCategories]);

  useEffect(() => {
    const dialog = formDialogRef.current;
    if (!dialog) return;
    if (formOpen && !dialog.open) {
      dialog.showModal();
      categoryNameRef.current?.focus();
    } else if (!formOpen && dialog.open) {
      dialog.close();
    }
  }, [formOpen]);

  const reloadCategories = async () => {
    setError("");
    try {
      setCategories(await fetchCategories());
      return true;
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudieron cargar las categorías."));
      return false;
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setEditingId(null);
    setFormOpen(false);
    setError("");
    setSuccess("");
  };

  const editCategory = (category) => {
    setCategoryName(category.nombre);
    setEditingId(Number(category.id));
    setFormOpen(true);
    setError("");
    setSuccess("");
  };

  const openNewCategoryForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const filteredCategories = categories.filter((category) =>
    category.nombre.toLocaleLowerCase("es-AR").includes(search.trim().toLocaleLowerCase("es-AR"))
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const wasEditing = Boolean(editingId);
      if (editingId) {
        await api.put(`/product/categorias/${editingId}`, { nombre: categoryName.trim() });
      } else {
        await api.post("/product/categorias", { nombre: categoryName.trim() });
      }
      setCategoryName("");
      setEditingId(null);
      setFormOpen(false);
      if (await reloadCategories()) {
        setSuccess(wasEditing ? "Categoría actualizada correctamente." : "Categoría creada correctamente.");
      }
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo guardar la categoría."));
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`¿Querés eliminar la categoría "${category.nombre}"?`)) return;
    setDeletingId(Number(category.id));
    setError("");
    setSuccess("");
    try {
      await api.delete(`/product/categorias/${category.id}`);
      if (editingId === Number(category.id)) resetForm();
      if (await reloadCategories()) setSuccess("Categoría eliminada correctamente.");
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo eliminar la categoría."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="admin-page admin-categories-page">
      <div className="admin-container">
        <header className="admin-heading">
          <div>
            <span className="section-label">PANEL DE ADMINISTRACIÓN</span>
            <h1>Categorías</h1>
            <p>Creá y organizá las categorías disponibles en el menú.</p>
          </div>
          <span className="admin-heading-icon" aria-hidden="true">🗂️</span>
        </header>

        <AdminCatalogNav />

        <div className="admin-feedback" aria-live="polite">
          {error && <p className="admin-message admin-error" role="alert">{error}</p>}
          {success && <p className="admin-message admin-success" role="status">{success}</p>}
        </div>

        <section className="admin-categories-card">
          <div className="admin-card-heading">
            <div>
              <span className="section-label">ORGANIZÁ EL MENÚ</span>
              <h2>Administrar categorías</h2>
            </div>
            <span className="admin-result-count">{categories.length} categorías</span>
          </div>

          <div className="admin-category-toolbar">
            <label className="admin-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar categoría"
                aria-label="Buscar categoría"
              />
            </label>
            <span className="admin-result-count">{filteredCategories.length} resultados</span>
          </div>

          {loading ? (
            <p className="admin-empty-state">Cargando categorías...</p>
          ) : categories.length === 0 ? (
            <p className="admin-empty-state">Todavía no hay categorías creadas.</p>
          ) : filteredCategories.length === 0 ? (
            <p className="admin-empty-state">No hay categorías que coincidan con la búsqueda.</p>
          ) : (
            <div className="admin-category-list">
              {filteredCategories.map((category) => (
                <article className="admin-category-tile" key={category.id}>
                  <span className="admin-category-chip">{category.nombre}</span>
                  <div className="admin-category-tile-actions">
                    <button type="button" onClick={() => editCategory(category)}>Editar</button>
                    <button
                      type="button"
                      className="admin-danger-button"
                      disabled={deletingId === Number(category.id)}
                      onClick={() => deleteCategory(category)}
                    >
                      {deletingId === Number(category.id) ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <dialog
          ref={formDialogRef}
          className="admin-form-dialog admin-category-dialog"
          aria-labelledby="admin-category-form-title"
          onCancel={(event) => {
            event.preventDefault();
            resetForm();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) resetForm();
          }}
        >
          <div className="admin-form-card">
            <div className="admin-card-heading">
              <div>
                <span className="section-label">ORGANIZÁ EL MENÚ</span>
                <h2 id="admin-category-form-title">
                  {editingId ? "Editar categoría" : "Nueva categoría"}
                </h2>
              </div>
              <button type="button" className="admin-cancel-button" onClick={resetForm}>
                {editingId ? "Cancelar" : "Cerrar"}
              </button>
            </div>

            {error && <p className="admin-message admin-error" role="alert">{error}</p>}

            <form className="admin-category-form" onSubmit={handleSubmit}>
              <label className="admin-field">
                Nombre de la categoría
                <input
                  ref={categoryNameRef}
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  maxLength="100"
                  placeholder="Ej.: Pizzas especiales"
                  required
                />
              </label>
              <div className="admin-category-form-actions">
                <button className="admin-submit-button" type="submit" disabled={saving}>
                  {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear categoría"}
                </button>
                <button className="admin-cancel-button" type="button" onClick={resetForm}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </dialog>

        <button type="button" className="admin-create-floating" onClick={openNewCategoryForm}>
          <span aria-hidden="true">+</span>
          Nueva categoría
        </button>
      </div>
    </main>
  );
}

export default AdminCategories;
