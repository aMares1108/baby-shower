import React from "react";
import Hero from "./components/Hero";
import EventDetails from "./components/EventDetails";
import Countdown from "./components/Countdown";
import Timeline from "./components/Timeline";
import RsvpForm from "./components/RsvpForm";
import Footer from "./components/Footer";
import FloatingImage from "./components/FloatingImage";
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
      <main>
        <EventDetails
          dateLabel={dateLabel}
          timeLabel={timeLabel}
          place={eventConfig.place}
        />
        <Countdown targetDate={eventConfig.date} />
        <Timeline items={eventConfig.timeline} />
        <RsvpForm />
      </main>
      <Footer name={eventConfig.name} />
      <FloatingImage src="/Copilot_20260602_204846.png" alt="Ilustracion de baby shower" />
    </>
  );
}

export default App;
