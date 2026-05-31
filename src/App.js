import React from "react";
import Hero from "./components/Hero";
import EventDetails from "./components/EventDetails";
import Countdown from "./components/Countdown";
import Timeline from "./components/Timeline";
import RsvpForm from "./components/RsvpForm";
import Footer from "./components/Footer";
import { eventConfig } from "./data/eventConfig";

function App() {
  return (
    <>
      <Hero title={eventConfig.title} subtitle={eventConfig.subtitle} />
      <main>
        <EventDetails
          dateLabel="Sabado 20 de junio de 2026"
          timeLabel="11:00 AM"
          place={eventConfig.place}
        />
        <Countdown targetDate={eventConfig.date} />
        <Timeline items={eventConfig.timeline} />
        <RsvpForm />
      </main>
      <Footer name={eventConfig.name} />
    </>
  );
}

export default App;
