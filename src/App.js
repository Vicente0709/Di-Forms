import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Importación de componentes comunes
import Header from "./components/Header";
import Footer from "./components/Footer";

// Importación de las páginas de la aplicación
import Home from "./pages/Home";
import About from "./pages/About";
import EventParticipationWithinProjects from "./pages/EventParticipationWithinProjects";
import EventParticipationOutsideProjects from "./pages/EventParticipationOutsideProjects";
import TechnicalTripWithinProjects from "./pages/TechnicalTripWithinProjects";
import InscriptionPayment from "./pages/InscriptionPayment";
import NationalWithinProject from "./pages/NationalWithinProject";

// Importación del archivo CSS para los estilos de la aplicación
import "./App.css";

function App() {
  return (
    <Router>  {/* El componente Router de React Router que envuelve toda la aplicación, permitiendo la navegación entre diferentes rutas */}
      <div className="wrapper">
        {/* Componente de encabezado que se muestra en todas las páginas */}
        <Header />
        <div className="content">
            {/* Definición de rutas de la aplicación */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/EventParticipationWithinProjects" element={<EventParticipationWithinProjects />} />
            <Route path="/EventParticipationOutsideProjects" element={<EventParticipationOutsideProjects />} />
            <Route path="/TechnicalTripWithinProjects" element={<TechnicalTripWithinProjects />} />
            <Route path="/InscriptionPayment" element={<InscriptionPayment />} />
            <Route path="/NationalWithinProject" element={<NationalWithinProject />} />
          </Routes>
        </div>
        {/* Componente de pie de página que se muestra en todas las páginas */}
        <Footer />
      </div>
    </Router>
  );
}

export default App; // Exportación del componente App como el componente principal de la aplicación
