import React, { useEffect } from "react";
import SamplingTripWithinProjectForm from "../components/SamplingTripWithinProjectForm";

function SamplingTripWithinProject() {
  useEffect(() => {
    document.title = "Forms DI | Viajes de Muestreo Dentro de Proyectos"; // Título de la página de Viajes de Muestreo en Proyectos
  }, []);

  return <SamplingTripWithinProjectForm />;
}

export default SamplingTripWithinProject;
