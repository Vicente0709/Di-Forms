import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";

// Componente Header que representa la barra de navegación superior
function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg"> {/* El componente Navbar de React-Bootstrap para crear una barra de navegación */}
        {/* Contenedor para centrar y alinear el contenido dentro de la barra de navegación */}
      <Container>
        {/* Marca de la barra de navegación que incluye un logo y un texto */}
        <Navbar.Brand href="/">
          <img
            src="logo.png"
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
            style={{ marginRight: "10px" }}
          />
          Dirección de Investigación
        </Navbar.Brand>

        {/* Toggle para colapsar la barra de navegación en dispositivos móviles */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Contenedor para agrupar los elementos de navegación */}
        <Navbar.Collapse id="basic-navbar-nav">

          {/* Clase ml-auto para alinear los elementos de navegación a la derecha */}
          <Nav className="ml-auto">

            <Nav.Link as={NavLink} to="/" className={({ isActive }) => (isActive ? "active" : "")} > Home </Nav.Link>
            <Nav.Link as={NavLink} to="/about" className={({ isActive }) => (isActive ? "active" : "")} > About </Nav.Link>

            {/* Dropdown (menú desplegable) para las opciones de formularios */}
            <NavDropdown title="Formularios" id="basic-nav-dropdown">

              <NavDropdown.Item as={NavLink} to="/EventParticipationWithinProjects" 
              className={({ isActive }) => (isActive ? "active" : "")} > 
              Participación en Eventos Dentro de Proyectos
              </NavDropdown.Item>

              <NavDropdown.Item as={NavLink} to="/EventParticipationOutsideProjects"
                className={({ isActive }) => (isActive ? "active" : "")} >
                Participación en Eventos Fuera de Proyectos
              </NavDropdown.Item>
              
              <NavDropdown.Item as={NavLink} to="/TechnicalTripWithinProjects"
                className={({ isActive }) => (isActive ? "active" : "")} >
                Participación en Viajes Técnicos Dentro de Proyectos
              </NavDropdown.Item>

              <NavDropdown.Item as={NavLink} to="/InscriptionPayment"
                className={({ isActive }) => (isActive ? "active" : "")} >
                Pago de Inscripción dentro o fuera de proyectos
              </NavDropdown.Item>
              
              <NavDropdown.Item as={NavLink} to="/NationalOutsideProject"
                className={({ isActive }) => (isActive ? "active" : "")} >
                Salidas Nacionales Fuera de Proyectos
              </NavDropdown.Item>
              
            </NavDropdown>
          </Nav>

        </Navbar.Collapse>

      </Container>
      
    </Navbar>
  );
}
export default Header;
