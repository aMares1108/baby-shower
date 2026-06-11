import React from "react";
import Hero from "./components/Hero";
import EventDetails from "./components/EventDetails";
import Countdown from "./components/Countdown";
import Timeline from "./components/Timeline";
import RsvpForm from "./components/RsvpForm";
import Footer from "./components/Footer";
import FloatingImage from "./components/FloatingImage";
import CenteredMedia from "./components/CenteredMedia";
import GiftTableMessage from "./components/GiftTableMessage";
import { eventConfig } from "./data/eventConfig";

function App() {
  const eventDate = new Date(eventConfig.date);
  const dateLabel = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(eventDate);
  const timeLabel = new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(eventDate);

  return (
    <>
      <Hero title={eventConfig.title} subtitle={eventConfig.subtitle} />
      <CenteredMedia
        type="image"
        src="/pancita.jpg"
        alt="Foto de la pancita"
        caption="Preparando todo"
      />
      <main>
        <EventDetails
          dateLabel={dateLabel}
          timeLabel={timeLabel}
          place={eventConfig.place}
        />
        <Countdown targetDate={eventConfig.date} />
        <CenteredMedia
          type="image"
          src="/ultrasonido.jpg"
          alt="Foto del ultrasonido"
          caption="Posando en las primeras fotos"
        />
        <GiftTableMessage
          title="Mesa de regalos"
          message="Si deseas consentir al bebé con un detalle, tendremos una mesa de regalos preparada durante el evento."
          note="Tu presencia es lo más importante para nosotros, pero cualquier obsequio será recibido con mucho cariño."
          href={eventConfig.giftTableUrl}
          buttonLabel={eventConfig.giftTableLabel}
        />
        <Timeline items={eventConfig.timeline} />
        <RsvpForm />
        <CenteredMedia
          type="image"
          src="/ultrasonid_3d.jpg"
          alt="Foto del ultrasonido 3D"
          caption="Nos vemos pronto"
        />
      </main>
      <Footer name={eventConfig.name} />
      <FloatingImage src="/Copilot_20260602_204846.png" alt="Ilustracion de baby shower" />
    </>
  );
}

export default App;
