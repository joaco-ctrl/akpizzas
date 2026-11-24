import { Link } from "react-router-dom";
import { useState } from "react";
import api, { getApiError } from "../services/api";
import "./Loginn.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      const { data } = await api.post("/auth/password-reset/request", { email });
      setMessage(data.mensaje);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo procesar la solicitud."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-decoration">
          <div className="auth-logo">AK</div>
          <h2>AK Pizzas</h2>
          <p>Recuperá el acceso a tu cuenta de forma segura.</p>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <span className="section-label">RECUPERAR CUENTA</span>
            <h1>¿Olvidaste tu contraseña?</h1>
            <p>Ingresá el email asociado a tu cuenta y te enviaremos un enlace.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="auth-message auth-error" role="alert">{error}</p>}
            {message && <p className="auth-message auth-success" role="status">{message}</p>}

            <label>
              Email
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength="150"
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </label>

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>

          <div className="auth-footer">
            <Link to="/login">Volver a iniciar sesión</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
