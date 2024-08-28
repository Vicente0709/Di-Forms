import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes del formulario
import PersonalDetails from "./ComponetWithinProjects/PersonalDetails";
import ProjectDetails from "./ComponetWithinProjects/ProjectDetails";
import EventDetails from "./ComponetWithinProjects/EventDetails";
import Justification from "./ComponetWithinProjects/Justification";
import PaymentInfo from "./ComponetWithinProjects/PaymentInfo";
import ExpensesDeclaration from "./ComponetWithinProjects/ExpensesDeclaration";
import BankAccount from "./ComponetWithinProjects/BankAccount";
import InstitutionalServices from "./ComponetWithinProjects/InstitutionalServices";
import ActivitySchedule from "./ComponetWithinProjects/ActivitySchedule";
import Transportation from "./ComponetWithinProjects/Transportation";

// Importación de las funciones para generar documentos
import {
  generateMemorandum,
  generateAnexoA,
  generateAnexoA2,
} from "../utils/documentGenerator";

function EventParticipationWithinProjectsForm() {
  // Estado para controlar la visibilidad de la sección de descargas
  const [showDownloadSection, setShowDownloadSection] = useState(false);

  // Estado para almacenar la diferencia en días entre fechas
  const [diferenciaEnDias, setDiferenciaEnDias] = useState(0);

  // Configuración de react-hook-form con valores predeterminados obtenidos de localStorage
  const methods = useForm({
    mode: "onChange", // Actualización del formulario en cada cambio
    reValidateMode: "onChange", // Revalidación del formulario en cada cambio
    defaultValues: JSON.parse(localStorage.getItem("formData")) || {}, // Valores predeterminados del formulario
  });

  const { watch } = methods;

  // useEffect para observar los cambios en el formulario y calcular la diferencia en días
  useEffect(() => {
    const subscription = watch((data) => {
      // Guardar los datos del formulario en localStorage
      localStorage.setItem("formData", JSON.stringify(data));

      // Obtener la última fecha de llegada y la primera fecha de salida del transporte
      const ultimaFechaLlegada =
        data.transporte.length > 0
          ? data.transporte[data.transporte.length - 1]?.fechaLlegada
          : "";
      const primeraFechaSalida = data.transporte[0]?.fechaSalida;

      if (ultimaFechaLlegada && primeraFechaSalida) {
        // Convertir las fechas en objetos Date
        const fechaInicio = new Date(primeraFechaSalida);
        const fechaFinal = new Date(ultimaFechaLlegada);

        // Calcular la diferencia en milisegundos y convertirla a días
        const diferenciaEnMilisegundos = fechaFinal - fechaInicio;
        const diferenciaEnDias =
          Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24)) + 1;

        // Guardar la diferencia en días en localStorage y actualizar el estado
        localStorage.setItem(
          "diferenciaDias",
          JSON.stringify({ diferencia: diferenciaEnDias })
        );
        setDiferenciaEnDias(diferenciaEnDias);
      } else {
        // Si no hay fechas válidas, establecer la diferencia en días a 0
        localStorage.setItem("diferenciaDias", JSON.stringify({ diferencia: 0 }));
        setDiferenciaEnDias(0);
      }
    });

    // Limpieza del efecto al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch, setDiferenciaEnDias]);

  // Función que se ejecuta al enviar el formulario
  const onSubmit = (data) => {
    setShowDownloadSection(true); // Mostrar la sección de descargas
    console.log(methods.getValues()); // Log de los valores del formulario
  };

  // Función para generar un documento DOCX
  const handleGenerateDocx = () => {
    const formData = methods.getValues();

    // Verificar si el rol en el proyecto es "Director"
    if (formData.rolEnProyecto === "Director") {
      generateMemorandum(formData); // Generar el memorando
    } else {
      alert("Solo el Director puede generar el memorando.");
    }
    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  // Función para generar el Anexo A en formato PDF
  const handleGeneratePdf = () => {
    const formData = methods.getValues();
    generateAnexoA(formData); // Generar el Anexo A
    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  // Función para generar el Anexo A2 en formato PDF
  const handleGeneratePdf2 = () => {
    const formData = methods.getValues();
    generateAnexoA2(formData); // Generar el Anexo A2
    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  // Función para descargar todos los documentos
  const handleDownloadAll = () => {
    const formData = methods.getValues();

    // Verificar si el rol en el proyecto es "Director"
    if (formData.rolEnProyecto === "Director") {
      // Generar el memorando con un retraso de 1 segundo
      setTimeout(() => {
        generateMemorandum(formData);
      }, 1000);

      // Generar el Anexo A con un retraso de 2 segundos
      setTimeout(() => {
        generateAnexoA(formData);
      }, 2000);

      // Generar el Anexo A2 sin retraso adicional
      generateAnexoA2(formData);
    } else {
      // Si no es "Director", solo generar los Anexos
      generateAnexoA(formData);

      // Generar el Anexo A2 con un retraso de 1 segundo
      setTimeout(() => {
        generateAnexoA2(formData);
      }, 1000);
    }
    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  // Función para limpiar el formulario
  const handleClearForm = () => {
    localStorage.removeItem("formData"); // Eliminar los datos del formulario de localStorage
    setShowDownloadSection(false); // Ocultar la sección de descargas
    window.location.reload(); // Recargar la página para resetear el formulario
  };

  return (
    <FormProvider {...methods}>
      <Container>
        {/* Título del formulario */}
        <h1 className="text-center my-4">
          Formulario para participación en eventos dentro de proyectos
        </h1>

        {/* Formulario con diferentes secciones */}
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <ProjectDetails  />
          <PersonalDetails />
          <EventDetails />
          <Justification />
          <Transportation />
          {diferenciaEnDias > 15 && <ActivitySchedule />}
          <PaymentInfo />
          <ExpensesDeclaration />
          <BankAccount />
          <InstitutionalServices />

          {/* Botón para enviar el formulario */}
          <Row className="mt-4">
            <Col className="text-center">
              <Button id="btn_enviar" type="submit" variant="primary">
                Enviar
              </Button>
            </Col>
          </Row>

          {/* Sección de descarga de documentos, visible tras enviar el formulario */}
          {showDownloadSection && (
            <div className="mt-4">
              <Row className="justify-content-center">
                <Col md={4} className="text-center">
                  <div onClick={handleGenerateDocx} className="download-item">
                    <img
                      src="IconWord.png"
                      alt="Word Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Memorando</span>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div onClick={handleGeneratePdf} className="download-item">
                    <img
                      src="IconPdf.png"
                      alt="PDF Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Anexo A</span>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div onClick={handleGeneratePdf2} className="download-item">
                    <img
                      src="IconPdf.png"
                      alt="PDF Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Anexo A2</span>
                  </div>
                </Col>
              </Row>

              {/* Botón para descargar todos los documentos */}
              <Row className="mt-3">
                <Col className="text-center">
                  <Button
                    type="button"
                    onClick={handleDownloadAll}
                    variant="success"
                  >
                    Descargar Todo
                  </Button>
                </Col>
              </Row>
            </div>
          )}

          {/* Botón para limpiar el formulario */}
          <Row className="mt-4">
            <Col className="text-center">
              <Button
                type="button"
                onClick={handleClearForm}
                variant="danger"
              >
                Limpiar Formulario
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </FormProvider>
  );
}

export default EventParticipationWithinProjectsForm;