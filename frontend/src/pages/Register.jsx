import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

          <div className="form-row">

            <label>
              Nombre

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </label>

            <label>
              Teléfono

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Tu teléfono"
                required
              />
            </label>

          </div>

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
          >
            Crear mi cuenta
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