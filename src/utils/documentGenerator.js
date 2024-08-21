import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { generate } from "@pdfme/generator";
import { text, image, barcodes } from "@pdfme/schemas";

//basepdf and schemas AnexoA
import { basePdfAnexoA } from "./basePdfAnexoA";
import { schemasAnexoA } from "./schemasAnexoA";

//Constantes
const today = new Date();
const day = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados, por lo que se suma 1
const year = today.getFullYear();
const formattedDate = `${day}/${month}/${year}`;

export function generateMemorandum(data) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Formato de memorando",
                bold: true,
                size: 24,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 300 },
            alignment: "start",
          }),
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
          new Paragraph({
            children: [
              new TextRun({
                text: "\t\tVicerector de Investigación, Innovación y Vinculación",
                size: 22,
                bold: true,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "ASUNTO:\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: "Solicitud dentro de proyecto, de auspicio para movilidad al exterior para participar en evento académico",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `En mi calidad de Director del Proyecto ${data.codigoProyecto}, AUTORIZO EL GASTO y solicito a usted se realicen las gestiones correspondientes para participar en el Evento titulado "${data.tituloEvento}" a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. Para lo cual, adjunto los correspondientes documentos.`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
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
          new Paragraph({
            children: [
              new TextRun({
                text: data.nombres.toUpperCase() +" " + data.apellidos.toUpperCase(),
                size: 20,
                bold: true,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 100 },
          }),
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

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "Memorando " + data.codigoProyecto + ".docx");
  });
}

// Nueva función para generar el Anexo A en PDF
export async function generateAnexoA(data) {
  const template = {
    schemas: schemasAnexoA,
    basePdf: basePdfAnexoA,
  };
  const ultimaFechaLlegada =
    data.transporte.length > 0
      ? data.transporte[data.transporte.length - 1]?.fechaLlegada
      : "";
  const ultimaHoraLlegada =
    data.transporte.length > 0
      ? data.transporte[data.transporte.length - 1]?.horaLlegada
      : "";
  var ponentciaText = "";
  if (data.tituloPonencia && data.tituloPonencia.trim() !== "" && data.tituloPonencia.trim() !== "No aplica") {
    ponentciaText = "Para la participacion de la ponencia '" + data.tituloPonencia + "'";
} else {
    ponentciaText = "";
}
  const plugins = { text, image, qrcode: barcodes.qrcode };
  const inputs = [
    {
      numSolicitud: "",
      fechaSolicitud: formattedDate,
      nombresCompletos:
        data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      lugar: data.ciudadEvento + ", " + data.paisEvento,
      puesto: data.cargo,
      unidadPerteneciente: data.departamento,

      fechaSalida: formatDate(data.transporte[0]?.fechaSalida),
      fechaLlegada: formatDate(ultimaFechaLlegada),
      horaSalida: data.transporte[0]?.horaSalida,
      horaLlegada: ultimaHoraLlegada,
      servidores:
        data.apellidos.toUpperCase() +
        " " +
        data.nombres.toUpperCase() +
        data.servidores.toUpperCase(),
      actividades:
        "Dentro de las actividades del proyecto  " +
        data.codigoProyecto +
        " titulado  '" +
        data.tituloProyecto +
        "'  se llevará a cabo la participación en el evento  '" +
        data.tituloEvento +
        "', que tendrá lugar del  " +
        data.fechaInicioEvento +
        "  al  " +
        data.fechaFinEvento +
        " en la ciudad de  " +
        data.ciudadEvento +
        "," +
        data.paisEvento +
        ". " +
        ponentciaText,

      transporteTipo1: data.transporte[0]?.tipoTransporte || "",
      transporteRuta1: data.transporte[0]?.ruta || "",
      transporteNombre1: data.transporte[0]?.nombreTransporte || "",
      transporteFechaS1: formatDate(data.transporte[0]?.fechaSalida) || "",
      transporteFechaL1: formatDate(data.transporte[0]?.fechaLlegada) || "",
      transporteFechaSH1: data.transporte[0]?.horaSalida || "",
      transporteFechaLH1: data.transporte[0]?.horaLlegada || "",

      transporteTipo2: data.transporte[1]?.tipoTransporte || "",
      transporteRuta2: data.transporte[1]?.ruta || "",
      transporteNombre2: data.transporte[1]?.nombreTransporte || "",
      transporteFechaS2: formatDate(data.transporte[1]?.fechaSalida) || "",
      transporteFechaL2: formatDate(data.transporte[1]?.fechaLlegada) || "",
      transporteFechaLH2: data.transporte[1]?.horaLlegada || "",
      transporteFechaSH2: data.transporte[1]?.horaSalida || "",

      transporteTipo3: data.transporte[2]?.tipoTransporte || "",
      transporteRuta3: data.transporte[2]?.ruta || "",
      transporteNombre3: data.transporte[2]?.nombreTransporte || "",
      transporteFechaS3: formatDate(data.transporte[2]?.fechaSalida) || "",
      transporteFechaL3: formatDate(data.transporte[2]?.fechaLlegada) || "",
      transporteFechaSH3: data.transporte[2]?.horaSalida || "",
      transporteFechaLH3: data.transporte[2]?.horaLlegada || "",

      transporteTipo4: data.transporte[3]?.tipoTransporte || "",
      transporteRuta4: data.transporte[3]?.ruta || "",
      transporteNombre4: data.transporte[3]?.nombreTransporte || "",
      transporteFechaS4: formatDate(data.transporte[3]?.fechaSalida) || "",
      transporteFechaL4: formatDate(data.transporte[3]?.fechaLlegada) || "",
      transporteFechaLH4: data.transporte[3]?.horaLlegada || "",
      transporteFechaSH4: data.transporte[3]?.horaSalida || "",

      banco: data.nombreBanco,
      viaticos: data.viaticosSubsistencias === "SI" ? "X" : "",
      movilizacion: data.movilizacion === "SI" ? "X" : "",
      subsistencias: data.viaticosSubsistencias === "SI" ? "X" : "",
      alimentacion: data.alimentacion === "SI" ? "X" : "",
      bancoTipoCuenta: data.tipoCuenta,
      numeroCuenta: data.numeroCuenta,
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
function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}
