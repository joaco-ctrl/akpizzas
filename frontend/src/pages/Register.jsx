import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api, { getApiError } from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.post("/auth/register", {
        nombre: form.name,
        apellido: form.lastName,
        telefono: form.phone,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo crear la cuenta."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="register-page">

      <div className="register-container">

        <div className="register-header">

          <div className="register-logo">
            AK
          </div>

          <span className="section-label">
            AK PIZZAS
          </span>

          <h1>
            Crear cuenta
          </h1>

          <p>
            Registrate para hacer tus pedidos más rápido.
          </p>

        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          {error && <p role="alert">{error}</p>}

          <div className="form-row">

            <label>
              Nombre

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                maxLength="100"
                required
              />
            </label>

            <label>
              Apellido

              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Tu apellido"
                maxLength="100"
                required
              />
            </label>

          </div>

          <label>
            Teléfono

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Tu teléfono"
            />
          </label>

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

          <div className="form-row">

            <label>
              Contraseña

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Contraseña"
                minLength="8"
                maxLength="72"
                required
              />
            </label>

            <label>
              Repetir contraseña

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repetir contraseña"
                minLength="8"
                required
              />
            </label>

          </div>

          <label className="register-terms">
            <input
              type="checkbox"
              required
            />

            <span>
              Acepto los términos y condiciones.
            </span>
          </label>

          <button
            type="submit"
            className="register-submit"
            disabled={submitting}
          >
            {submitting ? "Creando cuenta..." : "Crear mi cuenta"}
          </button>

        </form>

        <div className="register-footer">
          <span>
            ¿Ya tenés una cuenta?
          </span>

          <Link to="/login">
            Iniciar sesión
          </Link>
        </div>

      </div>

    </main>
  );
}

export default Register;