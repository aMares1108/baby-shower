import React, { useState } from "react";

function RsvpForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: ""
  });
  const [message, setMessage] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.phone || !formData.guests) {
      setMessage("Completa todos los campos para confirmar.");
      return;
    }

    try {
      const response = await fetch("/api/addRecord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("No se pudo enviar la confirmacion");
      }

      setMessage("Gracias. Tu asistencia ha sido confirmada.");
      setFormData({ name: "", phone: "", guests: "" });
    } catch {
      setMessage("No fue posible enviar ahora. Intentalo mas tarde.");
    }
  };

  return (
    <section className="section" aria-labelledby="rsvp-title" id="rsvp">
      <div className="container text-center">
        <h2 id="rsvp-title">RSVP</h2>
        <div className="container">
            <form className="form auto-center" onSubmit={onSubmit} noValidate>
              <label>
                Nombre
                <input type="text" name="name" required value={formData.name} onChange={onChange} />
              </label>
              <label>
                Telefono
                <input type="tel" name="phone" required value={formData.phone} onChange={onChange} />
              </label>
              <label>
                Numero de invitados
                <input
                  type="number"
                  min="1"
                  max="6"
                  name="guests"
                  required
                  value={formData.guests}
                  onChange={onChange}
                />
              </label>
              <button type="submit" className="button button--primary">
                Enviar confirmacion
              </button>
              <p className="form__message" aria-live="polite">
                {message}
              </p>
            </form>
        </div>
      </div>
    </section>
  );
}

export default RsvpForm;
