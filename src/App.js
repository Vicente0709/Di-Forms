import React, { useEffect }  from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

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

// Importación del archivo CSS para los estilos de la aplicación
import "./App.css";

// Hook personalizado para enviar datos a Google Analytics en cada cambio de ruta
function useGoogleAnalytics() {
  const location = useLocation();  // Obtenemos la ubicación actual (ruta)

  useEffect(() => {
    // Verificar si gtag.js está disponible
    if (window.gtag) {
      window.gtag('config', 'G-95G26Q6TRS', {
        page_path: location.pathname + location.search, // Enviamos la ruta actual
      });
    }
  }, [location]);  // Este efecto se ejecuta cada vez que cambia la ruta
}


function App() {
  return (
    <Router>  {/* El componente Router de React Router que envuelve toda la aplicación, permitiendo la navegación entre diferentes rutas */}
      <div className="wrapper">
        <GoogleAnalyticsWrapper /> {/* Llama a Google Analytics dentro del Router */}
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
            <Route path ="/NationalOutsideProject" element={<NationalOutsideProject/>}/>
            <Route path="/PublicationsPayment" element={<PublicationsPayment/>}/>
          </Routes>
        </div>
        {/* Componente de pie de página que se muestra en todas las páginas */}
        <Footer />
      </div>
    </Router>
  );
}
// Componente que envuelve el hook de Google Analytics
function GoogleAnalyticsWrapper() {
  useGoogleAnalytics();
  return null;
}
export default App; // Exportación del componente App como el componente principal de la aplicación
