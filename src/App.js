import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import ReactGA from 'react-ga4';

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
import NationalOutsideProject from "./pages/NationalOutsideProject";
import PublicationsPayment from "./pages/PublicationsPayment";
import SamplingTripWithinProject from "./pages/SamplingTripWithinProject";
import InstitutionalServices from "./pages/InstitutionalServices";
// Importación del archivo CSS para los estilos de la aplicación
import "./App.css";

ReactGA.initialize([
  { trackingId: 'G-HP0R3K8KHN' },   // ID 1 de Google Analytics Personal
  { trackingId: 'G-95G26Q6TRS' },   // ID 2 de Google Analytics DI
]);
// Componente principal que usa el hook useLocation
function MainApp() {
  const location = useLocation(); // Hook para detectar cambios en la ruta

  useEffect(() => {
    // Datos para el evento de pageview
    const pageViewData = {
      hitType: 'pageview',
      page: location.pathname + location.search,
      title: document.title || 'Página sin título',
    };
    
    // Envía la vista de página a Google Analytics
    ReactGA.send(pageViewData);
  }, [location]); // Se ejecuta cada vez que cambie la ruta

  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/EventParticipationWithinProjects" element={<EventParticipationWithinProjects />} />
          <Route path="/EventParticipationOutsideProjects" element={<EventParticipationOutsideProjects />} />
          <Route path="/TechnicalTripWithinProjects" element={<TechnicalTripWithinProjects />} />
          <Route path="/InscriptionPayment" element={<InscriptionPayment />} />
          <Route path="/NationalWithinProject" element={<NationalWithinProject />} />
          <Route path="/NationalOutsideProject" element={<NationalOutsideProject />} />
          <Route path="/PublicationsPayment" element={<PublicationsPayment />} />
          <Route path="/SamplingTripWithinProject" element={<SamplingTripWithinProject />} />
          <Route path="/InstitutionalServices" element={<InstitutionalServices />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

// Componente App donde se define Router
function App() {
  return (
    <Router>  {/* Router envuelve todo el contenido de la aplicación */}
      <MainApp />  {/* Este es el componente donde se usa useLocation */}
    </Router>
  );
}

export default App;
