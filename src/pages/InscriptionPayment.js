import React, { useEffect } from "react";
import InscriptionPaymentForm from "../components/InscriptionPaymentForm";

function InscriptionPayment() {
  useEffect(() => {
    document.title = "Forms DI | Pago de Inscripción"; // Título de la página de Pago de Inscripción
  }, []);

  return <InscriptionPaymentForm />;
}

export default InscriptionPayment;
