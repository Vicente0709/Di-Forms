import React, { useEffect } from "react";
import EventParticipationOutsideProjectsForm from "../components/EventParticipationOutsideProjectsForm";

function EventParticipationOutsideProjects() {
  useEffect(() => {
    document.title = "Forms DI | Participación en Eventos Fuera de Proyectos"; // Título de la página de Participación en Eventos Fuera de Proyectos
  }, []);

  return <EventParticipationOutsideProjectsForm />;
}

export default EventParticipationOutsideProjects;
