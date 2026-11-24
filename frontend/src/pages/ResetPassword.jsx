import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import api, { getApiError } from "../services/api";
import "./Loginn.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/password-reset/confirm", { token, password });
      setMessage(data.mensaje);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo restablecer la contraseña."));
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
          <p>Elegí una contraseña nueva para volver a ingresar.</p>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <span className="section-label">NUEVA CONTRASEÑA</span>
            <h1>Restablecer contraseña</h1>
            <p>El enlace es válido durante 15 minutos y se puede usar una sola vez.</p>
          </div>

          {message ? (
            <>
              <p className="auth-message auth-success" role="status">{message}</p>
              <div className="auth-footer">
                <Link to="/login">Iniciar sesión</Link>
              </div>
            </>
          ) : !token ? (
            <>
              <p className="auth-message auth-error" role="alert">
                El enlace no es válido. Solicitá uno nuevo para continuar.
              </p>
              <div className="auth-footer">
                <Link to="/recuperar-contrasena">Solicitar otro enlace</Link>
              </div>
            </>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <p className="auth-message auth-error" role="alert">{error}</p>}

              <label>
                Nueva contraseña
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength="8"
                  autoComplete="new-password"
                  required
                />
              </label>

              <label>
                Repetir contraseña
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength="8"
                  autoComplete="new-password"
                  required
                />
              </label>

              <button type="submit" className="auth-submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;
