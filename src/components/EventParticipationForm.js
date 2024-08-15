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

import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

function generateMemorandum(data) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Formato de memorando",
                bold: true,
                size: 24,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 300 },
            alignment: "start",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "PARA:\t\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: "Dr. Marco Santorum",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "\t\tVicerector de Investigación, Innovación y Vinculación",
                size: 22,
                bold: true,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "ASUNTO:\t\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: " Solicitud dentro de proyecto, de auspicio para movilidad al exterior para participar en evento académico",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `En mi calidad de ${data.cargo} del Proyecto ${data.codigoProyecto}, AUTORIZO EL GASTO y solicito a usted se realicen las gestiones correspondientes para participar en el Evento titulado "${data.tituloEvento}" a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. Para lo cual, adjunto los correspondientes documentos.`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Con sentimientos de distinguida consideración.",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Atentamente,",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.nombreCompleto,
                size: 20,
                bold: true,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${data.cargo.toUpperCase()} DEL PROYECTO ${data.codigoProyecto}`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "memorandum.docx");
  });
}

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
    generateMemorandum(formData); // Generar el documento con los datos
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
              src="IconWord.png" // Coloca aquí la ruta a tu icono de Word
              alt="Word Icon"
              style={{ width: "32px", height: "45px", marginRight: "8px" }}
            />
            <span>Descargar Memorando</span>
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