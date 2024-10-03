import React, {useEffect} from "react";
import { Container, Row, Col } from "react-bootstrap";
import FormCard from "../components/Card/FormCard.js";
import Label from "../components/Labels/Label";
import LabelTitle from "../components/Labels/LabelTitle";
import LabelText from "../components/Labels/LabelText";


function Home() {
  useEffect(() => {
    document.title = "Forms DI | Inicio";  // Título de la página de Acerca de
  }, []);
  
  return (
    <Container className="mt-4">
      <h2>Formularios Disponibles</h2>
      <Row>
        <Col md={4}>
          <FormCard
            title="Participación en eventos al exterior dentro de proyectos"
            description="Este formulario está diseñado para la participación en eventos de investigación dentro de proyectos. Ingrese la información necesaria a fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud de un docente titular a tiempo completo para participar en un evento científico en el exterior."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/ProjectInternationalEvents"
            ariaLabel="Ir al formulario de participación dentro de proyectos"
          />
        </Col>

        <Col md={4}>
          <FormCard
            title="Participación en eventos al exterior fuera de proyectos"
            description="Este formulario está diseñado para la participación en eventos de investigación fuera de proyectos. Ingrese la información necesaria a fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud de un docente titular a tiempo completo para participar en un evento científico en el exterior."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/ExternalInternationalEvents"
            ariaLabel="Ir al formulario de participación fuera de proyectos"
          />
        </Col>

        <Col md={4}>
          <FormCard
            title="Participación en Viaje Técnico al exterior  Dentro de proyectos"
            description="Este formulario está diseñado para la participación de viajes técnicos Dentro de proyectos. Ingrese la información necesaria a fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud de un docente titular a tiempo completo para participar en un evento científico en el exterior."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/InternationalTechnicalTrips"
            ariaLabel="Ir al formulario de participación en viajes técnicos dentro de proyectos"
          />
        </Col>

        <Col md={4}>
          <FormCard
            title="Pago de Inscripción dentro o fuera de proyectos"
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
            title="Participacion en Eventos Nacionales Dentro de Proyectos"
            description="Este Formualrio esta diseñadao para la participacion en eventos nacionales dentro de proyectos."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/ProjectNationalEvents"
            ariaLabel="Ir al formulario de pago de inscripción dentro o fuera de proyectos"
          />
        </Col>
        <Col md={4}>
          <FormCard
            title="Participacion en Eventos Nacionales Fuera de Proyectos"
            description="Este formulario está diseñado para salidas nacionales fuera de proyectos con el fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/ExternalNationalEvents"
            ariaLabel="Ir al formulario para salidas nacionales fuera de proyectos"
          />
        </Col>
        <Col md={4}>
          <FormCard
            title="Pago Publicaciones Dentro o Fuera de Proyecto"
            description="Este formulario está diseñado para el pago de publicaciones dentro o fuera de proyectos con el fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/PublicationsPayment"
            ariaLabel="Ir al formulario para salidas nacionales fuera de proyectos"
          />
        </Col>
        
        <Col md={4}>
          <FormCard
            title="Salidas de campo y de muestreo y/o viajes técnicos dentro de proyectos"
            description="Este formulario está diseñado para salidas nacionales fuera de proyectos con el fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/NationalSamplingTrips"
            ariaLabel="Ir al formulario para salidas nacionales fuera de proyectos"
          />
        </Col>


        <Col md={4}>
          <FormCard
            title="Informe de servicios institucionales"
            description="Este formulario está diseñado para realizar informe de servicios institucionales con el fin de generar los anexos requeridos para el procedimiento correspondiente a la solicitud."
            imageSrc="form.png"
            altText="Formulario"
            buttonText="Ir al formulario"
            path="/InstitutionalServices"
            ariaLabel="Ir al formulario para informe de servicios institucionales"
          />
        </Col>

      </Row>





    </Container>
  );
}

export default Home;
