import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes del formulario
import PersonalDetails from "./ComponentTripWithinProjects/PersonalDetails";
import ProjectDetails from "./ComponentTripWithinProjects/ProjectDetails";
import EventDetails from "./ComponentTripWithinProjects/EventDetails";

// Importación de las funciones para generar documentos
function TechnicalTripWithinProjectsForm() {
  // Estado para controlar la visibilidad de la sección de descargas
  const [showDownloadSection, setShowDownloadSection] = useState(false);

  const methods = useForm({
    mode: "onChange", // Actualización del formulario en cada cambio
    reValidateMode: "onChange", // Revalidación del formulario en cada cambio
    defaultValues:
      JSON.parse(localStorage.getItem("formTechnicalTripWithinProjectsForm")) || {}, // Valores predeterminados del formulario
  });

  const { watch } = methods;

  // useEffect para observar los cambios en el formulario
  useEffect(() => {
    const subscription = watch((data) => {
      // Guardar los datos del formulario en localStorage
      localStorage.setItem("formTechnicalTripWithinProjectsForm", JSON.stringify(data));
    });
    // Limpieza del efecto al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch]);

  // Función que se ejecuta al enviar el formulario
  const onSubmitTechnicalTrip = (data) => {
    console.log(data);
    setShowDownloadSection(true); // Mostrar la sección de descargas
  };

  // Función para generar un documento DOCX
  const handleGenerateDocx = () => {
    // const formTechnicalTripWithinProjectsForm = methods.getValues();
    // Lógica para generar el documento DOCX con los datos formTechnicalTripWithinProjectsForm
    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  // Función para generar el Anexo A en formato PDF
  const handleGeneratePdf = () => {
    // const formTechnicalTripWithinProjectsForm = methods.getValues();
    // Lógica para generar el Anexo A en PDF con los datos formTechnicalTripWithinProjectsForm
    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  // Función para generar el Anexo A2 en formato PDF
  const handleGeneratePdf2 = () => {
    // const formTechnicalTripWithinProjectsForm = methods.getValues();
    // Lógica para generar el Anexo A2 en PDF con los datos formTechnicalTripWithinProjectsForm
    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  // Función para descargar todos los documentos
  const handleDownloadAll = () => {
    // const formTechnicalTripWithinProjectsForm = methods.getValues();
    // Lógica para generar y descargar todos los documentos
    setShowDownloadSection(false); // Ocultar la sección de descargas
  };

  // Función para limpiar el formulario
  const handleClearForm = () => {
    localStorage.removeItem("formTechnicalTripWithinProjectsForm"); // Eliminar los datos del formulario de localStorage
    setShowDownloadSection(false); // Ocultar la sección de descargas
    window.location.reload(); // Recargar la página para resetear el formulario
  };

  return (
    <FormProvider {...methods}>
      <Container>
        {/* Título del formulario */}
        <h1 className="text-center my-4">
          Formulario para participación en viajes técnicos dentro de proyectos
        </h1>
        <Form onSubmit={methods.handleSubmit(onSubmitTechnicalTrip)}>
          {/* Componentes específicos del formulario */}
          <PersonalDetails /> 
          <ProjectDetails />
          <EventDetails />
          
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
