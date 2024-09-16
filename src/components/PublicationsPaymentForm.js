import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes del formulario
import PaymentDetail from "./ComponentPublicationsPayment/PaymentDetail.js";

import Label from "./Labels/Label.js";
import LabelTitle from "./Labels/LabelTitle.js";
import LabelText from "./Labels/LabelText.js";
import InputSelect from "./Inputs/InputSelect";
import InputText from "./Inputs/InputText";
import InputTextArea from "./Inputs/InputTextArea";
import ActionButton from "./Buttons/ActionButton";
import DownloadButton from "./Buttons/DownloadButton";
// Importación de las funciones para generar documentos

import {
    generateMemoPublicationPaymentProject,
  generateAnexo1PublicationPaymentWithin,
  generateAnexo2PublicationPaymentOutside,
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

function PublicationsPaymentForm() {
  // Estado para manejar la visibilidad de secciones y descarga de documentos
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const [showInputParticipacion, setShowInputParticipacion] = useState(false);
  const [showInputDirector, setShowInputDirector] = useState(false);
  const [showInputFueraProyecto, setShowInputFueraProyecto] = useState(false);

  // Configuración de react-hook-form con valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues:
      JSON.parse(localStorage.getItem("formPublicationsPayment")) || {},
  });

  const { watch, setValue, reset } = methods;

  // Observadores para campos clave
  const participacionProyecto = watch("participacionProyecto");
  const rolEnProyecto = watch("rolEnProyecto");
  const seleccionArticulo = watch("articuloPublicado");

  // Obtener la fecha actual ajustada por zona horaria
  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000;
  const adjustedNow = new Date(now.getTime() - localOffset).toISOString().split("T")[0];

  
  useEffect(() => {
    // Función para inicializar los valores desde localStorage
    const initializeFromLocalStorage = () => {
      const formPublicationsPayment =
        JSON.parse(localStorage.getItem("formPublicationsPayment")) || {};
      reset(formPublicationsPayment);
    };
    initializeFromLocalStorage();
    // Suscribirse a los cambios en el formulario para guardar en localStorage
    const subscription = watch((data) => {
      localStorage.setItem("formPublicationsPayment", JSON.stringify(data));
    });
    // Limpiar la suscripción al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch, reset]);

  // Efecto para sincronizar con localStorage y manejar la inicialización
  useEffect(() => {
    
    // Mostrar u ocultar campos según las selecciones del formulario
    if (participacionProyecto === "dentroProyecto") {
      setShowInputParticipacion(true);
    } else {
      setShowInputParticipacion(false);
      setValue("codigoProyecto", "");
      setValue("nombreDirector", "");
      setValue("cargoDirector", "");
    }

    if(participacionProyecto==="fueraProyecto"){
      setShowInputFueraProyecto(true);
    }else{
       setShowInputFueraProyecto(false);
    }

    if (rolEnProyecto === "Codirector" || rolEnProyecto === "Colaborador") {
      setShowInputDirector(true);
    } else {
      setShowInputDirector(false);
      setValue("nombreDirector", "");
      setValue("cargoDirector", "");
    }

  }, [
    participacionProyecto,
    rolEnProyecto,
    seleccionArticulo,
    watch,
    reset,
    setValue,
  ]);

  // Función que se ejecuta al enviar el formulario
  const onSubmitPublicationsPayment = (data) => {
    console.log(data);
    setShowDownloadSection(true);
    console.log(methods.getValues());
  };

  // Funciones para manejar la generación de documentos

  const handleGenerateMemo1 = () => {
    const formPublicationsPayment = methods.getValues();
    generateMemoPublicationPaymentProject(formPublicationsPayment);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf = () => {
    const formPublicationsPayment = methods.getValues();
    generateAnexo1PublicationPaymentWithin(formPublicationsPayment);
    setShowInputParticipacion(true);
    setShowDownloadSection(false);
  };


  const handleGeneratePdf2 = () => {
    const formPublicationsPayment = methods.getValues();
    generateAnexo2PublicationPaymentOutside(formPublicationsPayment);
    setShowInputFueraProyecto(true);
    setShowDownloadSection(false);
  };
  

  // Función para descargar todos los documentos
//Validación para descargar adecuadamente los archivos necesarios
  const handleDownloadAll = () => {
    if(participacionProyecto === "dentroProyecto"){
        handleGenerateMemo1();
        handleGeneratePdf();
    }else{
        handleGenerateMemo1();
        handleGeneratePdf2();
    }
    
    setShowDownloadSection(false);
  };

  // Función para limpiar el formulario y resetear datos
  const handleClearForm = () => {
    localStorage.removeItem("formPublicationsPayment");
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
  const participacionOptions = [
    {
      value: "fueraProyecto",
      label: "Fuera de Proyecto",
    },
    {
      value: "dentroProyecto",
      label: "Dentro de Proyecto",
    },
  ];

  const rolOptions = [
    {
      value: "Director",
      label: "Director",
    },
    {
      value: "Codirector",
      label: "Codirector",
    },
    {
      value: "Colaborador",
      label: "Colaborador",
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

  return (
    <FormProvider {...methods}>
      <Container>
        {/* Título del formulario */}
        <h1 className="text-center my-4">
          Formulario para Pago de Publicación Dentro o Fuera de Proyectos
        </h1>
        <Form onSubmit={methods.handleSubmit(onSubmitPublicationsPayment)}>
          {/* Formulario con diferentes secciones */}
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

            <InputSelect
              name="departamento"
              label="Departamento / Instituto"
              rules={{ required: "El departamento es requerido" }}
              disable={false}
              options={departamentoOptions}
            />

            <InputSelect
              name="participacionProyecto"
              label="Participación"
              options={participacionOptions}
              rules={{ required: "La participación es requerida" }}
              disable={false}
            />
            {showInputParticipacion && (
              <>
                <InputText
                  name="codigoProyecto"
                  label="Código del Proyecto"
                  rules={{
                    required: "El código del Proyecto es requerido",
                    pattern: {
                      value: /^[A-Za-z]+(-[A-Za-z0-9]+)+$/,
                      message:
                        "El código del proyecto debe estar conformado por una combinación de letras y números separadas por guiones.",
                    },
                  }}
                  disable={false}
                />

                <InputSelect
                  name="rolEnProyecto"
                  label="Rol en el proyecto"
                  options={rolOptions}
                  rules={{ required: "El rol en el proyecto es requerido" }}
                  disable={false}
                />
                {showInputDirector && (
                  <>
                    <InputText
                      name="nombreDirector"
                      label="Nombre del Director del Proyecto"
                      rules={{
                        required: "El nombre del Director es requerido",
                      }}
                      disable={false}
                    />
                  </>
                )}
              </>
            )}

            <LabelTitle text="Datos de la Publicación" />

            <InputText
              name="tituloPublicacion"
              label="Título de la Publicación"
              rules={{ required: "El título de la publicación es requerido" }}
              disable={false}
            />

            <InputText
              name="nombreRevista"
              label="Nombre de la Revista"
              rules={{ required: "El nombre de la revista es requerida" }}
              disable={false}
            />

            <InputTextArea
              name="autoresEPN"
              label="Autores de la EPN"
              infoText="(Titulares, Ocasionales, otros)"
              placeholder="Escriba aquí los nombres de los autores separados por comas (,)"
              rules={{ required: "Los autores son requeridos" }}
              disable={false}
            />

            <InputTextArea
              name="autoresExternos"
              label="Autores Externos"
              placeholder="Escriba aquí los nombres de los autores separados por comas (,)"
              rules={{ required: "Los autores son requeridos" }}
              disable={false}
            />
            <InputText
              name="baseDatos"
              label="Base de Datos de Indexación"
              rules={{ required: "La base de datos de indexación es requeridos" }}
              disable={false}
            />

            <InputText
              name="cuartilPublicacion"
              label="Cuartil de la Publicación"
              rules={{ required: "El cuartil de la publicación es requeridos" }}
              disable={false}
            />
       
            <PaymentDetail />
            {showInputParticipacion && (
                <>
            <LabelTitle text="DOCUMENTACIÓN REQUERIDA PARA PAGO DE ARTÍCULOS CIENTÍFICOS ACEPTADOS EN REVISTAS DE ALTO IMPACTO-DENTRO DE PROYECTOS" />
            <Label text="REQUISITOS:" />
            <LabelText text="• Formulario para pago de artículos científicos aceptados en revistas de alto impacto-dentro de proyectos." />
            <LabelText text="• Copia de la carta o correo de aceptación de la publicación." />
            <LabelText text="• Documento donde se puede verificar el costo de la publicación y la fecha máxima de pago." />
            <LabelText text="• Formulario de registro de cuenta o formulario de giro al exterior." />
            <LabelText text="• Copia del resumen del artículo para verificación de autores y filiación de la EPN." />
            <LabelText text="• Quipux del Director del Proyecto al Vicerrectorado de Investigación, Innovación y Vinculación, solicitando el pago de la publicación." />
            </>
            )}

           {showInputFueraProyecto&& (
                <>
                <LabelTitle text="DOCUMENTACIÓN Y REQUISITOS REQUERIDOS PARA PAGO DE SUBVENCIONES PARA LA DIFUSIÓN DE ARTÍCULOS CIENTÍFICOS ACEPTADOS EN REVISTAS DE ALTO IMPACTO" />
                <Label text="REQUISITOS:" />
                <LabelText text="• La filiación del primer autor de la publicación debe ser la Escuela Politécnica Nacional. En el caso que la aparición de los autores sea por orden alfabético se deberá presentar la documentación en la que se indique quien consta como autor principal y este debe tener la filiación de la EPN." />
                <LabelText text="• La publicación debe tener un máximo de diez autores entre investigadores de la Escuela Politécnica Nacional y externos. Para auspiciar las publicaciones de más de cinco autores, al menos la mitad de estos debe pertenecer a la EPN." />
                <LabelText text="• La revista debe estar ubicada en el primer cuartil (Q1) o segundo cuartil (Q2) de la especialización-Indexada en Scimago Journal Rank." />
                <LabelText text="• El nombre de la Escuela Politécnica Nacional debe estar sin traducciones en la filiación de los autores según corresponda." />
                <LabelText text="• Formulario para el pago de subvenciones para la difusión de artículos científicos aceptados en revistas de alto impacto." />
                <LabelText text="• Copia de la carta o correo de aceptación de la publicación." />
                <LabelText text="• Documento donde se puede verificar el costo de la publicación y la fecha máxima de pago." />
                <LabelText text="• Formulario de registro de cuenta o formulario de giro al exterior." />
                <LabelText text="• Copia del resumen del artículo para verificación de autores y filiación de la EPN." />
                <LabelText text="• Quipux del profesor al Vicerrectorado de Investigación, Innovación y Vinculación, solicitando el auspicio para el pago de subvención de la publicación." />
                </>
           )}
         
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
                  <DownloadButton
                    onClick={handleGenerateMemo1}
                    icon="IconWord.png"
                    altText="Word Icon"
                    label="Descargar Memorando Pago de Publicación"
                  />
                </Col>
                {showInputParticipacion && (
              <>
                <Col md={4} className="text-center">
                  <DownloadButton
                    onClick={handleGeneratePdf}
                    icon="IconPdf.png"
                    altText="PDF Icon"
                    label="Descargar Anexo 1"
                  />
                </Col>
                </>
                )}

                {showInputFueraProyecto&& (
                <>
                <Col md={4} className="text-center">
                  <DownloadButton
                    onClick={handleGeneratePdf2}
                    icon="IconPdf.png"
                    altText="PDF Icon"
                    label="Descargar Anexo 2"
                  />
                </Col>
                </>
                )}
              </Row>

              {/* Botón para descargar todos los documentos */}
              <Row className="mt-3">
                <Col className="text-center">
                  <ActionButton
                  onClick={handleDownloadAll}
                  label="Descargar Todo"
                  variant="success"
                  />
                </Col>
              </Row>
            </div>
          )}

          {/* Botón para limpiar el formulario */}
          <Row className="mt-4">
            <Col className="text-center">
              <ActionButton
              onClick={handleClearForm}
              label="Limpiar Formulario"
              variant="danger"
              />
            </Col>
          </Row>
        </Form>
      </Container>
    </FormProvider>
  );
}
export default PublicationsPaymentForm;