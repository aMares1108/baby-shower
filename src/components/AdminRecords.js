import React, { useEffect, useState } from "react";

const ADMIN_SESSION_KEY = "adminSessionToken";

async function requestRecords(sessionToken) {
  const headers = sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
  const response = await fetch("/api/listRecords", { headers });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "No fue posible cargar los registros.");
  }

  return payload.records || [];
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(dateValue));
}

async function loginAdmin(username, password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "No fue posible iniciar sesion.");
  }

  return payload.token;
}

function AdminRecords({ eventName }) {
  const [records, setRecords] = useState([]);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [sessionToken, setSessionToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);

  const totalGuests = records.reduce((sum, record) => {
    return sum + (Number(record.guests) || 0);
  }, 0);

  const loadRecords = async (token) => {
    setLoading(true);
    setError("");

    try {
      const nextRecords = await requestRecords(token);
      setRecords(nextRecords);
    } catch (requestError) {
      setRecords([]);
      if (requestError.message === "Unauthorized") {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setSessionToken("");
        setError("Tu sesion ya no es valida. Inicia sesion de nuevo.");
      } else {
        setError(requestError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedSessionToken = sessionStorage.getItem(ADMIN_SESSION_KEY) || "";

    if (!storedSessionToken) {
      setLoading(false);
      return;
    }

    setSessionToken(storedSessionToken);
    loadRecords(storedSessionToken);
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setAuthenticating(true);
    setError("");

    try {
      const nextSessionToken = await loginAdmin(credentials.username, credentials.password);
      sessionStorage.setItem(ADMIN_SESSION_KEY, nextSessionToken);
      setSessionToken(nextSessionToken);
      setCredentials({ username: credentials.username, password: "" });
      await loadRecords(nextSessionToken);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setAuthenticating(false);
    }
  };

  const onLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setSessionToken("");
    setRecords([]);
    setCredentials({ username: "", password: "" });
    setError("");
  };

  if (!sessionToken) {
    return (
      <main className="admin-view">
        <section className="section">
          <div className="container admin-view__header">
            <div>
              <p className="kicker">Administrador</p>
              <h1 className="admin-view__title">Iniciar sesion</h1>
              <p className="lead admin-view__lead">
                Accede con las credenciales de administrador configuradas para {eventName}.
              </p>
            </div>
            <a href="/" className="button button--primary">
              Volver a la invitacion
            </a>
          </div>
        </section>

        <section className="section section--soft">
          <div className="container admin-panel admin-panel--narrow">
            <form className="form auto-center" onSubmit={onLogin} noValidate>
              <label>
                Usuario
                <input
                  type="text"
                  name="username"
                  required
                  value={credentials.username}
                  onChange={onChange}
                />
              </label>
              <label>
                Contraseña
                <input
                  type="password"
                  name="password"
                  required
                  value={credentials.password}
                  onChange={onChange}
                />
              </label>
              <button type="submit" className="button button--primary" disabled={authenticating}>
                {authenticating ? "Ingresando..." : "Entrar al panel"}
              </button>
              <p className={`form__message${error ? " admin-feedback--error" : ""}`} aria-live="polite">
                {error}
              </p>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const onRefresh = async () => {
    await loadRecords(sessionToken);
  };

  return (
    <main className="admin-view">
      <section className="section">
        <div className="container admin-view__header">
          <div>
            <p className="kicker">Administrador</p>
            <h1 className="admin-view__title">Registros de confirmacion</h1>
            <p className="lead admin-view__lead">
              Consulta las confirmaciones capturadas para {eventName}.
            </p>
          </div>
          <a href="/" className="button button--primary">
            Volver a la invitacion
          </a>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container admin-grid">
          <article className="detail">
            <h2>Total de registros</h2>
            <p>{records.length}</p>
          </article>
          <article className="detail">
            <h2>Total de invitados</h2>
            <p>{totalGuests}</p>
          </article>
          <article className="detail">
            <h2>Estado</h2>
            <p>{loading ? "Cargando" : error ? "Requiere atencion" : "Actualizado"}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container admin-panel">
          <div className="admin-toolbar">
            <div className="admin-toolbar__summary">
              <p className="kicker">Sesion activa</p>
              <p className="admin-feedback">Consulta y actualiza los registros guardados.</p>
            </div>
            <div className="admin-toolbar__actions">
              <button type="button" className="button button--primary" onClick={onRefresh} disabled={loading}>
                {loading ? "Cargando..." : "Recargar registros"}
              </button>
              <button type="button" className="button admin-button--ghost" onClick={onLogout}>
                Cerrar sesion
              </button>
            </div>
          </div>

          {error ? <p className="admin-feedback admin-feedback--error">{error}</p> : null}
          {!error && loading ? <p className="admin-feedback">Cargando registros...</p> : null}
          {!error && !loading && records.length === 0 ? (
            <p className="admin-feedback">Aun no hay registros guardados.</p>
          ) : null}

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Telefono</th>
                  <th>Invitados</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.rowKey}>
                    <td>{record.name || "Sin nombre"}</td>
                    <td>{record.phone || "Sin telefono"}</td>
                    <td>{record.guests || "0"}</td>
                    <td>{formatDate(record.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminRecords;