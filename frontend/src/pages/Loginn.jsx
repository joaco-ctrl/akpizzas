import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Loginn.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/");
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
            >
              Iniciar sesión
            </button>

          </form>

          <div className="auth-footer">
            <span>
              ¿Todavía no tenés una cuenta?
            </span>

            <Link to="/register">
              Crear cuenta
            </Link>
          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;