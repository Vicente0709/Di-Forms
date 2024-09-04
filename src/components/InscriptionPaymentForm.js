import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes del formulario
import PersonalDetail from "./ComponentInscriptionPayment/PersonalDetail.js";
import EventDetails from "./ComponentInscriptionPayment/EventDetails.js";
import PaymentDetail from "./ComponentInscriptionPayment/PaymentDetail.js";
import DocumentationDetail from "./ComponentInscriptionPayment/DocumentationDetail.js";
// Importación de las funciones para generar documentos

import{
  generateMemoInscriptionPaymentOutProyect1,
  generateMemoInscriptionPaymentt2,
  generateAnexoAOutsideProject,
  generateAnexo5InscriptionPayment,
} from"../utils/documentGenerator.js"


function InscriptionPaymentForm() {
  // Estado para manejar la visibilidad de la sección de descargas
  const [showDownloadSection, setShowDownloadSection] = useState(false);
 
  // Configuración de react-hook-form con valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: JSON.parse(localStorage.getItem("formInscriptionPayment")) || {},
  });

  const { watch, setValue } = methods;

  
  // Efecto para sincronizar con localStorage y manejar la inicialización
  useEffect(() => {
    // Función para inicializar el estado desde localStorage
    const initializeFromLocalStorage = () => {
      const formData = JSON.parse(localStorage.getItem("formInscriptionPayment")) || {};
      // Aquí puedes agregar cualquier lógica adicional de inicialización
      
    };
    
    // Llamar a la inicialización al montar el componente
    initializeFromLocalStorage();

    const subscription = watch((data) => {
      localStorage.setItem("formInscriptionPayment", JSON.stringify(data));
    });

    // Limpieza al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch]);

  
  // Función que se ejecuta al enviar el formulario
  const onSubmitInscriptionPayment = (data) => {
    console.log(data);
    setShowDownloadSection(true);
  };

  // Funciones para manejar la generación de documentos


  const handleGenerateMemo1 = () => {
    const formInscriptionPayment = methods.getValues();
    generateMemoInscriptionPaymentOutProyect1(formInscriptionPayment);
    setShowDownloadSection(false);
  };

  const handleGenerateMemo2 = () => {
    /*const formInscriptionPayment = methods.getValues();
    generateMemoInscriptionPayment2(formInscriptionPayment);
    setShowDownloadSection(false);*/
  };

  const handleGeneratePdf = () => {
   /* const formEventOutsideProject = methods.getValues();
    generateAnexoAOutsideProject(formEventOutsideProject);
    setShowDownloadSection(false);*/
  };

  const handleGeneratePdf2 = () => {
   /* const formInscriptionPayment = methods.getValues();
    generateAnexo5InscriptionPayment(formInscriptionPayment);
    setShowDownloadSection(false);*/
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
    localStorage.removeItem("formInscriptionPayment");
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
        <Form onSubmit={methods.handleSubmit(onSubmitInscriptionPayment)}>
          {/* Formulario con diferentes secciones */}
          <PersonalDetail /> 
          <EventDetails /> 
          <PaymentDetail />
          <DocumentationDetail />
         
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
                    <span>Descargar Memorando Pago de Inscripcion</span>
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
export default InscriptionPaymentForm;
