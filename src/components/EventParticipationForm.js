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
import { Alert } from "react-bootstrap";

function EventParticipationForm() {
  const [showDownloadSection, setShowDownloadSection] = useState(false);

  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: JSON.parse(localStorage.getItem("formData")) || {}, // Cargar datos guardados si existen
  });

  const { watch, reset } = methods;

  // Guardar los datos en localStorage cada vez que cambien
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem("formData", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data) => {
    console.log("Datos del formulario:", data);
    setShowDownloadSection(true); // Mostrar la sección de descarga
  };

  const handleGenerateDocx = () => {
    const formData = methods.getValues(); // Obtener los valores actuales del formulario

    // Verificar si el rol es "Director"
    if (formData.rolEnProyecto === "Director") {
      generateMemorandum(formData); // Generar el documento con los datos
    } else {
      // Mostrar una alerta si el rol no es "Director"
      alert("Solo el Director puede generar el memorando.");
    }
  };

  const handleGeneratePdf = () => {
    const formData = methods.getValues(); // Obtener los valores actuales del formulario

    generateAnexoA(formData); // Generar el PDF con los datos
  };

  const handleClearForm = () => {
    reset(); // Limpiar los campos del formulario
    localStorage.removeItem("formData"); // Eliminar datos de localStorage
    setShowDownloadSection(false); // Ocultar la sección de descarga
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* Detalles del proyecto */}
        <ProjectDetails />
        {/* Detalles del evento */}
        <EventDetails />
        {/* Justificación */}
        <Justification />
        {/* Información de pago */}
        <PaymentInfo />
        {/* Declaración de gastos */}
        <ExpensesDeclaration />
        {/* Cronograma de actividades */}
        <ActivitySchedule />
        {/* Transporte */}
        <Transportation />
        {/* Cuenta bancaria */}
        <BankAccount />
        {/* Servicios institucionales */}
        <InstitutionalServices />

        <button id="btn_enviar" type="submit">
          Enviar
        </button>

        {/* Sección de descarga con animación */}
        <div
          style={{
            maxHeight: showDownloadSection ? "300px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.5s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
              cursor: "pointer",
            }}
            onClick={handleGenerateDocx}
          >
            <img
              src="IconWord.png"
              alt="Word Icon"
              style={{ width: "32px", height: "45px", marginRight: "8px" }}
            />
            <span>Descargar Memorando</span>
          </div>
        </div>
        <div
  style={{
    maxHeight: showDownloadSection ? "300px" : "0px",
    overflow: "hidden",
    transition: "max-height 0.5s ease-out",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginTop: "20px",
      cursor: "pointer",
    }}
    onClick={handleGeneratePdf}
  >
    <img
      src="IconPdf.png"
      alt="PDF Icon"
      style={{ width: "32px", height: "45px", marginRight: "8px" }}
    />
    <span>Descargar Anexo A</span>
  </div>
</div>

        {/* Botón para limpiar el formulario */}
        <button
          type="button"
          onClick={handleClearForm}
          style={{
            marginTop: "20px",
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Limpiar Formulario
        </button>
      </form>
    </FormProvider>
  );
}

export default EventParticipationForm;
