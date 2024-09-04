import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes del formulario
import PersonalDetails from "./ComponetOutsideProjects/PersonalDetails.js";
import EventDetails from "./ComponetOutsideProjects/EventDetails.js";
import PaymentDetail from "./ComponetOutsideProjects/PaymentDetail.js"
import ExpensesDeclaration from "./ComponetOutsideProjects/ExpensesDeclaration.js";
import BankAccount from "./ComponetOutsideProjects/BankAccount.js";
import Transportation from "./ComponetOutsideProjects/Transportation.js";
import InstitutionalServices from "./ComponetOutsideProjects/InstitutionalServices.js";
import ExteriorDetail from "./ComponetOutsideProjects/ExteriorDetail.js";

// Importación de las funciones para generar documentos

import{
  generateMemoOutsideProject1,
  generateMemoOutsideProject2,
  generateAnexoAOutsideProject,
  generateAnexo8OutsideProject,
} from"../utils/documentGenerator.js"

function EventParticipationOutsideProjectsForm() {
  // Estado para manejar la visibilidad de la sección de descargas
  const [showDownloadSection, setShowDownloadSection] = useState(false);

  // Configuración de react-hook-form con valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: JSON.parse(localStorage.getItem("formEventOutsideProject")) || {},
  });

  const { watch } = methods;

  // Efecto para sincronizar con localStorage y manejar la inicialización
  useEffect(() => {
    // Función para inicializar el estado desde localStorage
    const initializeFromLocalStorage = () => {
      const formData = JSON.parse(localStorage.getItem("formEventOutsideProject")) || {};
      // Aquí puedes agregar cualquier lógica adicional de inicialización
      
    };

    // Llamar a la inicialización al montar el componente
    initializeFromLocalStorage();

    const subscription = watch((data) => {
      localStorage.setItem("formEventOutsideProject", JSON.stringify(data));
    });

    // Limpieza al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch]);

  // Función que se ejecuta al enviar el formulario
  const onSubmitEventParticipationOutside = (data) => {
    console.log(data);
    setShowDownloadSection(true);
  };

  // Funciones para manejar la generación de documentos
  const handleGenerateMemo1 = () => {
    const formEventOutsideProject = methods.getValues();
    generateMemoOutsideProject1(formEventOutsideProject);
    setShowDownloadSection(false);
  };

  const handleGenerateMemo2 = () => {
    const formEventOutsideProject = methods.getValues();
    generateMemoOutsideProject2(formEventOutsideProject);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf = () => {
    const formEventOutsideProject = methods.getValues();
    generateAnexoAOutsideProject(formEventOutsideProject);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf2 = () => {
    const formEventOutsideProject = methods.getValues();
    generateAnexo8OutsideProject(formEventOutsideProject);
    setShowDownloadSection(false);
  };

  // Función para descargar todos los documentos
  
  const handleDownloadAll = () => {
    handleGenerateMemo1();
    handleGenerateMemo2();
    handleGeneratePdf();
    handleGeneratePdf2();
    setShowDownloadSection(false);
    };

  // Función para limpiar el formulario y resetear datos
  const handleClearForm = () => {
    localStorage.removeItem("formEventOutsideProject");
    setShowDownloadSection(false);
    window.location.reload();
  };

  return (
    <FormProvider {...methods}>
      <Container>
        {/* Título del formulario */}
        <h1 className="text-center my-4">
          Formulario para participacion en eventos fuera de proyectos
        </h1>
        <Form onSubmit={methods.handleSubmit(onSubmitEventParticipationOutside)}>
          {/* Formulario con diferentes secciones */}
          <PersonalDetails /> 
          <EventDetails />
          <Transportation />
          <PaymentDetail />
          <ExpensesDeclaration />
          <BankAccount />
          <InstitutionalServices/>
          <ExteriorDetail />


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
                  <div onClick={handleGenerateMemo1} className="download-item">
                    <img
                      src="IconWord.png"
                      alt="Word Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Memorando del Jefe del Departamento</span>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div onClick={handleGenerateMemo2} className="download-item">
                    <img
                      src="IconWord.png"
                      alt="Word Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Memorando del Profesor al Jefe </span>
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
                    <span>Descargar Anexo 8</span>
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
export default EventParticipationOutsideProjectsForm;
