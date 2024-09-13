import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes del formulario
import PaymentDetail from "./ComponentInscriptionPayment/PaymentDetail.js";

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
  generateMemoInscriptionPaymentOutProyect1,
  generateAnexo5InscriptionPayment,
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

function InscriptionPaymentForm() {
  // Estado para manejar la visibilidad de secciones y descarga de documentos
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const [showInputParticipacion, setShowInputParticipacion] = useState(false);
  const [showInputDirector, setShowInputDirector] = useState(false);
  const [showInputArticulo, setShowInputArticulo] = useState(false);

  // Configuración de react-hook-form con valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues:
      JSON.parse(localStorage.getItem("formInscriptionPayment")) || {},
  });

  const { watch, setValue, reset } = methods;

  // Observadores para campos clave
  const participacionProyecto = watch("participacionProyecto");
  const rolEnProyecto = watch("rolEnProyecto");
  const seleccionArticulo = watch("articuloPublicado");
  const fechaInicioEvento = watch("fechaInicioEvento");

  // Obtener la fecha actual ajustada por zona horaria
  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000;
  const adjustedNow = new Date(now.getTime() - localOffset).toISOString().split("T")[0];

  // Validación personalizada para la fecha de fin
  const validateFechaFin = (fechaFin) => {
    if (!fechaInicioEvento) {
      return "Primero seleccione la fecha de inicio.";
    }
    return (
      fechaFin >= fechaInicioEvento ||
      "La fecha de finalización no puede ser anterior a la fecha de inicio."
    );
  };

  
  useEffect(() => {
    // Función para inicializar los valores desde localStorage
    const initializeFromLocalStorage = () => {
      const formInscriptionPayment =
        JSON.parse(localStorage.getItem("formInscriptionPayment")) || {};
      reset(formInscriptionPayment);
    };
    initializeFromLocalStorage();
    // Suscribirse a los cambios en el formulario para guardar en localStorage
    const subscription = watch((data) => {
      localStorage.setItem("formInscriptionPayment", JSON.stringify(data));
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

    if (rolEnProyecto === "Codirector" || rolEnProyecto === "Colaborador") {
      setShowInputDirector(true);
    } else {
      setShowInputDirector(false);
      setValue("nombreDirector", "");
      setValue("cargoDirector", "");
    }

    if (seleccionArticulo === "SI") {
      setShowInputArticulo(true);
    } else {
      setShowInputArticulo(false);
      setValue("detalleArticuloSI", "");
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
  const onSubmitInscriptionPayment = (data) => {
    console.log(data);
    setShowDownloadSection(true);
    console.log(methods.getValues());
  };

  // Funciones para manejar la generación de documentos

  const handleGenerateMemo1 = () => {
    const formInscriptionPayment = methods.getValues();
    generateMemoInscriptionPaymentOutProyect1(formInscriptionPayment);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf = () => {
    const formInscriptionPayment = methods.getValues();
    generateAnexo5InscriptionPayment(formInscriptionPayment);
    setShowDownloadSection(false);
  };

  // Función para descargar todos los documentos

  const handleDownloadAll = () => {
    handleGenerateMemo1();
    handleGeneratePdf();
    setShowDownloadSection(false);
  };

  // Función para limpiar el formulario y resetear datos
  const handleClearForm = () => {
    localStorage.removeItem("formInscriptionPayment");
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
          Formulario para Pago de Inscripción Dentro o Fuera de Proyectos
        </h1>
        <Form onSubmit={methods.handleSubmit(onSubmitInscriptionPayment)}>
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

            <LabelTitle text="Detalles del Evento" />

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
                  const today = new Date(now.getTime() - localOffset).toISOString().split("T")[0];
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
              disable={false}
            />

            <InputText
              name="tituloArticulo"
              label="Título del Artículo"
              rules={{ required: "El título del artículo es requerido" }}
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

            <PaymentDetail />

            <LabelTitle text="DOCUMENTACIÓN REQUERIDA PARA PAGOS DE INSCRIPCIÓN" />
            <Label text="REQUISITOS:" />
            <LabelText text="• Formulario para pago de inscripciones." />
            <LabelText text="• Copia de la carta o correo de la aceptación de la ponencia y/o poster para participar en el evento." />
            <LabelText text="• Copia del artículo, ponencia o poster aceptado para verificación de autores y afiliación de la EPN." />
            <LabelText text="• Documento donde se pueda verificar el costo y  fechas de pago de inscripción al evento (NO factura/ NO invoice)." />
            <LabelText text="• Formulario de pagos al exterior, según el caso, incluir el banco intermediario que corresponda." />
            <LabelText text="• Quipux del Director del Proyecto o Profesor solicitante dirigido al Vicerrectorado de Investigación, Innovación y Vinculación en el cual deberá solicitar el pago de la inscripción." />
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
                    label="Descargar Memorando Pago de Inscripcion"
                  />
                </Col>

                <Col md={4} className="text-center">
                  <DownloadButton
                    onClick={handleGeneratePdf}
                    icon="IconPdf.png"
                    altText="PDF Icon"
                    label="Descargar Anexo 5"
                  />
                </Col>
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
export default InscriptionPaymentForm;
