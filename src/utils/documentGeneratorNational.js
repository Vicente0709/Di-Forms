import React from "react";
import { Font } from "@react-pdf/renderer";
import { Page, Text, View, Document as PDFDocument, StyleSheet, pdf,} from "@react-pdf/renderer";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { generate } from "@pdfme/generator";
import { text, image, barcodes } from "@pdfme/schemas";
import JSZip from "jszip";


import { basePdfAnexoANational } from "../utils/basePdfAnexoANational";
import { schemasAnexoANational } from "../utils/schemasAnexoANational";


// Registra la fuente Roboto desde Google Fonts
Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu72xKOzY.woff2",
  fontWeight: 900,
});

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: "Roboto",
  },
  // Título principal
  header: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#2573ca",
    fontFamily: "Roboto",
  },
  // Títulos (extra bold, centrado)
  sectionTitle: {
    fontSize: 11,
    marginBottom: 10,
    fontWeight: 900, // Extra bold
    fontFamily: "Roboto",
  },
  // Subtítulos (bold, centrado)
  subSectionTitle: {
    fontSize: 10,
    marginBottom: 10,
    fontWeight: "bold", // Bold normal
    fontFamily: "Roboto",
    textAlign: "center",
  },
  // Texto genérico estándar
  baseText: {
    margin: 5,
    fontSize: 9,
    fontFamily: "Roboto",
    color: "black",
  },

  // Texto genérico centrado
  baseTextCenter: {
    margin: 5,
    fontSize: 9,
    fontFamily: "Roboto",
    color: "black",
    textAlign: "center",
  },

  // Texto en azul, no centrado
  textBlue: {
    margin: 5,
    fontSize: 10,
    fontFamily: "Roboto",
    color: "#2573ca",
  },

  // Texto en azul centrado
  textBlueCenter: {
    margin: 5,
    fontSize: 10,
    fontFamily: "Roboto",
    color: "#2573ca",
    textAlign: "center",
  },
  // Estilo para celdas de tabla
  tableCellText: {
    margin: 5,
    fontSize: 10,
    fontWeight: 700, // Extra bold
    textAlign: "center",
    fontFamily: "Roboto",
    justifyContent: "center",
    flexDirection: "column",
  },
  // Estilo para celdas de tabla
  tableCellTextCenter: {
    margin: 5,
    fontSize: 10,
    fontWeight: 700, // Extra bold
    textAlign: "center",
    fontFamily: "Roboto",
  },

  // Estilo para texto dentro de celdas de tabla (color azul)
  tableCellTextBlue: {
    margin: 5,
    fontSize: 10,
    color: "#2573ca",
    fontFamily: "Roboto",
  },
  // Estilo para texto dentro de celdas de tabla (color azul)
  tableCellTextBlueCenter: {
    margin: 5,
    fontSize: 10,
    color: "#2573ca",
    fontFamily: "Roboto",
    textAlign: "center",
  },

  // Tabla general
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0.5, // Línea continua de 1/2 punto
    borderColor: "#000000",
    marginBottom: 10,
  },

  // Filas de la tabla
  tableRow: {
    flexDirection: "row",
  },

  // Columnas de tamaño variable
  tableCol: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna con ajuste automático
  tableColAuto: {
    flex: 1, // Ajuste automático
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 15%
  tableCol15: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 20%
  tableCol20: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 25%
  tableCol25: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 40%
  tableCol40: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 50%
  tableCol50: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 60%
  tableCol60: {
    width: "60%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 75%
  tableCol75: {
    width: "75%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 80%
  tableCol80: {
    width: "80%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna que ocupa toda la fila (100%)
  tableColFullWidth: {
    width: "100%", // Columna de 100% del ancho total
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    backgroundColor: "#f0f0f0", // Fondo para resaltar el título o contenido
    fontFamily: "Roboto",
  },
});

//Constantes
const today = new Date();
const day = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados, por lo que se suma 1
const year = today.getFullYear();
const formattedDate = `${day}/${month}/${year}`;



export function generateMemoSamplingTripWithinProject(data,returnDocument = false) {
  // Crear un texto de solicitud en función de los campos pasajesAereos, viaticosSubsistencias e inscripción
  let solicitudOracion = "Para lo cual solicito ";
  
  let solicitudes = [];
  if (data.pasajesAereos === "SI") {
    solicitudes.push("la compra de pasajes aéreos");
  }
  if (data.viaticosSubsistencias === "SI") {
    solicitudes.push("la asignación de viáticos y subsistencias");
  }
  if (data.inscripcion === "SI") {
    solicitudes.push("el pago de inscripción");
  }

  if (solicitudes.length > 0) {
    solicitudOracion += solicitudes.join(" y ") + ".";
  } else {
    solicitudOracion = "";
  }

  // Generar el cuerpo del memorando
  const cuerpoMemorando = `En mi calidad de Director del Proyecto ${data.codigoProyecto}, solicito se realicen los trámites pertinentes para la salida de campo y de muestreo, a realizarse del ${data.fechaInicioViaje} al ${data.fechaFinViaje} en la ciudad de ${data.ciudad}, para lo cual autorizo el gasto para que se gestione ${solicitudOracion}`;

  // Crear el documento .docx
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Título del memorando
          new Paragraph({
            children: [
              new TextRun({
                text: "MEMORANDO - SALIDA DE CAMPO Y DE MUESTREO",
                bold: true,
                size: 24,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 300 },
            alignment: "center",
          }),

          // "PARA:" sección
          new Paragraph({
            children: [
              new TextRun({
                text: "PARA:\t\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: "Dr. Marco Santorum",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),

          // Asunto del memorando
          new Paragraph({
            children: [
              new TextRun({
                text: "ASUNTO:\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: `Autorización de gasto y solicitud para salida de campo y de muestreo/${data.codigoProyecto}`,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),

          // Cuerpo del memorando
          new Paragraph({
            children: [
              new TextRun({
                text: cuerpoMemorando,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),

          // Despedida
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta la documentación correspondiente",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Con sentimientos de distinguida consideración.",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),

          // Firma
          new Paragraph({
            children: [
              new TextRun({
                text: "Atentamente,",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),

          // Nombre del director del proyecto
          new Paragraph({
            children: [
              new TextRun({
                text: data.nombreDirector.toUpperCase(),
                size: 20,
                bold: true,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 100 },
          }),

          // Cargo del firmante
          new Paragraph({
            children: [
              new TextRun({
                text: `DIRECTOR DEL PROYECTO ${data.codigoProyecto.toUpperCase()}`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Guardar el archivo como .docx
  Packer.toBlob(doc).then((blob) => {
    saveAs(
      blob,
      `Memorando solicitud salida de campo ${data.codigoProyecto}.docx`
    );
  });
}

export async function NationalSamplingTrips(data,returnDocument = false) {
  const template = {
    schemas: schemasAnexoANational,
    basePdf: basePdfAnexoANational,
  };

  const transporte = data.transporteIda.concat(data.transporteRegreso);
  const ultimaFechaLlegada = transporte.length > 0 ? transporte[transporte.length - 1]?.fechaLlegada : "";
  const ultimaHoraLlegada = transporte.length > 0 ? transporte[transporte.length - 1]?.horaLlegada : "";


  let servidoresText = "";
  for (const participante of data.participante) {
    if (servidoresText) {
      servidoresText += ", ";
    }
    servidoresText += participante.nombre.toUpperCase();
  }

  const plugins = { text, image, qrcode: barcodes.qrcode };

  const zip = new JSZip();

  for (const participante of data.participante) {
    const transporteInfo = {};
    for (let i = 0; i < 8; i++) {
      transporteInfo[`transporteTipo${i + 1}`] = transporte[i]?.tipoTransporte || "";
      transporteInfo[`transporteNombre${i + 1}`] = transporte[i]?.nombreTransporte || "";
      transporteInfo[`transporteRuta${i + 1}`] = transporte[i]?.ruta || "";
      transporteInfo[`transporteFechaS${i + 1}`] = formatDate(transporte[i]?.fechaSalida) || "";
      transporteInfo[`transporteFechaSH${i + 1}`] = transporte[i]?.horaSalida || "";
      transporteInfo[`transporteFechaL${i + 1}`] = formatDate(transporte[i]?.fechaLlegada) || "";
      transporteInfo[`transporteFechaLH${i + 1}`] = transporte[i]?.horaLlegada || "";
    }

    const inputs = [
      {
        fechaSolicitud: formattedDate,
        viaticos: participante.viaticos ? "X" : "",
        movilizacion: participante.viaticos ? "X" : "",
        subsistencias: participante.viaticos ? "X" : "",
        alimentacion: participante.viaticos ? "X" : "",

        nombresCompletos: participante.nombre.toUpperCase(),
        lugar: data.ciudad + ", Ecuador",
        puesto: participante.cargo,
        unidadPerteneciente: participante.departamento,

        fechaSalida: formatDate(data.transporteIda[0]?.fechaSalida),
        horaSalida: data.transporteIda[0]?.horaSalida,

        fechaLlegada: formatDate(ultimaFechaLlegada),
        horaLlegada: ultimaHoraLlegada,

        servidores: participante.nombre.toUpperCase() + servidoresText.toUpperCase(),

        actividades: "Dentro de las actividades del proyecto  " + data.codigoProyecto + " titulado  '" + data.tituloProyecto + "', que tendrá lugar del  " + data.fechaInicioEvento + "  al  " + data.fechaFinEvento + " en la ciudad de  " + data.ciudadEvento + ", Ecuador. ",

        ...transporteInfo,

        banco: participante.viaticos? participante.banco: "",
        bancoTipoCuenta: participante.viaticos? participante.tipoCuenta: "",
        numeroCuenta: participante.viaticos? participante.numeroCuenta: "",

        nombresCompletos2: participante.nombre.toUpperCase() + "\n" + participante.cargo.toUpperCase() + "\n" + participante.cedula,

        nombresCompletosJefeInmediato: participante.nombreJefeInmediato.toUpperCase() + "\n" + participante.cargoJefeInmediato.toUpperCase(),
      },
    ];

    const pdf = await generate({ template, plugins, inputs });
    const blob = new Blob([pdf.buffer], { type: "application/pdf" });

    zip.file(`AnexoA_${participante.nombre.replace(/\s+/g, '_')}.pdf`, blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "AnexosA.zip");
}


export async function generateAnexoASamplingTripWithinProject(data,returnDocument = false) {
  const template = {
    schemas: schemasAnexoANational,
    basePdf: basePdfAnexoANational,
  };

  // Fusionar los arrays transporteIda y transporteRegreso en un solo array llamado transporte
  const transporte = data.transporteIda.concat(data.transporteRegreso);
  const ultimaFechaLlegada =
    transporte.length > 0
      ? transporte[transporte.length - 1]?.fechaLlegada
      : "";
  const ultimaHoraLlegada =
    transporte.length > 0 ? transporte[transporte.length - 1]?.horaLlegada : "";
  var ponentciaText = "";

  if (
    data.tituloPonencia &&
    data.tituloPonencia.trim() !== "" &&
    data.tituloPonencia.trim() !== "No Aplica"
  ) {
    ponentciaText =
      "Para la participacion de la ponencia '" + data.tituloPonencia + "'";
  } else {
    ponentciaText = "";
  }

  // Concatenación de servidores/personal a trasladarse
  let servidoresText = "";
  if (data.participante && data.participante.length > 0) {
    servidoresText = data.participante
      .map((p) => p.nombre + " (" + p.rol + ")")
      .join(", ");
  }

  const plugins = { text, image, qrcode: barcodes.qrcode };
  const transporteInfo = {};
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
  for (let i = 0; i < 8; i++) {
    transporteInfo[`transporteTipo${i + 1}`] =
      transporte[i]?.tipoTransporte || "";
    transporteInfo[`transporteNombre${i + 1}`] =
      transporte[i]?.nombreTransporte || "";
    transporteInfo[`transporteRuta${i + 1}`] = transporte[i]?.ruta || "";
    transporteInfo[`transporteFechaS${i + 1}`] =
      formatDate(transporte[i]?.fechaSalida) || "";
    transporteInfo[`transporteFechaSH${i + 1}`] =
      transporte[i]?.horaSalida || "";
    transporteInfo[`transporteFechaL${i + 1}`] =
      formatDate(transporte[i]?.fechaLlegada) || "";
    transporteInfo[`transporteFechaLH${i + 1}`] =
      transporte[i]?.horaLlegada || "";
  }

  const inputs = [
    {
      fechaSolicitud: formattedDate,
      viaticos: data.viaticosSubsistencias === "SI" ? "X" : "",
      movilizacion: data.viaticosSubsistencias === "SI" ? "X" : "",
      subsistencias: data.viaticosSubsistencias === "SI" ? "X" : "",
      alimentacion: data.viaticosSubsistencias === "SI" ? "X" : "",

      nombresCompletos:
      data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),

      lugar: data.ciudad,
      puesto: data.cargo ==="" ? "" : data.cargo,
      unidadPerteneciente: data.departamento,

      fechaSalida: formatDate(data.transporteIda[0]?.fechaSalida),
      horaSalida: data.transporteIda[0]?.horaSalida,

      fechaLlegada: formatDate(ultimaFechaLlegada),
      horaLlegada: ultimaHoraLlegada,

      servidores: servidoresText.toUpperCase(),

      actividades:
        "Dentro de las actividades del proyecto  " +
        data.codigoProyecto +
        " titulado  '" +
        data.tituloProyecto +
        "'  se llevará a cabo la salida de campo y de muestreo, que tendrá lugar del  " +
        data.fechaInicioViaje +
        "  al  " +
        data.fechaFinViaje +
        " en la ciudad de  " +
        data.ciudad +
        ".",

      ...transporteInfo,

      banco: data.nombreBanco || "",
      bancoTipoCuenta: data.tipoCuenta || "",
      numeroCuenta: data.numeroCuenta || "",

      nombresCompletos2:
        data.nombres.toUpperCase() +
        " " +
        data.apellidos.toUpperCase() +
        "\n" +
        data.cargo.toUpperCase() +
        "\n" +
        data.cedula,

      nombresCompletosJefeInmediato:
        data.nombreJefeInmediato.toUpperCase() +
        "\n" +
        data.cargoJefeInmediato.toUpperCase(),
    },
  ];

  const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  saveAs(
    blob,
    "Anexo 1 - Solicitud de viáticos EPN " + data.codigoProyecto + ".pdf"
  );
}

// color: '#2573ca',

export async function generateAnexo7WithinProject(data,returnDocument = false) {
  const MyPDFDocument = (
    <PDFDocument>
  <Page style={styles.page}>
    {/* Título del formulario */}
    <Text style={styles.header}>
      Anexo 7 – Formulario para salidas de campo y de muestreo y/o viajes
      técnicos dentro de proyectos
    </Text>

    {/* 1. Datos Generales */}
    <View style={styles.sectionTitle}>
      <Text>1. DATOS GENERALES PARA LA SALIDA DE CAMPO, DE MUESTREO Y/O VIAJE TÉCNICO</Text>
    </View>
    <View style={styles.subSectionTitle}>
      <Text>Complete según corresponda la siguiente información</Text>
    </View>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={styles.tableCol25}>
          <Text style={styles.tableCellText}>Código del Proyecto:</Text>
        </View>
        <View style={styles.tableColAuto}>
          <Text style={styles.tableCellTextBlue}>
            {data.codigoProyecto || "_________"}
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol25}>
          <Text style={styles.tableCellText}>Título de Proyecto:</Text>
        </View>
        <View style={styles.tableColAuto}>
          <Text style={styles.tableCellTextBlue}>
            {data.tituloProyecto || "_________"}
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol25}>
          <Text style={styles.tableCellText}>Departamento / Instituto:</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCellTextBlue}>
            {data.departamento || "_________"}
          </Text>
        </View>
      </View>

      {/* Fila de encabezado (títulos) */}
      <View style={styles.tableRow}>
        <View style={styles.tableCol50}>
          <Text style={styles.tableCellText}>Personal a trasladarse:</Text>
        </View>
        <View style={styles.tableCol50}>
          <Text style={styles.tableCellText}>Rol en el Proyecto:</Text>
        </View>
      </View>

      {/* Filas dinámicas generadas con map */}
      {data.participante.map((person, index) => (
        <View key={index} style={styles.tableRow}>
          <View style={styles.tableCol50}>
            <Text style={styles.tableCellTextBlueCenter}>
              {person.nombre || "_________"}
            </Text>
          </View>
          <View style={styles.tableCol50}>
            <Text style={styles.tableCellTextBlueCenter}>
              {person.rol || "_________"}
            </Text>
          </View>
        </View>
      ))}
    </View>

    {/* 2. Datos De la Salida de Campo */}
    <View style={styles.sectionTitle}>
      <Text>2. DATOS DE LA SALIDA DE CAMPO Y DE MUESTREO</Text>
    </View>
    <View style={styles.subSectionTitle}>
      <Text>Complete según corresponda la siguiente información</Text>
    </View>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={styles.tableCol25}>
          <Text style={styles.tableCellText}>Lugar de la movilización:</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCellTextBlue}>
            {data.ciudad || "_________"}
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCol25}>
          <Text style={styles.tableCellText}>Fecha de movilización:</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.baseText}>
            {"Inicio: "}
            <Text style={styles.tableCellTextBlue}>
              {data.fechaInicioViaje || "_________"}
            </Text>
          </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.baseText}>
            {"Fin: "}
            <Text style={styles.tableCellTextBlue}>
              {data.fechaFinViaje || "_________"}
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>
                Solicita:
              </Text>
            </View>

            <View style={styles.tableCol}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol40}>
                  <Text style={styles.tableCellText}>- Pasajes aéreos:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.baseText}>
                    {"( "}
                    <Text style={styles.tableCellTextBlue}>
                      {data.pasajesAereos ===
                      "SI"
                        ? "X"
                        : ""}
                      <Text style={styles.baseText}>{" )"}</Text>
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={styles.tableRow}>
                <View style={styles.tableCol40}>
                  <Text style={styles.tableCellText}>
                    - Viáticos y subsistencias:
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.baseText}>
                    {"( "}
                    <Text style={styles.tableCellTextBlue}>
                      {data.viaticosSubsistencias ===
                      "SI"
                        ? "X"
                        : ""}
                      <Text style={styles.baseText}>{" )"}</Text>
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
    </View>

    {/* 3. Actividades */}
    <View style={styles.sectionTitle}>
      <Text>3. ACTIVIDADES DE LA SALIDA DE CAMPO, DE MUESTREO Y/O VIAJE TÉCNICO</Text>
    </View>
    <View style={styles.subSectionTitle}>
      <Text>Complete según corresponda la siguiente información</Text>
    </View>

    {/* Encabezado de la tabla de actividades */}
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={styles.tableCol25}>
          <Text style={styles.tableCellText}>Fecha:</Text>
        </View>
        <View style={styles.tableCol75}>
          <Text style={styles.tableCellText}>Actividad:</Text>
        </View>
      </View>

      {/* Filas dinámicas de la tabla de actividades */}
      {data.actividadesInmutables.map((activity, index) => (
        <View key={index} style={styles.tableRow}>
          <View style={styles.tableCol25}>
            <Text style={styles.tableCellTextBlue}>
              {activity.fecha || "_________"}
            </Text>
          </View>
          <View style={styles.tableCol75}>
            <Text style={styles.tableCellTextBlue}>
              {activity.descripcion || "_________"}
            </Text>
          </View>
        </View>
      ))}
    </View>

    {/* 4. Objetivo del Proyecto */}
    <View style={styles.sectionTitle}>
      <Text>4. PRODUCTOS DE LA SALIDA DE CAMPO Y DE MUESTREO</Text>
    </View>
    <View style={styles.subSectionTitle}>
      <Text>Complete según corresponda la siguiente información</Text>
    </View>
    
    <Text style={styles.tableCellTextBlue}>
      {data.objetivoViaje || "_________"}
    </Text>
      

    {/* Firma del Solicitante */}
    <Text style={styles.baseText}>Firma del Solicitante:</Text>
    <Text>{"\n\n\n"}</Text>
    <Text>________________________</Text>
    <Text style={styles.tableCellTextBlue}>
      {data.nombreDirector || "_________"}
    </Text>

    {/* Firma del Director */}
    <Text style={styles.tableCellTextBlue}>
      Director del Proyecto {data.codigoProyecto || "_________"}
    </Text>
  </Page>
</PDFDocument>

  );

  // Convertir el documento PDF a un Blob
  const blob = await pdf(MyPDFDocument).toBlob();

  // Descargar automáticamente el archivo PDF
  saveAs(blob, "Anexo7_Formulario_Salida_Campo.pdf");
}

//formatear la fecha en formato dd/mm/yyyy
function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
