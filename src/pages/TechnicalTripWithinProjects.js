import React, { useEffect } from "react";
import TechnicalTripWithinProjectsForm from "../components/TechnicalTripWithinProjectsForm";

function TechnicalTripWithinProjects() {
  useEffect(() => {
    document.title = "Forms DI | Viajes Técnicos Dentro de Proyectos"; // Título de la página de Viajes Técnicos en Proyectos
  }, []);

  return <TechnicalTripWithinProjectsForm />;
}

export default TechnicalTripWithinProjects;
