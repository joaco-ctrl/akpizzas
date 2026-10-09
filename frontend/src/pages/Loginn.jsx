import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import api, { getApiError } from "../services/api";
import "./Loginn.css";

function Login({ onLogin }) {
  const location = useLocation();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("akpizzas_token", data.token);
      localStorage.setItem("akpizzas_user", JSON.stringify(data.usuario));
      onLogin?.(data.usuario, location.state?.from?.pathname);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo iniciar sesión."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-container">

        <div className="auth-decoration">
          <div className="auth-logo">
            AK
          </div>

          <h2>
            AK Pizzas
          </h2>

          <p>
            Tu lugar para hamburguesas,
            pizzas y mucho más.
          </p>
        </div>

        <div className="auth-form-container">

          <div className="auth-header">
            <span className="section-label">
              BIENVENIDO
            </span>

            <h1>
              Iniciar sesión
            </h1>

            <p>
              Ingresá a tu cuenta para continuar.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {error && <p role="alert">{error}</p>}

            <label>
              Email

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </label>

            <label>
              Contraseña

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
                required
              />
            </label>

            <div className="form-extra">
              <label className="remember">
                <input
                  type="checkbox"
                />
                <span>Recordarme</span>
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={submitting}
            >
              {submitting ? "Ingresando..." : "Iniciar sesión"}
            </button>

          </form>

          <div className="auth-footer">
            <span>
              ¿Todavía no tenés una cuenta?
            </span>

            <Link to="/registro"> Crear cuenta </Link>
            
          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;