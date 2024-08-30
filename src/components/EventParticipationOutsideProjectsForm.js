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
} from"../utils/documentGenerator.js"

function EventParticipationOutsideProjectsForm() {
  // Estado para controlar la visibilidad de la sección de descargas
  const [showDownloadSection, setShowDownloadSection] = useState(false);

  const methods = useForm({
    mode: "onChange", // Actualización del formulario en cada cambio
    reValidateMode: "onChange", // Revalidación del formulario en cada cambio
    defaultValues:
      JSON.parse(localStorage.getItem("formEventOutsideProject")) || {}, // Valores predeterminados del formulario
  });

  const { watch } = methods;

  // useEffect para observar los cambios en el formulario
  useEffect(() => {
    const subscription = watch((data) => {
      // Guardar los datos del formulario en localStorage
      localStorage.setItem("formEventOutsideProject", JSON.stringify(data));
    });
    // Limpieza del efecto al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch]);

  // Función que se ejecuta al enviar el formulario
  const onSubmitEventParticipationOutside = (data) => {
    console.log(data);
    setShowDownloadSection(true); // Mostrar la sección de descargas
  };

  // Función para generar un documento DOCX
  const handleGenerateMemo1 = () => {
    const formEventOutsideProject = methods.getValues();
    generateMemoOutsideProject1(formEventOutsideProject);
    setShowDownloadSection(false); // Ocultar la sección de descargas
  };


  const handleGenerateMemo2 = () => {
    const formEventOutsideProject = methods.getValues();
    generateMemoOutsideProject2(formEventOutsideProject);
    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  
  // Función para generar el Anexo A en formato PDF
  const handleGeneratePdf = () => {
    const formEventOutsideProject = methods.getValues();
    generateAnexoAOutsideProject(formEventOutsideProject);
    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  // Función para generar el Anexo A2 en formato PDF
  const handleGeneratePdf2 = () => {
    // const formEventOutsideProject = methods.getValues();

    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  // Función para descargar todos los documentos
  const handleDownloadAll = () => {
    // const formEventOutsideProject = methods.getValues();

    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  // Función para limpiar el formulario
  const handleClearForm = () => {
    localStorage.removeItem("formEventOutsideProject"); // Eliminar los datos del formulario de localStorage
    setShowDownloadSection(false); // Ocultar la sección de descargas
    window.location.reload(); // Recargar la página para resetear el formulario
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
