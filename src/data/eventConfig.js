var name = "Anel";
var defaultDetailedPlace = "Texcoco, a 5 min de la Feria del Caballo";
var defaultLocationUrl = "https://www.google.com/maps/search/?api=1&query=Texcoco%2C+Estado+de+Mexico";

export const eventConfig = {
  title: `Baby Shower de ${name}`,
  name: name,
  subtitle: "Acompáñanos a celebrar la dulce espera con juegos, brunch y sorpresas. Recuerda confirmar tu asistencia",
  date: "2026-08-01T12:00:00-06:00",
  place: "Texcoco, a 5 min de la Feria del Caballo",
  detailedPlace: process.env.REACT_APP_FINAL_DETAILS_ADDRESS_TEXT || defaultDetailedPlace,
  locationUrl: process.env.REACT_APP_FINAL_DETAILS_MAP_URL || defaultLocationUrl,
  giftTableUrl: "https://mesaderegalos.liverpool.com.mx/milistaderegalos/51997221",
  giftTableLabel: "Ver mesa de regalos",
  timeline: [
    { time: "12:00", activity: "Bienvenida" },
    { time: "12:40", activity: "Juegos" },
    { time: "14:00", activity: "Brunch" }
  ]
};
