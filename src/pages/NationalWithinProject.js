import React, { useEffect } from "react";
import NationalWithinProjectForm from "../components/NationalWithinProjectForm";

function NationalWithinProject() {
  useEffect(() => {
    document.title = "Forms DI | Participación Nacional Dentro de Proyectos"; // Título de la página de Participación Nacional en Proyectos
  }, []);

  return <NationalWithinProjectForm />;
}

export default NationalWithinProject;
