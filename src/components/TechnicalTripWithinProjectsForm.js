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

function TechnicalTripWithinProjectsForm() {
  // Estado para almacenar la diferencia en días entre la primera fecha de salida y la última fecha de llegada
  const [diferenciaDiasViajeTecnicoDeProyectos, setDiferenciaEnDias] = useState(0);

  // Inicialización de react-hook-form con configuración personalizada
  // `defaultValues` se obtienen de localStorage si están disponibles, de lo contrario, se establece un objeto vacío
  const methods = useForm({
    mode: "onChange", // El formulario se valida en cada cambio
    reValidateMode: "onChange", // Se revalida en cada cambio
    defaultValues:
      JSON.parse(localStorage.getItem("formTechnicalTripWithinProjects")) || {},
  });

  // Desestructuramos `watch` de `methods` para observar los cambios en los datos del formulario
  const { watch } = methods;

  // useEffect para observar cambios en el formulario y actualizar tanto localStorage como el estado `diferenciaDiasViajeTecnicoDeProyectos`
  useEffect(() => {
    const subscription = watch((dataTripEventWithinProjects) => {
      // Guardar los datos del formulario en localStorage
      localStorage.setItem(
        "formTechnicalTripWithinProjects",
        JSON.stringify(dataTripEventWithinProjects)
      );

      // Obtener la última fecha de llegada y la primera fecha de salida del transporte
      const ultimaFechaLlegada =
        dataTripEventWithinProjects.transporte.length > 0
          ? dataTripEventWithinProjects.transporte[
              dataTripEventWithinProjects.transporte.length - 1
            ]?.fechaLlegada
          : "";
      const primeraFechaSalida =
        dataTripEventWithinProjects.transporte[0]?.fechaSalida;

      // Si ambas fechas existen, calculamos la diferencia en días
      if (ultimaFechaLlegada && primeraFechaSalida) {
        // Convertir las fechas en objetos Date
        const fechaInicio = new Date(primeraFechaSalida);
        const fechaFinal = new Date(ultimaFechaLlegada);

        // Calcular la diferencia en milisegundos y luego convertirla a días
        const diferenciaEnMilisegundos = fechaFinal - fechaInicio;
        const diferenciaDias = Math.ceil(
          diferenciaEnMilisegundos / (1000 * 60 * 60 * 24)
        ) + 1;

        // Guardar la diferencia en días en localStorage y actualizar el estado
        localStorage.setItem(
          "diferenciaDiasViajeTecnicoDeProyectos",
          JSON.stringify({ diferencia: diferenciaDias })
        );
        setDiferenciaEnDias(diferenciaDias); // Actualizar el estado con la diferencia calculada
      } else {
        // Si no hay fechas válidas, establecer la diferencia en días a 0
        localStorage.setItem(
          "diferenciaDiasViajeTecnicoDeProyectos",
          JSON.stringify({ diferencia: 0 })
        );
        setDiferenciaEnDias(0); // Establecer la diferencia en 0 si no hay fechas válidas
      }
    });

    // Limpieza del efecto al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch, setDiferenciaEnDias]);

  // Función que se ejecuta cuando se envía el formulario
  const onSubmitTechnicalTrip = (data) => {
    console.log(data); // Aquí debería contener todos los campos registrados en los componentes
    setShowDownloadSection(true); // Mostrar la sección de descargas
  };

  // Función para limpiar el formulario y reiniciar el estado
  const handleClearForm = () => {
    localStorage.removeItem("formTechnicalTripWithinProjects");
    localStorage.removeItem("diferenciaDiasViajeTecnicoDeProyectos");
    setDiferenciaEnDias(0); // Restablecer el estado a 0
    window.location.reload(); // Recargar la página para reiniciar el formulario
  };

  // Función para generar un documento Word (lógica no implementada aquí)
  const handleGenerateDocx = () => {
    // Lógica para generar documento Word
  };

  // Función para generar un PDF del Anexo A (lógica no implementada aquí)
  const handleGeneratePdf = () => {
    // Lógica para generar PDF Anexo A
  };

  // Función para generar un PDF del Anexo A2 (lógica no implementada aquí)
  const handleGeneratePdf2 = () => {
    // Lógica para generar PDF Anexo A2
  };

  // Función para descargar todos los documentos (lógica no implementada aquí)
  const handleDownloadAll = () => {
    // Lógica para descargar todos los documentos
  };

  // Estado para controlar la visibilidad de la sección de descargas
  const [showDownloadSection, setShowDownloadSection] = useState(false);

  return (
    <FormProvider {...methods}>
      <Container>
        <h1 className="text-center my-4">
          Formulario para participación en viajes técnicos dentro de proyectos
        </h1>
        <Form onSubmit={methods.handleSubmit(onSubmitTechnicalTrip)}>
          {/* Incluir los componentes del formulario que se manejarán */}
          <ProjectDetails />
          <PersonalDetails />
          <EventDetails />
          <Justification />
          <Transportation />
          <ActivitySchedule />
          <BankAccount />

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
                    <span>Descargar Anexo A2</span>
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