import React, { useEffect } from "react";
import NationalOutsideProjectForm from "../components/NationalOutsideProjectForm";

function NationalOutsideProject() {
  useEffect(() => {
    document.title = "Forms DI | Participación Nacional Fuera de Proyectos"; // Título de la página de Participación Nacional Fuera de Proyectos
  }, []);

  return <NationalOutsideProjectForm />;
}

export default NationalOutsideProject;
