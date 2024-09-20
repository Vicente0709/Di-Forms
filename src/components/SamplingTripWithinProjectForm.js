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
  const formStorageKey = "formSamplingTripWithinProject"; // Clave para almacenar el formulario en localStorage
  const formData = JSON.parse(localStorage.getItem(formStorageKey)) || {}; // Datos del formulario desde localStorage

  // Configuración del formulario con react-hook-form y valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: formData,
  });

  const { watch, setValue, reset, clearErrors, formState: { errors },} = methods;

  // Efecto para sincronizar con localStorage y manejar cálculos de fechas
  useEffect(() => {
    reset(formData); // Rellenar el formulario con los datos almacenados

    // Suscribirse a los cambios en el formulario para guardar en localStorage
    const subscription = watch((data) => {
      localStorage.setItem(formStorageKey, JSON.stringify(data));
    });

    // Limpiar la suscripción al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch, reset]);

  // Función para descargar el formulario como JSON
  const handleDownloadJson = () => {
    const data = methods.getValues(); // Obtiene los datos actuales del formulario
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Viajes de Muestreo Dentro de Proyectos.json"; // Nombre del archivo
    link.click();
  };

  // Función para cargar un archivo JSON y rellenar el formulario
  const handleUploadJson = (event) => {
    console.log("Inicia el proceso de carga del archivo JSON");

    const file = event.target.files[0];  // Verificar si hay archivo
    if (file) {
      console.log("Archivo JSON seleccionado:", file.name);

      const reader = new FileReader();  // Inicializa el FileReader para leer el archivo
      reader.onload = (e) => {
        console.log("El archivo JSON ha sido leído exitosamente");

        try {
          const json = JSON.parse(e.target.result);  // Parsear el archivo JSON
          console.log("Archivo JSON parseado correctamente:", json);

          // Reset del formulario con los datos del JSON
          reset(json, {
            keepErrors: false,
            keepDirty: false,
            keepValues: false,
            keepTouched: false,
            keepIsSubmitted: false,
          });

          console.log("Formulario reseteado con los valores del archivo JSON");

          // Actualizar localStorage con los datos cargados
          localStorage.setItem(formStorageKey, JSON.stringify(json));
          console.log("Datos almacenados en localStorage");
        } catch (err) {
          console.error("Error al cargar el archivo JSON:", err);
        }
      };

      reader.readAsText(file);  // Leer el archivo como texto
      console.log("Lectura del archivo iniciada");
    } else {
      console.log("No se seleccionó ningún archivo JSON");
    }
  };

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
  const [showDownloadSection, setShowDownloadSection] = useState(false);

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
        <div className="form-container">
          <Label text="Descargar datos actuales en (.json)"/>
          {/* Botón para descargar el formulario como .json */}
          <ActionButton
            onClick={handleDownloadJson}
            label="Descargar datos como JSON"
            variant="success"
          />
          <Label text="Cargar datos desde archivo (.json)"/>
          {/* Input nativo para cargar un archivo JSON */}
          <input
            type="file"
            accept=".json"
            onChange={handleUploadJson}  // Conectar con la función
            style={{ marginTop: '20px' }}  // Estilos opcionales
          />
        </div>
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
