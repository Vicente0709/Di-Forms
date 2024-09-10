import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes del formulario
import PersonalDetails from "./ComponetOutsideProjects/PersonalDetails.js";
import EventDetails from "./ComponetOutsideProjects/EventDetails.js";
import PaymentDetail from "./ComponetOutsideProjects/PaymentDetail.js";
import ExpensesDeclaration from "./ComponetOutsideProjects/ExpensesDeclaration.js";
import BankAccount from "./ComponetOutsideProjects/BankAccount.js";
import Transportation from "./ComponetOutsideProjects/Transportation.js";
import InstitutionalServices from "./ComponetOutsideProjects/InstitutionalServices.js";
import ExteriorDetail from "./ComponetOutsideProjects/ExteriorDetail.js";

import Label from "./Labels/Label.js";
import LabelTitle from "./Labels/LabelTitle.js";
import LabelText from "./Labels/LabelText.js";
import InputSelect from "./Inputs/InputSelect";
import InputText from "./Inputs/InputText";
import InputTextArea from "./Inputs/InputTextArea";
import InputDate from "./Inputs/InputDate";
import RadioGroup from "./Inputs/RadioGroup";
import ActionButton from "./Buttons/ActionButton";
import DownloadButton from "./Buttons/DownloadButton";

// Importación de las funciones para generar documentos

import {
  generateMemoOutsideProject1,
  generateMemoOutsideProject2,
  generateAnexoAOutsideProject,
  generateAnexo8OutsideProject,
} from "../utils/documentGenerator.js";

//Funciones Validación

