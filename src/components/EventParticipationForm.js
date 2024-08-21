import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ProjectDetails from "./ComponetEventForm/ProjectDetails";
import EventDetails from "./ComponetEventForm/EventDetails";
import Justification from "./ComponetEventForm/Justification";
import PaymentInfo from "./ComponetEventForm/PaymentInfo";
import ExpensesDeclaration from "./ComponetEventForm/ExpensesDeclaration";
import BankAccount from "./ComponetEventForm/BankAccount";
import InstitutionalServices from "./ComponetEventForm/InstitutionalServices";
import ActivitySchedule from "./ComponetEventForm/ActivitySchedule";
import Transportation from "./ComponetEventForm/Transportation";

import { generateMemorandum, generateAnexoA } from "../utils/documentGenerator";

function EventParticipationForm() {
  // Estado para mostrar/ocultar la sección de descarga
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  // Estado para almacenar la diferencia en días entre las fechas
  const [diferenciaEnDias, setDiferenciaEnDias] = useState(0);

  // Inicialización del formulario con valores predeterminados o datos del localStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: JSON.parse(localStorage.getItem("formData")) || {},
  });

  const { watch } = methods;

  // Efecto para guardar los datos en localStorage y calcular la diferencia de días cada vez que cambien
  useEffect(() => {
    const subscription = watch((data) => {
      // Guardar datos en localStorage
      localStorage.setItem("formData", JSON.stringify(data));

      // Obtener la última fecha de llegada y la primera fecha de salida
      const ultimaFechaLlegada =
        data.transporte.length > 0
          ? data.transporte[data.transporte.length - 1]?.fechaLlegada
          : "";
      const primeraFechaSalida = data.transporte[0]?.fechaSalida;

      if (ultimaFechaLlegada && primeraFechaSalida) {
        // Convertir las fechas en objetos Date
        const fechaInicio = new Date(primeraFechaSalida);
        const fechaFinal = new Date(ultimaFechaLlegada);

        // Calcular la diferencia en días
        const diferenciaEnMilisegundos = fechaFinal - fechaInicio;
        const diferenciaEnDias =
          Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24)) + 2;

        // Actualizar el estado
        setDiferenciaEnDias(diferenciaEnDias);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // Función que se ejecuta al enviar el formulario
  const onSubmit = (data) => {
    setShowDownloadSection(true); // Mostrar la sección de descarga
  };

  // Función para generar un documento DOCX
  const handleGenerateDocx = () => {
    const formData = methods.getValues();

    if (formData.rolEnProyecto === "Director") {
      generateMemorandum(formData);
    } else {
      alert("Solo el Director puede generar el memorando.");
    }
  };

  // Función para generar un documento PDF
  const handleGeneratePdf = () => {
    const formData = methods.getValues();
    generateAnexoA(formData);
  };

  // Función para limpiar el formulario
  const handleClearForm = () => {
    localStorage.removeItem("formData"); // Eliminar datos de localStorage
    setShowDownloadSection(false); // Ocultar la sección de descarga
    window.location.reload(); // Recargar la página 
  };

  return (
    <FormProvider {...methods}>
      <h1 style={{ textAlign: 'center' }}>Formulario de Participación en Eventos</h1>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* Renderizado de componentes del formulario */}
        <ProjectDetails />
        <EventDetails />
        <Justification />
        <Transportation />
        {diferenciaEnDias > 15 && <ActivitySchedule />}
        <PaymentInfo />
        <ExpensesDeclaration />
        <BankAccount />
        <InstitutionalServices />

        <button id="btn_enviar" type="submit">
          Enviar
        </button>

        {/* Sección de descarga con animación */}
        <div className={showDownloadSection ? "download-section show" : "download-section"}>
          <div className="download-item" onClick={handleGenerateDocx}>
            <img
              src="IconWord.png"
              alt="Word Icon"
              className="download-icon"
            />
            <span>Descargar Memorando</span>
          </div>
          <div className="download-item" onClick={handleGeneratePdf}>
            <img
              src="IconPdf.png"
              alt="PDF Icon"
              className="download-icon"
            />
            <span>Descargar Anexo A</span>
          </div>
        </div>

        {/* Botón para limpiar el formulario */}
        <button
          type="button"
          onClick={handleClearForm}
          className="clear-button"
        >
          Limpiar Formulario
        </button>
      </form>
    </FormProvider>
  );
}

export default EventParticipationForm;