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
  // Estados para manejar datos y visibilidad de la UI
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const [diferenciaEnDias, setDiferenciaEnDias] = useState(0);
  const [seleccionInscripcion, setSeleccionInscripcion] = useState("");

  // Configuración de react-hook-form con valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange", 
    reValidateMode: "onChange",
    defaultValues: JSON.parse(localStorage.getItem("formData")) || {}, 
  });

  const { watch } = methods;

  // Efecto para sincronizar con localStorage y manejar cálculos de fechas 
  useEffect(() => {
    // Función para inicializar el estado desde localStorage
    const initializeFromLocalStorage = () => {
    const formData = JSON.parse(localStorage.getItem("formData")) || {};

    // Actualizar selección de inscripción
    setSeleccionInscripcion(formData.inscripcion || "");

    // Calcular diferencia en días entre las fechas seleccionadas
    const primeraFechaSalida = formData.transporteIda?.[0]?.fechaSalida || "";
    const ultimaFechaLlegada = formData.transporteRegreso?.[formData.transporteRegreso.length - 1]?.fechaLlegada || "";

    if (primeraFechaSalida && ultimaFechaLlegada) {
      const fechaInicio = new Date(primeraFechaSalida);
      const fechaFinal = new Date(ultimaFechaLlegada);

      const diferenciaEnDias = Math.ceil((fechaFinal - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;

      localStorage.setItem("diferenciaDias", JSON.stringify({ diferencia: diferenciaEnDias }));
      setDiferenciaEnDias(diferenciaEnDias);
    } else {
      localStorage.setItem("diferenciaDias", JSON.stringify({ diferencia: 0 }));
      setDiferenciaEnDias(0);
    }
    };

    // Llamar a la inicialización al montar el componente
    initializeFromLocalStorage();

    // Suscripción a los cambios en el formulario
    const subscription = watch((data) => {
    localStorage.setItem("formData", JSON.stringify(data));

    // Actualizar selección de inscripción
    setSeleccionInscripcion(data.inscripcion);

    // Calcular diferencia en días entre las fechas seleccionadas
    const primeraFechaSalida = data.transporteIda?.[0]?.fechaSalida || "";
    const ultimaFechaLlegada = data.transporteRegreso?.[data.transporteRegreso.length - 1]?.fechaLlegada || "";

    if (primeraFechaSalida && ultimaFechaLlegada) {
      const fechaInicio = new Date(primeraFechaSalida);
      const fechaFinal = new Date(ultimaFechaLlegada);

      const diferenciaEnDias = Math.ceil((fechaFinal - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;

      localStorage.setItem("diferenciaDias", JSON.stringify({ diferencia: diferenciaEnDias }));
      setDiferenciaEnDias(diferenciaEnDias);
    } else {
      localStorage.setItem("diferenciaDias", JSON.stringify({ diferencia: 0 }));
      setDiferenciaEnDias(0);
    }
    });

    // Limpieza al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch, setSeleccionInscripcion, setDiferenciaEnDias]);


  // Función que se ejecuta al enviar el formulario
  const onSubmit = (data) => {
    setShowDownloadSection(true); // Mostrar la sección de descargas
    console.log(methods.getValues()); // Log de los valores del formulario
  };

  // Función para manejar la generación de documentos
  const handleGenerateDocx = () => {
    const formData = methods.getValues();

    if (formData.rolEnProyecto === "Director") {
      generateMemorandum(formData);
    } else {
      alert("Solo el Director puede generar el memorando.");
    }
    setShowDownloadSection(false);
  };

  const handleGeneratePdf = () => {
    const formData = methods.getValues();
    generateAnexoA(formData);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf2 = () => {
    const formData = methods.getValues();
    generateAnexoA2(formData); 
    setShowDownloadSection(false);
  };

  // Función para descargar todos los documentos
  const handleDownloadAll = () => {
    const formData = methods.getValues();
    if (formData.rolEnProyecto === "Director") {

      setTimeout(() => {
        generateMemorandum(formData);
      }, 1000);

      setTimeout(() => {
        generateAnexoA(formData);
      }, 2000);

      generateAnexoA2(formData);
    } else {
      generateAnexoA(formData);
      setTimeout(() => {
        generateAnexoA2(formData);
      }, 1000);
    }
    setShowDownloadSection(false);
  };

  // Función para limpiar el formulario y resetear datos
  const handleClearForm = () => {
    localStorage.removeItem("formData");
    setShowDownloadSection(false);
    window.location.reload();
  };

  return (
    <FormProvider {...methods}>
      <Container>
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
          {seleccionInscripcion === "SI" && <PaymentInfo />}
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