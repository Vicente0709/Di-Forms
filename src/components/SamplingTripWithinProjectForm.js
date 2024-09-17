import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes Props
import Label from "./Labels/Label";
import LabelTitle from "./Labels/LabelTitle";
import LabelText from "./Labels/LabelText";
import InputSelect from "./Inputs/InputSelect";
import InputText from "./Inputs/InputText";
import InputTextArea from "./Inputs/InputTextArea";
import InputDate from "./Inputs/InputDate";
import RadioGroup from "./Inputs/RadioGroup";
import ActionButton from "./Buttons/ActionButton";
import DownloadButton from "./Buttons/DownloadButton";

// Importación de los componentes del formulario

// Importación de las funciones para generar documentos
import { generateAnexo7WithinProject } from "../utils/documentGeneratorNational";

function SamplingTripWithinProjectForm() {
  // Configuración del formulario con react-hook-form y valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues:
      JSON.parse(localStorage.getItem("formSamplingTripWithinProject")) || {},
  });

  const [showDownloadSection, setShowDownloadSection] = useState(false);

  const {
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = methods;

  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000;
  const adjustedNow = new Date(now.getTime() - localOffset)
    .toISOString()
    .split("T")[0];

  // Efecto para sincronizar con localStorage y manejar cálculos de fechas
  useEffect(() => {
    // Función para inicializar los valores desde localStorage
    const initializeFromLocalStorage = () => {
      const formSamplingTripWithinProject =
        JSON.parse(localStorage.getItem("formSamplingTripWithinProject")) || {};
      reset(formSamplingTripWithinProject);
    };
    initializeFromLocalStorage();
    // Suscribirse a los cambios en el formulario para guardar en localStorage
    const subscription = watch((data) => {
      localStorage.setItem(
        "formSamplingTripWithinProject",
        JSON.stringify(data)
      );
    });
    // Limpiar la suscripción al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch, reset]);
  // A partir de aqui los handleButtons
  const handleGeneratePdf2 = () => {
    const data = {
      projectCode: "PRJ123",
      projectTitle: "Estudio de Biodiversidad en Áreas Protegidas",
      department: "Departamento de Ciencias Ambientales",
      personnelData: [
        { name: "Juan Pérez", role: "Investigador Principal" },
        { name: "María López", role: "Asistente de Investigación" },
        { name: "Carlos Méndez", role: "Coordinador de Campo" },
        { name: "Ana García", role: "Especialista en Fauna" },
        { name: "Pedro Rodríguez", role: "Técnico de Laboratorio" },
        { name: "María López", role: "Asistente de Investigación" },
        { name: "Carlos Méndez", role: "Coordinador de Campo" },
        { name: "Ana García", role: "Especialista en Fauna" },
        { name: "Pedro Rodríguez", role: "Técnico de Laboratorio" },
        { name: "María López", role: "Asistente de Investigación" },
        { name: "Carlos Méndez", role: "Coordinador de Campo" },
        { name: "Ana García", role: "Especialista en Fauna" },
        { name: "Pedro Rodríguez", role: "Técnico de Laboratorio" },
      ],
      destination: "Parque Nacional Yasuní", // Lugar de movilización
      date: {
        start: "01/11/2024", // Fecha de inicio
        end: "10/11/2024", // Fecha de fin
      },
      activities: [
        { date: "01/11/2024", name: "Recolección de muestras de flora " },
        { date: "02/11/2024", name: "Estudio de fauna en el sector norte" },
        { date: "03/11/2024", name: "Análisis de suelos y agua" },
        {
          date: "04/11/2024",
          name: "Fotografías aéreas de la zona de estudio",
        },
      ],
    };

    generateAnexo7WithinProject(data);
  };
  // A partir de aqui los visualizadores de las varibales (watch)

  // Manejadores de estado para showSections
  //ejm: const [showInputDirector, setShowInputDirector] = useState(false);

  //aqui el use efect donde van todo a el control de las validaciones entre los imputs
  useEffect(() => {
    //aqui lo que se vaya a valdiad y demas cosas
    //constantes para opciones usados en inputsSelect, RadioGopus etc
    //ejemplo
    //   if (rolEnProyecto === "Codirector" || rolEnProyecto === "Colaborador") {
    //     setShowInputDirector(true);
    //   } else {
    //     setShowInputDirector(false);
    //     setValue("nombreDirector", "");
    //   }
  }, [setValue, clearErrors]);

  return (
    <FormProvider {...methods}>
      <Container>
        <h1 className="text-center my-4">
          Formulario para participación en viajes técnicos dentro de proyectos
        </h1>
        <Form onSubmit={methods.handleSubmit()}>
          <div className="form-container"></div>

          <DownloadButton
            onClick={handleGeneratePdf2}
            icon="IconPdf.png"
            altText="PDF Icon"
            label="Descargar Anexo 7"
          />
        </Form>
      </Container>
    </FormProvider>
  );
}

export default SamplingTripWithinProjectForm;
