import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes del formulario
import PersonalDetails from "./ComponentTripWithinProjects/PersonalDetails";
import ProjectDetails from "./ComponentTripWithinProjects/ProjectDetails";
import EventDetails from "./ComponentTripWithinProjects/EventDetails";
import Justification from "./ComponentTripWithinProjects/Justification";
import Transportation from "./ComponentTripWithinProjects/Transportation";
import ActivitySchedule from "./ComponentTripWithinProjects/ActivitySchedule";
import BankAccount from "./ComponentTripWithinProjects/BankAccount";
import InstitutionalServices from "./ComponentTripWithinProjects/InstitutionalServices";
import ExteriorDetail from "./ComponentTripWithinProjects/ExteriorDetail";

// Importación de las funciones para generar documentos
import {
  generateAnexoATripWithingProject,
  generateMemoTripWithinProjec1,
  generateMemoTripWithinProjec2
} from "../utils/documentGenerator";
import ExpensesDeclaration from "./ComponetWithinProjects/ExpensesDeclaration";

function TechnicalTripWithinProjectsForm() {
  // Estados para manejar datos y visibilidad de la UI
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const [diferenciaDiasViajeTecnicoDeProyectos, setDiferenciaDiasViajeTecnicoDeProyectos] = useState(0);

  // Configuración de react-hook-form con valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange", // El formulario se valida en cada cambio
    reValidateMode: "onChange", // Se revalida en cada cambio
    defaultValues:
      JSON.parse(localStorage.getItem("formTechnicalTripWithinProjects")) || {},
  });

  const { watch } = methods;

  // Efecto para sincronizar con localStorage y manejar cálculos de fechas
  useEffect(() => {
    // Función para calcular y actualizar la diferencia en días
    const calculateAndSetDiferenciaDiasViajeTecnico = (primeraFechaSalida, ultimaFechaLlegada) => {
      if (ultimaFechaLlegada && primeraFechaSalida) {
        const fechaInicio = new Date(primeraFechaSalida);
        const fechaFinal = new Date(ultimaFechaLlegada);
        const diferenciaDiasViajeTecnicoDeProyectos = Math.ceil((fechaFinal - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
  
        localStorage.setItem("diferenciaDiasViajeTecnicoDeProyectos", JSON.stringify({ diferencia: diferenciaDiasViajeTecnicoDeProyectos }));
        setDiferenciaDiasViajeTecnicoDeProyectos(setDiferenciaDiasViajeTecnicoDeProyectos);
      } else {
        localStorage.setItem("diferenciaDiasViajeTecnicoDeProyectos", JSON.stringify({ diferencia: 0 }));
        setDiferenciaDiasViajeTecnicoDeProyectos(0);
      }
    };
  
    // Función para inicializar el estado desde localStorage
    const initializeFromLocalStorage = () => {
      const formTechnicalTripWithinProjects = JSON.parse(localStorage.getItem("formTechnicalTripWithinProjects")) || {};
  
      // Calcular y actualizar diferencia en días entre las fechas seleccionadas
      const primeraFechaSalida = formTechnicalTripWithinProjects.transporteIda?.[0]?.fechaSalida || "";
      const ultimaFechaLlegada = formTechnicalTripWithinProjects.transporteRegreso?.[formTechnicalTripWithinProjects.transporteRegreso.length - 1]?.fechaLlegada || "";
      calculateAndSetDiferenciaDiasViajeTecnico(primeraFechaSalida, ultimaFechaLlegada);
    };
  
    // Llamar a la inicialización al montar el componente
    initializeFromLocalStorage();
  
    // Suscripción a los cambios en el formulario
    const subscription = watch((data) => {
      localStorage.setItem("formTechnicalTripWithinProjects", JSON.stringify(data));
  
      // Calcular y actualizar diferencia en días entre las fechas seleccionadas
      const primeraFechaSalida = data.transporteIda?.[0]?.fechaSalida || "";
      const ultimaFechaLlegada = data.transporteRegreso?.[data.transporteRegreso.length - 1]?.fechaLlegada || "";
      calculateAndSetDiferenciaDiasViajeTecnico(primeraFechaSalida, ultimaFechaLlegada);
    });
  
    // Limpieza al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch, setDiferenciaDiasViajeTecnicoDeProyectos]);

  // Función que se ejecuta cuando se envía el formulario
  const onSubmitTechnicalTrip = (data) => {
    console.log(data);
    setShowDownloadSection(true);
  };

  
  
  const handleGenerateDocx = () => {
    const formTripWothinProject = methods.getValues();  
    if (formTripWothinProject.rolEnProyecto==="Director") {
      generateMemoTripWithinProjec1(formTripWothinProject);
      setShowDownloadSection(false);
    }
    if (formTripWothinProject.rolEnProyecto==="Codirector" || formTripWothinProject.rolEnProyecto==="Colaborador") {
      generateMemoTripWithinProjec2(formTripWothinProject);
      setShowDownloadSection(false);
    }
  };
  
  const handleGeneratePdf = () => {
  const formTripWothinProject = methods.getValues();  
  generateAnexoATripWithingProject(formTripWothinProject);
  setShowDownloadSection(false);  
  };
  
  const handleGeneratePdf2 = () => {
    
  };
  
  const handleDownloadAll = () => {
    
  };
  // Función para limpiar el formulario y resetear datos
  const handleClearForm = () => {
    localStorage.removeItem("formTechnicalTripWithinProjects");
    localStorage.removeItem("diferenciaDiasViajeTecnicoDeProyectos");
    setDiferenciaDiasViajeTecnicoDeProyectos(0);
    window.location.reload();
  };
  
  return (
    <FormProvider {...methods}>
      <Container>
        <h1 className="text-center my-4">
          Formulario para participación en viajes técnicos dentro de proyectos
        </h1>
        {/* Formulario con diferentes secciones */}
        <Form onSubmit={methods.handleSubmit(onSubmitTechnicalTrip)}>
          <ProjectDetails />
          <PersonalDetails />
          <EventDetails />
          <Justification />
          <Transportation />
          <ActivitySchedule />
          <BankAccount />
          <InstitutionalServices />
          <ExteriorDetail/>

          {/* Botón para enviar el formulario */}
          <Row className="mt-4">
            <Col className="text-center">
              <Button id="btn_enviar" type="submit" variant="primary">
                Enviar
              </Button>
            </Col>
          </Row>

          {/* Sección de descargas que aparece después de enviar el formulario */}
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
                    <span>Descargar Anexo 2B</span>
                  </div>
                </Col>
              </Row>

              {/* Botón para descargar todos los documentos a la vez */}
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
              <Button type="button" onClick={handleClearForm} variant="danger">
                Limpiar Formulario
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </FormProvider>
  );
}

export default TechnicalTripWithinProjectsForm;