import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="container mt-4">
      <h2>Formularios Disponibles</h2>
      <div className="row">
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <Card.Title>Formulario F_DI_D001</Card.Title>
              {/* <Card.Img variant="top" src="form.png" /> */}
              <Card.Text>
                Este formulario está diseñado para la participación en eventos
                de investigación. Ingresar la información necesaria a fin de
                generar los Anexos 1 y 2, del procedimiento correspondiente a la
                solicitud de un docente titular a tiempo completo para
                participar en un evento científico en el exterior.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleCardClick("/Form1")}
              >
                Ir al formulario
              </Button>
            </Card.Body>
          </Card>
        </div>
        {/* Repite el bloque anterior para otros formularios */}
      </div>
    </div>
  );
}

export default Home;
