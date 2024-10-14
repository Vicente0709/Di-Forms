import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import JSZip from "jszip";
import { saveAs } from "file-saver";
// Importación de los componentes del formulario
import Label from "../components/Labels/Label.js";
import LabelTitle from "../components/Labels/LabelTitle.js";
import LabelText from "../components/Labels/LabelText.js";
import InputSelect from "../components/Inputs/InputSelect.js";
import InputText from "../components/Inputs/InputText.js";
import InputTextArea from "../components/Inputs/InputTextArea.js";
import InputDate from "../components/Inputs/InputDate.js";
import RadioGroup from "../components/Inputs/RadioGroup.js";
import ActionButton from "../components/Buttons/ActionButton.js";
import DownloadButton from "../components/Buttons/DownloadButton.js";
import today from "../utils/date.js";

import {generateAnexo6} from "../utils/generatorDocuments/services/serviceDocuments"
const formStorageKey = "formExternalPayment"; // Clave para almacenar el formulario en sessionStorage

function ExternalPaymentForm() {
  const formData = JSON.parse(sessionStorage.getItem(formStorageKey)) || {}; // Datos del formulario desde sessionStorage
  // Configuración del formulario con react-hook-form y valores predeterminados desde sessionStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: formData,
  });

  const {
    register,
    control,
    watch,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = methods;

  //Observadores
  const [loading, setLoading] = useState(false); //para el spinner de carga
  const [showDownloadSection, setShowDownloadSection] = useState(false);

  const handleUploadJson = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        reset(json, {
          keepErrors: false,
          keepDirty: false,
          keepValues: false,
          keepTouched: false,
          keepIsSubmitted: false,
        });
        sessionStorage.setItem(formStorageKey, JSON.stringify(json));
      } catch (err) {
        console.error("Error al cargar el archivo JSON:", err);
      }
    };
    reader.readAsText(file);
  };

  const onSubmit = (data) => {
    setShowDownloadSection(true);
  };

  const handleGenerateAnexo6 = () => {
    const data = methods.getValues();
    generateAnexo6(data);
    setShowDownloadSection(false);
  };
  const handleDownloadAll = () => {};
  const handleClearForm = () => {
    sessionStorage.removeItem(formStorageKey);
    setShowDownloadSection(false);
    window.location.reload();
  };
  const handleDownloadJson = (returnDocument = false) => {
    const data = methods.getValues();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    if (returnDocument === true) return blob;
    saveAs(blob, "Pagos al exterior.json");
  };

  useEffect(() => {
    const formData = JSON.parse(sessionStorage.getItem(formStorageKey)) || {};
    reset(formData);
    const subscription = watch((data) => {
      sessionStorage.setItem(formStorageKey, JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [reset, watch]);

  return (
    <FormProvider {...methods}>
      <Container>
        {/* Título del formulario */}
        <h1 className="text-center my-4">Formulario para pagos al exterior</h1>
        <div className="form-container">
          <Label text="Cargar datos desde archivo (.json)" />
          <input
            type="file"
            accept=".json"
            onChange={handleUploadJson} // Conectar con la función
            className="input-file"
          />
        </div>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* Aquí puedes agregar los campos del formulario */}
          <div className="form-container">
            {/* Moneda */}
            <InputSelect
              name="moneda"
              label="MONEDA / CURRENCY"
              options={[
                { label: "(฿) Baht tailandés", value: "THB" },
                { label: "(Kč) Corona checa", value: "CZK" },
                { label: "(kr) Corona danesa", value: "DKK" },
                { label: "(kr) Corona noruega", value: "NOK" },
                { label: "(kr) Corona sueca", value: "SEK" },
                { label: "(A$) Dólar australiano", value: "AUD" },
                { label: "(C$) Dólar canadiense", value: "CAD" },
                { label: "(HK$) Dólar de Hong Kong", value: "HKD" },
                { label: "(NZ$) Dólar de Nueva Zelanda", value: "NZD" },
                { label: "(S$) Dólar de Singapur", value: "SGD" },
                { label: "($) Dólar estadounidense", value: "USD" },
                { label: "(€) Euro", value: "EUR" },
                { label: "(Ft) Florín húngaro", value: "HUF" },
                { label: "(CHF) Franco suizo", value: "CHF" },
                { label: "(£) Libra esterlina", value: "GBP" },
                { label: "(₺) Lira turca", value: "TRY" },
                { label: "(NT$) Nuevo dólar taiwanés", value: "TWD" },
                { label: "(₪) Nuevo shekel israelí", value: "ILS" },
                { label: "(CLP$) Peso chileno", value: "CLP" },
                { label: "(₱) Peso filipino", value: "PHP" },
                { label: "($) Peso mexicano", value: "MXN" },
                { label: "(R) Rand sudafricano", value: "ZAR" },
                { label: "(R$) Real brasileño", value: "BRL" },
                { label: "(¥) Renminbi/yuan chino", value: "CNY" },
                { label: "(₽) Rublo ruso", value: "RUB" },
                { label: "(₹) Rupia india", value: "INR" },
                { label: "(Rp) Rupia indonesia", value: "IDR" },
                { label: "(₩) Won surcoreano", value: "KRW" },
                { label: "(¥) Yen japonés", value: "JPY" },
                { label: "(zł) Złoty polaco", value: "PLN" }
              ]}
              rules={{ required: "La moneda es requerida" }}
              disabled={false}
            />

            {/* Nombre de Beneficiario */}
            <InputText
              name="beneficiaryName"
              label="NOMBRE DE BENEFICIARIO / BENEFICIARY'S NAME"
              rules={{ required: "El nombre del beneficiario es requerido" }}
              disabled={false}
            />

            {/* Dirección */}
            <InputTextArea
              name="beneficiaryAddress"
              label="DIRECCIÓN / ADDRESS"
              rules={{ required: "La dirección del beneficiario es requerida" }}
              disabled={false}
            />

            {/* País */}
            <InputText
              name="beneficiaryCountry"
              label="PAÍS / COUNTRY"
              rules={{ required: "El país es requerido" }}
              disabled={false}
            />

            {/* Ciudad */}
            <InputText
              name="beneficiaryCity"
              label="CIUDAD / CITY"
              rules={{ required: "La ciudad es requerida" }}
              disabled={false}
            />

            {/* Nombre del Banco */}
            <InputText
              name="bankName"
              label="NOMBRE DEL BANCO / BANK NAME"
              rules={{ required: "El nombre del banco es requerido" }}
              disabled={false}
            />

            {/* Código ABA o SWIFT */}
            <InputText
              name="swiftCode"
              label="CÓDIGO ABA O SWIFT / CODE ABA OR SWIFT"
              rules={{ required: "El código ABA o SWIFT es requerido" }}
              disabled={false}
            />

            {/* Número de cuenta / IBAN */}
            <InputText
              name="accountNumber"
              label="NÚMERO DE CUENTA / IBAN; ACCOUNT NUMBER / IBAN"
              rules={{ required: "El número de cuenta o IBAN es requerido" }}
              disabled={false}
            />

            {/* País */}
            <InputText
              name="bankCountry"
              label="PAÍS / COUNTRY"
              rules={{ required: "El país del banco es requerido" }}
              disabled={false}
            />

            {/* Ciudad */}
            <InputText
              name="bankCity"
              label="CIUDAD / CITY"
              rules={{ required: "La ciudad del banco es requerida" }}
              disabled={false}
            />

            {/* Información sobre el banco intermediario */}
            <LabelText text="Si el pago se realiza en US Dollars y el Banco del Beneficiario no se encuentra en Estados Unidos, el Banco Intermediario debe tener como país Estados Unidos. Si el pago se realiza en EUROS a bancos beneficiarios que se encuentren localizados fuera de la Unión Europea, se debe informar un banco intermediario que esté localizado en un país que pertenezca a la Unión Europea." />
            <LabelText text="If the payment is made in US Dollars and the Beneficiary's Bank is not located in the United States, the Intermediary Bank must have the United States as its country. If the payment is made in EUROS to beneficiary banks located outside the European Union, an intermediary bank located in a country belonging to the European Union must be informed."
            />

            {/* Nombre del Banco Intermediario */}
            <InputText
              name="intermediaryBankName"
              label="NOMBRE DE BANCO INTERMEDIARIO / INTERMEDIARY BANK NAME"
              disabled={false}
            />

            {/* Código ABA o SWIFT del Banco Intermediario */}
            <InputText
              name="intermediarySwiftCode"
              label="CÓDIGO ABA O SWIFT / CODE ABA OR SWIFT"
              disabled={false}
            />

            {/* País del Banco Intermediario */}
            <InputText
              name="intermediaryBankCountry"
              label="PAÍS / COUNTRY"
              disabled={false}
            />

            {/* Ciudad del Banco Intermediario */}
            <InputText
              name="intermediaryBankCity"
              label="CIUDAD / CITY"
              disabled={false}
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
          <Label text="Descargar datos actuales en (.json)" />
          <ActionButton
            onClick={handleDownloadJson}
            label="Descargar datos como JSON"
            variant="success"
          />

          {/* Sección de descarga de documentos, visible tras enviar el formulario */}
          {showDownloadSection && (
            <div className="mt-4">
              <Row className="justify-content-center">
                <Col md={4} className="text-center">
                  <DownloadButton
                    onClick={handleGenerateAnexo6}
                    label="Descargar Anexo 10"
                    icon="IconPdf.png"
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
export default ExternalPaymentForm;
