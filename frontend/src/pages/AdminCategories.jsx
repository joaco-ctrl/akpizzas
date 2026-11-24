import { useCallback, useEffect, useState } from "react";
import api, { getApiError } from "../services/api";
import AdminCatalogNav from "../components/AdminCatalogNav";
import "./AdminProducts.css";
import "./AdminCategories.css";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setError("");
    setSuccess("");
  };

  const editCategory = (category) => {
    setCategoryName(category.nombre);
    setEditingId(Number(category.id));
    setError("");
    setSuccess("");
  };

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

          <form className="admin-category-form" onSubmit={handleSubmit}>
            <label className="admin-field">
              {editingId ? "Editar categoría" : "Nueva categoría"}
              <input
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
              {editingId && (
                <button className="admin-cancel-button" type="button" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {loading ? (
            <p className="admin-empty-state">Cargando categorías...</p>
          ) : categories.length === 0 ? (
            <p className="admin-empty-state">Todavía no hay categorías creadas.</p>
          ) : (
            <div className="admin-category-list">
              {categories.map((category) => (
                <article className="admin-category-row" key={category.id}>
                  <span className="admin-category-chip">{category.nombre}</span>
                  <div className="admin-product-actions">
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
      </div>
    </main>
  );
}

export default AdminCategories;
