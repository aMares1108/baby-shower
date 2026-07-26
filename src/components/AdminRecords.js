import React, { useEffect, useState } from "react";

const LOGIN_URL = "/.auth/login/aad?post_login_redirect_uri=/admin";
const LOGOUT_URL = "/.auth/logout?post_logout_redirect_uri=/admin";

async function requestRecords() {
  const response = await fetch("/api/listRecords");
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const requestError = new Error(payload.error || "No fue posible cargar los registros.");
    requestError.status = response.status;
    throw requestError;
  }

  return payload.records || [];
}

async function requestUpdateRecord(record) {
  const response = await fetch("/api/updateRecord", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record)
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const requestError = new Error(payload.error || "No fue posible actualizar el registro.");
    requestError.status = response.status;
    throw requestError;
  }

  return payload;
}

async function requestDeleteRecord(record) {
  const response = await fetch("/api/deleteRecord", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record)
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const requestError = new Error(payload.error || "No fue posible eliminar el registro.");
    requestError.status = response.status;
    throw requestError;
  }

  return payload;
}

async function requestClientPrincipal() {
  const response = await fetch("/.auth/me");
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    return null;
  }

  if (payload?.clientPrincipal) {
    return payload.clientPrincipal;
  }

  return null;
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

function buildWhatsAppUrl(record, eventName, dateLabel, timeLabel, place) {
  const digits = (record.phone || "").replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  const phone = digits.startsWith("52") ? digits : `52${digits}`;
  const guests = Number(record.guests) || 0;
  const name = record.name || "invitado";
  const noGuests = guests === 0;
  const guestsLabel = guests === 1 ? "1 lugar" : `${guests} lugares`;
  const message = noGuests
    ? `¡Hola ${name}! 🎀\n\n` +
      `Te escribimos porque notamos que aún no tienes lugares registrados para el *${eventName}* y ¡nos encantaría contarte entre nuestros invitados! 🥰\n\n` +
      `📅 *Fecha:* ${dateLabel}\n` +
      `🕐 *Hora:* ${timeLabel}\n` +
      `📍 *Lugar:* ${place}\n\n` +
      `¿Podrás acompañarnos? ¿Cuántos lugares necesitas apartar? 🍼\n\n` +
      `¡Con mucho cariño te esperamos! ✨`
    : `¡Hola ${name}! 🎀\n\n` +
      `Te escribimos para recordarte que el *${eventName}* ya está muy cerca y queremos asegurarnos de que todo esté listo para recibirte.\n\n` +
      `📋 *Tus datos de registro:*\n` +
      `👤 Nombre: ${name}\n` +
      `👥 Lugares reservados: ${guestsLabel}\n\n` +
      `📅 *Fecha:* ${dateLabel}\n` +
      `🕐 *Hora:* ${timeLabel}\n` +
      `📍 *Lugar:* ${place}\n\n` +
      `¿Tus datos son correctos? ¿Sigues confirmado/a? 🥰\n\n` +
      `¡Con mucho cariño te esperamos! 🍼✨`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function AdminRecords({ eventName, dateLabel, timeLabel, place }) {
  const [records, setRecords] = useState([]);
  const [principal, setPrincipal] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingRowKey, setProcessingRowKey] = useState("");

  const totalGuests = records.reduce((sum, record) => {
    return sum + (Number(record.guests) || 0);
  }, 0);

  const loadRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const nextRecords = await requestRecords();
      setRecords(nextRecords);
    } catch (requestError) {
      setRecords([]);
      if (requestError.status === 401) {
        setPrincipal(null);
        setError("Tu sesion ya no es valida. Inicia sesion de nuevo.");
      } else if (requestError.status === 403) {
        setError("Tu usuario no tiene permisos de colaborador.");
      } else {
        setError(requestError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      setError("");

      const nextPrincipal = await requestClientPrincipal();

      if (!nextPrincipal) {
        setPrincipal(null);
        setLoading(false);
        return;
      }

      setPrincipal(nextPrincipal);
      await loadRecords();
    };

    initialize();
  }, []);

  const onLogout = () => {
    window.location.assign(LOGOUT_URL);
  };

  if (!principal) {
    return (
      <main className="admin-view">
        <section className="section">
          <div className="container admin-view__header">
            <div>
              <p className="kicker">Administrador</p>
              <h1 className="admin-view__title">Iniciar sesion</h1>
              <p className="lead admin-view__lead">
                Accede con Entra ID para administrar las confirmaciones de {eventName}.
              </p>
            </div>
            <a href="/" className="button button--primary">
              Volver a la invitacion
            </a>
          </div>
        </section>

        <section className="section section--soft">
          <div className="container admin-panel admin-panel--narrow">
            <div className="form auto-center">
              <a href={LOGIN_URL} className="button button--primary">
                Iniciar sesion con Entra ID
              </a>
              <p className={`form__message${error ? " admin-feedback--error" : ""}`} aria-live="polite">
                {error || "Necesitas el rol colaborador para acceder al panel."}
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const onRefresh = async () => {
    await loadRecords();
  };

  const handleProtectedActionError = (requestError) => {
    if (requestError.status === 401) {
      setPrincipal(null);
      setError("Tu sesion ya no es valida. Inicia sesion de nuevo.");
      return;
    }

    if (requestError.status === 403) {
      setError("Tu usuario no tiene permisos de colaborador.");
      return;
    }

    setError(requestError.message || "No fue posible completar la accion.");
  };

  const onEditRecord = async (record) => {
    const nextName = window.prompt("Nombre", record.name || "");
    if (nextName === null) {
      return;
    }

    const nextPhone = window.prompt("Telefono", record.phone || "");
    if (nextPhone === null) {
      return;
    }

    const nextGuests = window.prompt("Invitados", String(record.guests || "0"));
    if (nextGuests === null) {
      return;
    }

    const nextMessage = window.prompt("Estado (ej. pending o validated)", record.message || "pending");
    if (nextMessage === null) {
      return;
    }

    const shouldUpdate = window.confirm("¿Confirmas actualizar este registro?");
    if (!shouldUpdate) {
      return;
    }

    setProcessingRowKey(record.rowKey);
    setError("");

    try {
      await requestUpdateRecord({
        partitionKey: record.partitionKey,
        rowKey: record.rowKey,
        name: nextName.trim(),
        phone: nextPhone.trim(),
        guests: nextGuests.trim(),
        message: nextMessage.trim(),
      });
      await loadRecords();
    } catch (requestError) {
      handleProtectedActionError(requestError);
    } finally {
      setProcessingRowKey("");
    }
  };

  const onDeleteRecord = async (record) => {
    const shouldDelete = window.confirm("¿Seguro que deseas eliminar este registro? Esta accion no se puede deshacer.");
    if (!shouldDelete) {
      return;
    }

    setProcessingRowKey(record.rowKey);
    setError("");

    try {
      await requestDeleteRecord({
        partitionKey: record.partitionKey,
        rowKey: record.rowKey,
      });
      await loadRecords();
    } catch (requestError) {
      handleProtectedActionError(requestError);
    } finally {
      setProcessingRowKey("");
    }
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
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.rowKey}>
                    <td>{record.name || "Sin nombre"}</td>
                    <td>
                      {record.phone ? (
                        <a
                          href={buildWhatsAppUrl(record, eventName, dateLabel, timeLabel, place)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {record.phone}
                        </a>
                      ) : "Sin telefono"}
                    </td>
                    <td>{record.guests || "0"}</td>
                    <td>
                      <span className={`admin-status${record.message === "validated" ? " admin-status--validated" : ""}`}>
                        {record.message || "pending"}
                      </span>
                    </td>
                    <td>{formatDate(record.createdAt)}</td>
                    <td>
                      <div className="admin-toolbar__actions">
                        <button
                          type="button"
                          className="button admin-button--ghost"
                          onClick={() => onEditRecord(record)}
                          disabled={loading || processingRowKey === record.rowKey}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="button admin-button--ghost"
                          onClick={() => onDeleteRecord(record)}
                          disabled={loading || processingRowKey === record.rowKey}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
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