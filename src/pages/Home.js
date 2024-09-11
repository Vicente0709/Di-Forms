import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import FormCard from "../components/Card/FormCard.js";

function Home() {
  return (
    <Container className="mt-4">
      <h2>Formularios Disponibles</h2>
      <Row>
        <Col md={4}>
          <FormCard
            title="Formulario : Participación en eventos al exterior dentro de proyectos"
            description="Este formulario está diseñado para la participación en eventos de investigación dentro de proyectos. Ingrese la información necesaria a fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud de un docente titular a tiempo completo para participar en un evento científico en el exterior."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/EventParticipationWithinProjects"
            ariaLabel="Ir al formulario de participación dentro de proyectos"
          />
        </Col>

        <Col md={4}>
          <FormCard
            title="Formulario : Participación en eventos al exterior fuera de proyectos"
            description="Este formulario está diseñado para la participación en eventos de investigación fuera de proyectos. Ingrese la información necesaria a fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud de un docente titular a tiempo completo para participar en un evento científico en el exterior."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/EventParticipationOutsideProjects"
            ariaLabel="Ir al formulario de participación fuera de proyectos"
          />
        </Col>

        <Col md={4}>
          <FormCard
            title="Formulario : Participación en Viaje Técnico al exterior  Dentro de proyectos"
            description="Este formulario está diseñado para la participación de viajes técnicos Dentro de proyectos. Ingrese la información necesaria a fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud de un docente titular a tiempo completo para participar en un evento científico en el exterior."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/TechnicalTripWithinProjects"
            ariaLabel="Ir al formulario de participación en viajes técnicos dentro de proyectos"
          />
        </Col>

        <Col md={4}>
          <FormCard
            title="Formulario : Pago de Inscripción dentro o fuera de proyectos"
            description="Este formulario está diseñado para el pago de inscripción dentro o fuera de proyectos con el fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/InscriptionPayment"
            ariaLabel="Ir al formulario de pago de inscripción dentro o fuera de proyectos"
          />
        </Col>

        <Col md={4}>
          <FormCard
            title="Formulario : Salidas Nacionales Fuera de Proyectos"
            description="Este formulario está diseñado para salidas nacionales fuera de proyectos con el fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/NationalOutsideProject"
            ariaLabel="Ir al formulario para salidas nacionales fuera de proyectos"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
