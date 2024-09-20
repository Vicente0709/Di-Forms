import React, { useEffect } from "react";
import EventParticipationWithinProjectsForm from "../components/EventParticipationWithinProjectsForm";
import "../form1.css"; // Importa el archivo CSS

function EventParticipationWithinProjects() {
  useEffect(() => {
    document.title = "Forms DI | Participación en Eventos Dentro Proyectos"; // Título de la página de Participación en Eventos en Proyectos
  }, []);
  return <EventParticipationWithinProjectsForm />;
}

export default EventParticipationWithinProjects;
