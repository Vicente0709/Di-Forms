import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FormCard from "../components/Card/FormCard"; // Ajusta la ruta de importación según sea necesario

function Home() {
  useEffect(() => {
    document.title = "Forms DI | Inicio";  // Título de la página de Acerca de
  }, []);
  
  return (
    <Container className="mt-4">
      <h2>Formularios Disponibles</h2>
      <Row className="d-flex flex-wrap">
        <Col md={4} className="d-flex">
          <FormCard
            title="Participación en eventos al exterior dentro de proyectos"
            description="Este formulario está diseñado para la participación en eventos de investigación dentro de proyectos. Ingrese la información necesaria a fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud de un docente titular a tiempo completo para participar en un evento científico en el exterior."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/ProjectInternationalEvents"
            ariaLabel="Ir al formulario de participación dentro de proyectos"
            documentDetails={[
              "Memorando solicitud para participar en evento académico",
              "Anexo A - Solicitud de viaticos EPN",
              "Anexo 2 A - Formulario para participacion en eventos dentro de proyectos",
            ]}
          />
        </Col>

        <Col md={4} className="d-flex">
          <FormCard
            title="Participación en eventos al exterior fuera de proyectos"
            description="Este formulario está diseñado para la participación en eventos de investigación fuera de proyectos. Ingrese la información necesaria a fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud de un docente titular a tiempo completo para participar en un evento científico en el exterior."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/ExternalInternationalEvents"
            ariaLabel="Ir al formulario de participación fuera de proyectos"
            documentDetails={[
              "Memorando del Jefe del Departamento al VIIV",
              "Memorando del Profesor al Jefe",
              "Anexo A - Solicitud de viaticos EPN",
              "Anexo 8 - Formulario para participacion en eventos fuera de proyectos"
            ]}
          />
        </Col>

        <Col md={4} className="d-flex">
          <FormCard
            title="Participación en Viaje Técnico al exterior Dentro de proyectos"
            description="Este formulario está diseñado para la participación de viajes técnicos Dentro de proyectos. Ingrese la información necesaria a fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud de un docente titular a tiempo completo."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/InternationalTechnicalTrips"
            ariaLabel="Ir al formulario de participación en viajes técnicos dentro de proyectos"
            documentDetails={[
              "Memorando solicitud para participacion en viaje técnico dentro de proyectos",
              "Anexo A - Solicitud de viaticos EPN",
              "Anejo 2B - Formulario para participacion en viaje técnico dentro de proyectos"
            ]}
          />
        </Col>

        <Col md={4} className="d-flex">
          <FormCard
            title="Pago de Inscripción dentro o fuera de proyectos"
            description="Este formulario está diseñado para el pago de inscripción dentro o fuera de proyectos con el fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/InscriptionPayment"
            ariaLabel="Ir al formulario de pago de inscripción dentro o fuera de proyectos"
            documentDetails={[
              "Memorando solicitud para pago de inscripción",
              "Anexo 5 - Formulario para pago de inscripción",
            ]}
          />
        </Col>

        <Col md={4} className="d-flex">
          <FormCard
            title="Participacion en Eventos Nacionales Dentro de Proyectos"
            description="Este formulario está diseñado para la participación en eventos de investigación dentro de proyectos. Ingrese la información necesaria a fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud de un docente titular a tiempo completo para participar en un evento científico."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/ProjectNationalEvents"
            ariaLabel="Ir al formulario de pago de inscripción dentro o fuera de proyectos"
            documentDetails={[
              "Memorando solicitud para participar en evento académico",
              "Anexo A - Solicitud de Viaticos EPN",
              "Anexo2_Formulario para salidas nacionales"
            ]}
          />
        </Col>

        <Col md={4} className="d-flex">
          <FormCard
            title="Participacion en Eventos Nacionales Fuera de Proyectos"
            description="Este formulario está diseñado para la participación en eventos de investigación dentro de proyectos. Ingrese la información necesaria a fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud de un docente titular a tiempo completo para participar en un evento científico."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/ExternalNationalEvents"
            ariaLabel="Ir al formulario para salidas nacionales fuera de proyectos"
            documentDetails={[
              "Documento 1: Descripción del evento",
              "Documento 2: Detalles del proyecto",
              "Documento 3: Información adicional"
            ]}
          />
        </Col>

        <Col md={4} className="d-flex">
          <FormCard
            title="Pago Publicaciones Dentro o Fuera de Proyecto"
            description="Este formulario está diseñado para el pago de publicaciones dentro o fuera de proyectos con el fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/PublicationsPayment"
            ariaLabel="Ir al formulario para salidas nacionales fuera de proyectos"
            documentDetails={[
              "Documento 1: Comprobante de pago",
              "Documento 2: Detalles del proyecto",
              "Documento 3: Información adicional"
            ]}
          />
        </Col>
        
        <Col md={4} className="d-flex">
          <FormCard
            title="Salidas de campo y de muestreo y/o viajes técnicos dentro de proyectos"
            description="Este formulario está diseñado para salidas nacionales fuera de proyectos con el fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/NationalSamplingTrips"
            ariaLabel="Ir al formulario para salidas nacionales fuera de proyectos"
            documentDetails={[
              "Documento 1: Descripción del viaje",
              "Documento 2: Detalles del proyecto",
              "Documento 3: Información adicional"
            ]}
          />
        </Col>

        <Col md={4} className="d-flex">
          <FormCard
            title="Informe de servicios institucionales"
            description="Este formulario está diseñado para realizar informe de servicios institucionales con el fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/InstitutionalServices"
            ariaLabel="Ir al formulario para informe de servicios institucionales"
            documentDetails={[
              "Documento 1: Descripción del servicio",
              "Documento 2: Detalles del proyecto",
              "Documento 3: Información adicional"
            ]}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
