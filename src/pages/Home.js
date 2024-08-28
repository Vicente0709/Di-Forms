import React from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container className="mt-4">
      <h2>Formularios Disponibles</h2>
      <Row>
        
        {/* Formulario dentro de proyectos */}
        <Col md={4}>
          <Card border="primary" style={{ width: "100%" }}>
            <Card.Body>
              <Card.Title>
                Formulario : Participación en eventos{" "}
                <span className="bolded">dentro de proyectos</span>
              </Card.Title>
              <Card.Img
                variant="top"
                src="form.png"
                alt="Formulario"
                style={{ width: "100%", height: "150px", objectFit: "contain" }}
              />
              <Card.Text>
                Este formulario está diseñado para la participación en eventos
                de investigación <span className="bolded">dentro de proyectos</span>. Ingrese la
                información necesaria a fin de generar los anexos requeridos
                para el procedimiento correspondiente a la solicitud de un
                docente titular a tiempo completo para participar en un evento
                científico en el exterior.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleCardClick("/EventParticipationWithinProjects")}
                aria-label="Ir al formulario de participación dentro de proyectos"
              >
                Ir al formulario
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Formulario fuera de proyectos */}
        <Col md={4}>
          <Card border="primary" style={{ width: "100%" }}>
            <Card.Body>
              <Card.Title>
                Formulario : Participación en eventos{" "}
                <span className="bolded">fuera de proyectos</span>
              </Card.Title>
              <Card.Img
                variant="top"
                src="form.png"
                alt="Formulario"
                style={{ width: "100%", height: "150px", objectFit: "contain" }}
              />
              <Card.Text>
                Este formulario está diseñado para la participación en eventos
                de investigación <span className="bolded">fuera de proyectos</span>. Ingrese la
                información necesaria a fin de generar los anexos requeridos
                para el procedimiento correspondiente a la solicitud de un
                docente titular a tiempo completo para participar en un evento
                científico en el exterior.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleCardClick("/EventParticipationOutsideProjects")}
                aria-label="Ir al formulario de participación fuera de proyectos"
              >
                Ir al formulario
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Formulario apra salidas al exterior */}
        <Col md={4}>
          <Card border="primary" style={{ width: "100%" }}>
            <Card.Body>
              <Card.Title>
                Formulario : Participación en Viaje Tecnico{" "}
                <span className="bolded">Dentro de proyectos</span>
              </Card.Title>
              <Card.Img
                variant="top"
                src="form.png"
                alt="Formulario"
                style={{ width: "100%", height: "150px", objectFit: "contain" }}
              />
              <Card.Text>
                Este formulario está diseñado para la participación de viajes tecnicos
                <span className="bolded"> Dentro de proyectos</span>. Ingrese la
                información necesaria a fin de generar los anexos requeridos
                para el procedimiento correspondiente a la solicitud de un
                docente titular a tiempo completo para participar en un evento
                científico en el exterior.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleCardClick("/TechnicalTripWithinProjects")}
                aria-label="Ir al formulario de participación en viajes tecnico dentro de proyectos"
              >
                Ir al formulario
              </Button>
            </Card.Body>
          </Card>
        </Col>
        {/* Repite el bloque Col para otros formularios */}
      </Row>
    </Container>
  );
}

export default Home;