const validarCedulaEcuatoriana = (cedula) => {
  if (cedula.length !== 10) return false;

  const provincia = parseInt(cedula.slice(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;

  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let digito = parseInt(cedula[i], 10);
    if (i % 2 === 0) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
  }

  const digitoVerificador = (10 - (suma % 10)) % 10;
  return digitoVerificador === parseInt(cedula[9], 10);
};

function EventParticipationOutsideProjectsForm() {
  // Estado para manejar la visibilidad de la sección de descargas
  
  
  // Configuración de react-hook-form con valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues:
      JSON.parse(localStorage.getItem("formEventOutsideProject")) || {},
  });

  const { watch, setValue } = methods;

  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const participacionEvento = watch("participacionEvento"); // Escucha los cambios en la participación en el evento
  const [showInputArticulo, setshowInputArticulo] = useState(false);
  const seleccionArticulo = watch ("articuloPublicado");
  const fechaInicioEvento = watch('fechaInicioEvento'); 
  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000; // Offset en milisegundos


  // Efecto para sincronizar con localStorage y manejar la inicialización
  useEffect(() => {
    // Función para inicializar el estado desde localStorage
    const initializeFromLocalStorage = () => {
      const formData =
        JSON.parse(localStorage.getItem("formEventOutsideProject")) || {};
      // Aquí puedes agregar cualquier lógica adicional de inicialización
    };

    // Llamar a la inicialización al montar el componente
    initializeFromLocalStorage();

    const subscription = watch((data) => {
      localStorage.setItem("formEventOutsideProject", JSON.stringify(data));
    });

    if (seleccionArticulo === "NO") {
      setshowInputArticulo(false);
      setValue("detalleArticuloSI", "");
    } else {
      setshowInputArticulo(true);
    }
    // Limpieza al desmontar el componente
    return () => subscription.unsubscribe();
  }, [seleccionArticulo,watch, setValue]);

  const validateFechaFin = (fechaFin) => {
    if (!fechaInicioEvento) {
      return "Primero seleccione la fecha de inicio.";
    }
    return fechaFin >= fechaInicioEvento || "La fecha de finalización no puede ser anterior a la fecha de inicio.";
  };
  // Función que se ejecuta al enviar el formulario
  const onSubmitEventParticipationOutside = (data) => {
    console.log(data);
    setShowDownloadSection(true);
  };

  // Funciones para manejar la generación de documentos
  const handleGenerateMemo1 = () => {
    const formEventOutsideProject = methods.getValues();
    generateMemoOutsideProject1(formEventOutsideProject);
    setShowDownloadSection(false);
  };

  const handleGenerateMemo2 = () => {
    const formEventOutsideProject = methods.getValues();
    generateMemoOutsideProject2(formEventOutsideProject);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf = () => {
    const formEventOutsideProject = methods.getValues();
    generateAnexoAOutsideProject(formEventOutsideProject);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf2 = () => {
    const formEventOutsideProject = methods.getValues();
    generateAnexo8OutsideProject(formEventOutsideProject);
    setShowDownloadSection(false);
  };

  // Función para descargar todos los documentos

  const handleDownloadAll = () => {
    handleGenerateMemo1();
    handleGenerateMemo2();
    handleGeneratePdf();
    handleGeneratePdf2();
    setShowDownloadSection(false);
  };

  // Función para limpiar el formulario y resetear datos
  const handleClearForm = () => {
    localStorage.removeItem("formEventOutsideProject");
    setShowDownloadSection(false);
    window.location.reload();
  };

  const departamentoOptions = [
    {
      value: "DEPARTAMENTO DE AUTOMATIZACIÓN Y CONTROL INDUSTRIAL",
      label: "DEPARTAMENTO DE AUTOMATIZACIÓN Y CONTROL INDUSTRIAL",
    },
    {
      value: "DEPARTAMENTO DE BIOLOGÍA",
      label: "DEPARTAMENTO DE BIOLOGÍA",
    },
    {
      value: "DEPARTAMENTO DE CIENCIAS ADMINISTRATIVAS",
      label: "DEPARTAMENTO DE CIENCIAS ADMINISTRATIVAS",
    },
    {
      value: "DEPARTAMENTO DE CIENCIAS DE ALIMENTOS Y BIOTECNOLOGÍA",
      label: "DEPARTAMENTO DE CIENCIAS DE ALIMENTOS Y BIOTECNOLOGÍA",
    },
    {
      value: "DEPARTAMENTO DE CIENCIAS NUCLEARES",
      label: "DEPARTAMENTO DE CIENCIAS NUCLEARES",
    },
    {
      value: "DEPARTAMENTO DE CIENCIAS SOCIALES",
      label: "DEPARTAMENTO DE CIENCIAS SOCIALES",
    },
    {
      value: "DEPARTAMENTO DE ECONOMÍA CUANTITATIVA",
      label: "DEPARTAMENTO DE ECONOMÍA CUANTITATIVA",
    },
    {
      value:
        "DEPARTAMENTO DE ELECTRÓNICA, TELECOMUNICACIONES Y REDES DE LA INFORMACIÓN",
      label:
        "DEPARTAMENTO DE ELECTRÓNICA, TELECOMUNICACIONES Y REDES DE LA INFORMACIÓN",
    },
    {
      value: "DEPARTAMENTO DE ENERGÍA ELÉCTRICA",
      label: "DEPARTAMENTO DE ENERGÍA ELÉCTRICA",
    },
    {
      value: "DEPARTAMENTO DE ESTUDIOS ORGANIZACIONALES Y DESARROLLO HUMANO",
      label: "DEPARTAMENTO DE ESTUDIOS ORGANIZACIONALES Y DESARROLLO HUMANO",
    },
    {
      value: "DEPARTAMENTO DE FÍSICA",
      label: "DEPARTAMENTO DE FÍSICA",
    },
    {
      value: "DEPARTAMENTO DE FORMACIÓN BÁSICA",
      label: "DEPARTAMENTO DE FORMACIÓN BÁSICA",
    },
    {
      value: "DEPARTAMENTO DE GEOLOGÍA",
      label: "DEPARTAMENTO DE GEOLOGÍA",
    },
    {
      value: "DEPARTAMENTO DE INFORMÁTICA Y CIENCIAS DE LA COMPUTACIÓN",
      label: "DEPARTAMENTO DE INFORMÁTICA Y CIENCIAS DE LA COMPUTACIÓN",
    },
    {
      value: "DEPARTAMENTO DE INGENIERIA CIVIL Y AMBIENTAL",
      label: "DEPARTAMENTO DE INGENIERIA CIVIL Y AMBIENTAL",
    },
    {
      value: "DEPARTAMENTO DE INGENIERÍA MECÁNICA",
      label: "DEPARTAMENTO DE INGENIERÍA MECÁNICA",
    },
    {
      value: "DEPARTAMENTO DE INGENIERÍA QUÍMICA",
      label: "DEPARTAMENTO DE INGENIERÍA QUÍMICA",
    },
    {
      value: "DEPARTAMENTO DE MATERIALES",
      label: "DEPARTAMENTO DE MATERIALES",
    },
    {
      value: "DEPARTAMENTO DE MATEMÁTICA",
      label: "DEPARTAMENTO DE MATEMÁTICA",
    },
    {
      value: "DEPARTAMENTO DE METALURGIA EXTRACTIVA",
      label: "DEPARTAMENTO DE METALURGIA EXTRACTIVA",
    },
    {
      value: "DEPARTAMENTO DE PETRÓLEOS",
      label: "DEPARTAMENTO DE PETRÓLEOS",
    },
    {
      value: "INSTITUTO GEOFISICO",
      label: "INSTITUTO GEOFISICO",
    },
  ];

  const articuloOptions = [
    {
      value: "SI",
      label: "SI",
    },
    {
      value: "NO",
      label: "NO",
    },
  ];

  const participarElementosOptions = [
    {
      value:"SI",
      label:"SI",
    },
    {
      value: "NO",
      label: "NO",
    },
  ];
  return (
    <FormProvider {...methods}>
      <Container>
        {/* Título del formulario */}
        <h1 className="text-center my-4">
          Formulario para participacion en eventos fuera de proyectos
        </h1>
        <Form
          onSubmit={methods.handleSubmit(onSubmitEventParticipationOutside)}
        >
          {/* Formulario con diferentes secciones 
          <EventDetails />
          <Transportation />
          <PaymentDetail />
          <ExpensesDeclaration />
          <BankAccount />
          <InstitutionalServices/>
          <ExteriorDetail />
          */}

          <div className="form-container">
            <LabelTitle text="Datos Personales" />
            <InputText
              name="nombres"
              label="Nombres del participante"
              placeholder="Juan Sebastian"
              rules={{ required: "Los nombres son requeridos" }}
              disabled={false}
            />

            <InputText
              name="apellidos"
              label="Apellidos del participante"
              placeholder="Perez Ramirez"
              rules={{ required: "Los apellidos son requeridos" }}
              disabled={false}
            />

            <InputText
              name="cedula"
              label="Cédula de ciudadania"
              rules={{
                required: "La cédula es requerida",
                pattern: {
                  value: /^\d{10}$/,
                  message: "La cédula debe contener solo 10 dígitos",
                },
                validate: (value) =>
                  validarCedulaEcuatoriana(value) || "la cédula no es válida",
              }}
              disable={false}
            />

            <InputText
              name="puesto"
              label="Puesto que ocupa"
              infoText="Tal como consta en su acción de personal. Ejemplos: Profesor
          Agregado a Tiempo Completo; Profesor Auxiliar a Tiempo Completo;
          Profesor Principal a Tiempo Completo."
              rules={{ required: "El puesta que ocupa es requerido" }}
              disable={false}
            />

            <InputSelect
              name="departamento"
              label="Departamento / Instituto"
              rules={{ required: "El departamento es requerido" }}
              disable={false}
              options={departamentoOptions}
            />

            <InputText
              name="nombreJefeInmediato"
              label="Nombres y Apellidos del Jefe Inmediato"
              rules={{ required: "El nombre del jefe inmediato es requerido" }}
              disable={false}
            />

            <InputText
              name="cargoJefeInmediato"
              label="Cargo del Jefe inmediato"
              infoText="Favor colocar el cargo del Jefe inmediato, puede usar las siglas
              para referirse al departamento. Para referirse al departamento. Ejemplo: Jefe del DACI / Jefe del DACI, subrogante"
              rules={{
                required: "El cargo del jefe inmediato es requerido",
                minLenght: {
                  value: 10,
                  message: "El cargo que escribio es demasiado corto",
                },
              }}
            />

            <LabelTitle text="Detalles del evento"/>
            <InputText
              name="tituloEvento"
              label="Título del Evento"
              rules={{ required: "El título del evento es requerido" }}
              disable={false}
            />

            <InputText
              name="ciudadEvento"
              label="Ciudad"
              rules={{ required: "La ciudad del evento es requerida" }}
              disable={false}
            />

            <InputText
              name="paisEvento"
              label="País"
              rules={{ required: "El país del evento es requerido" }}
              disable={false}
            />
            <Label text="Fechas del evento" />
            <InputDate
              name="fechaInicioEvento"
              label="Desde:"
              rules={{
                required: "La fecha de inicio del evento es requerida",
                validate: (value) => {
                  const today = new Date(now.getTime() - localOffset)
                    .toISOString()
                    .split("T")[0];
                  return (
                    value >= today ||
                    "La fecha de inicio no puede ser anterior a la fecha actual."
                  );
                },
              }}
              disable={false}
            />

            <InputDate
              name="fechaFinEvento"
              label="Hasta:"
              rules={{
                required: "La fecha de finalización es requerida",
                validate: validateFechaFin,
              }}
              disable={false}
            />

            <InputTextArea
              name="RelevanciaAcademica"
              label="Relevancia Académica del evento"
              rules={{
                required: "La relevancia académica del evento es requerida",
              }}
              disable={false}
            />

            <InputText
              name="tituloPonencia"
              label="Título de la Ponencia"
              rules={{required: "El título de la ponencia es requerido"}}
              disable={false}
            />

              <InputText
              name="tipoPonencia"
              label="Tipo de Ponencia"
              placeholder="Plenaria, poster, otros"
              rules={{required: "El tipo de ponencia es requerido"}}
              disable={false}
              />

            <RadioGroup
              label="¿El Artículo será publicado?"
              name="articuloPublicado"
              options={articuloOptions}
              rules={{ required: "Indique si el artículo será publicado" }}
              disable={false}
            />
              
            {showInputArticulo && (
              <InputText
                name="detalleArticuloSI"
                label="Detalle"
                infoText="Por favor, ingrese el nombre de la revista y base de datos indexadas, 
                el número especial de revista o memorias del evento, 
                la revista o memorias en las cuales se publicará el artículo."
                placeholder="Especifique"
                rules={{
                  required: "Por favor el detalle del artículo es requerido",
                }}
                disable={false}
              />
            )}

          <RadioGroup
              label="Pasajes aéreos"
              name="pasajesAereos"
              options={participarElementosOptions}
              rules={{ required: "Indique si requiere pasajes aéreos" }}
              disable={false}
            />

            <RadioGroup
              label="Viáticos y subsistencias"
              name="viaticosSubsistencias"
              options={participarElementosOptions}
              rules={{ required: "Indique si requiere viáticos y subsistencias" }}
              disable={false}
            />
            <RadioGroup
              label="Inscripción"
              name="inscripcion"
              options={participarElementosOptions}
              rules={{ required: "Indique si requiere inscripción" }}
              disable={false}
            />

          </div>

          {/* Botón para enviar el formulario */}
          <Row className="mt-4">
            <Col className="text-center">
              <Button id="btn_enviar" type="submit" variant="primary">
                Enviar
              </Button>
            </Col>
          </Row>

          {/* Sección de descarga de documentos, visible tras enviar el formulario */}
          {showDownloadSection && (
            <div className="mt-4">
              <Row className="justify-content-center">
                <Col md={4} className="text-center">
                  <div onClick={handleGenerateMemo1} className="download-item">
                    <img
                      src="IconWord.png"
                      alt="Word Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Memorando del Jefe del Departamento</span>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div onClick={handleGenerateMemo2} className="download-item">
                    <img
                      src="IconWord.png"
                      alt="Word Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Memorando del Profesor al Jefe </span>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div onClick={handleGeneratePdf} className="download-item">
                    <img
                      src="IconPdf.png"
                      alt="PDF Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Anexo A</span>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div onClick={handleGeneratePdf2} className="download-item">
                    <img
                      src="IconPdf.png"
                      alt="PDF Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Anexo 8</span>
                  </div>
                </Col>
              </Row>

              {/* Botón para descargar todos los documentos */}
              <Row className="mt-3">
                <Col className="text-center">
                  <Button
                    type="button"
                    onClick={handleDownloadAll}
                    variant="success"
                  >
                    Descargar Todo
                  </Button>
                </Col>
              </Row>
            </div>
          )}

          {/* Botón para limpiar el formulario */}
          <Row className="mt-4">
            <Col className="text-center">
              <Button type="button" onClick={handleClearForm} variant="danger">
                Limpiar Formulario
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </FormProvider>
  );
}
export default EventParticipationOutsideProjectsForm;
