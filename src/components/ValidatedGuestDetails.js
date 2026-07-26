import React, { useMemo, useState } from "react";

async function requestValidatedDetails(payload) {
  const response = await fetch("/api/getValidatedDetails", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const requestError = new Error(body.error || "No fue posible validar tu registro.");
    requestError.status = response.status;
    throw requestError;
  }

  return body.record || null;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(dateValue));
}

function ValidatedGuestDetails({ eventName, dateLabel, timeLabel, place, locationUrl }) {
  const [formData, setFormData] = useState({
    phone: "",
    guests: "",
  });
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fallbackMapUrl = useMemo(() => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place || "")}`;
  }, [place]);

  const mapUrl = locationUrl || fallbackMapUrl;
  const addressText = place;

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!formData.phone.trim() || !formData.guests.trim()) {
      setError("Escribe tu telefono y numero de invitados para validar tu registro.");
      setRecord(null);
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Tu telefono debe incluir al menos 10 digitos.");
      setRecord(null);
      return;
    }

    const guestsNumber = Number.parseInt(formData.guests.trim(), 10);
    if (!Number.isFinite(guestsNumber) || guestsNumber < 0) {
      setError("Escribe un numero de invitados valido.");
      setRecord(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nextRecord = await requestValidatedDetails({
        phone: phoneDigits,
        guests: guestsNumber,
      });
      setRecord(nextRecord);
    } catch (requestError) {
      setRecord(null);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-view">
      <section className="section">
        <div className="container admin-view__header">
          <div>
            <p className="kicker">Invitados validados</p>
            <h1 className="admin-view__title">Detalles finales del evento</h1>
            <p className="lead admin-view__lead">
              Si tu registro ya fue validado, aqui podras revisar los ultimos detalles de {eventName}.
            </p>
          </div>
          <a href="/" className="button button--primary">
            Volver a la invitacion
          </a>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container admin-panel admin-panel--narrow">
          <form className="form auto-center" onSubmit={onSubmit} noValidate>
            <label>
              Telefono registrado
              <input type="tel" name="phone" value={formData.phone} onChange={onChange} required />
            </label>
            <label>
              Numero de invitados
              <input type="number" min="0" name="guests" value={formData.guests} onChange={onChange} required />
            </label>
            <button type="submit" className="button button--primary" disabled={loading}>
              {loading ? "Validando..." : "Consultar mis detalles"}
            </button>
            <p className={`form__message${error ? " admin-feedback--error" : ""}`} aria-live="polite">
              {error || "Usa el telefono y numero de invitados con los que hiciste tu registro RSVP."}
            </p>
          </form>
        </div>
      </section>

      {record ? (
        <section className="section">
          <div className="container validated-grid">
            <article className="detail">
              <h2>Invitado</h2>
              <p>{record.name || "Invitado"}</p>
            </article>
            <article className="detail">
              <h2>Lugares apartados</h2>
              <p>{record.guests || "0"}</p>
            </article>
            <article className="detail">
              <h2>Validado el</h2>
              <p>{formatDate(record.updatedAt || record.createdAt)}</p>
            </article>
          </div>

          <div className="container admin-panel validated-panel">
            <h2>Tu evento</h2>
            <p className="admin-feedback">Todo esta listo para recibirte. Aqui tienes la informacion actualizada.</p>
            <div className="validated-grid">
              <article className="detail">
                <h2>Fecha</h2>
                <p>{dateLabel}</p>
              </article>
              <article className="detail">
                <h2>Hora</h2>
                <p>{timeLabel}</p>
              </article>
              <article className="detail">
                <h2>Lugar</h2>
                <p>{addressText}</p>
              </article>
            </div>
            <a href={mapUrl} className="button button--primary validated-map-link" target="_blank" rel="noreferrer">
              Ver ubicacion precisa
            </a>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default ValidatedGuestDetails;
