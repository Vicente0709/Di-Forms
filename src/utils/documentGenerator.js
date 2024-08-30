import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { generate } from "@pdfme/generator";
import { text, image, barcodes } from "@pdfme/schemas";

//basepdf and schemas AnexoA
import { basePdfAnexoA } from "./basePdfAnexoA";
import { schemasAnexoA } from "./schemasAnexoA";
//basepdf and schemas AnexoA2
import { basePdfAnexoA2 } from "./basePdfAnexoA2";
import { schemasAnexoA2 } from "./schemasAnexoA2";

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
                text: `En mi calidad de Director del Proyecto ${data.codigoProyecto}, autorizo el gasto y solicito a usted se realicen las gestiones correspondientes para participar en el evento titulado "${data.tituloEvento}" a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. Para lo cual, adjunto los correspondientes documentos.`,
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
                text:
                  data.nombres.toUpperCase() +
                  " " +
                  data.apellidos.toUpperCase(),
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

export function generateMemoOutsideProject1(data){
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Formato de memorando para Jefe del Departamento al VIIV",
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
                text: "Solicitud de auspicio institucional y solicitud de autorización para viaje al exterior",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),new Paragraph({
            children: [
              new TextRun({
                text: "De mi consideración:",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Por medio del presente comunico a usted que, en mi calidad de ${data.cargoJefeInmediato}, se ha otorgado el aval y permiso al profesor(a) ${data.nombres} ${data.apellidos}, profesor titular adscrito al ${data.departamento}, para que participe en el evento " ${data.tituloEvento} " a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, del ${data.fechaInicioEvento} al ${data.fechaFinEvento}, para la presentación de la ponencia: " ${data.tituloPonencia} ". `,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Por lo expuesto, solicito muy comedidamente, se realicen los trámites pertinentes para que el profesor ${data.nombres} ${data.apellidos}, pueda participar en la conferencia antes mencionada y de igual forma se auspicie con presupuesto del Vicerrectorado de Investigación, Innovación y Vinculación, la asignación de viáticos y subsistencias al exterior, compra de pasajes aéreos y pago de inscripción.`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta la documentación correspondiente",
                bold: true,
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
                text: data.nombreJefeInmediato.toUpperCase(),
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
                text: data.cargoJefeInmediato.toUpperCase(),
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

export function generateMemoOutsideProject2(data){
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Formato de memorando del Profesor al Jefe",
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
                text: "Solicitud de auspicio institucional y solicitud de autorización para viaje al exterior",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),new Paragraph({
            children: [
              new TextRun({
                text: "De mi consideración:",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Por medio del presente solicito el  aval y permiso para participar en el evento " ${data.tituloEvento} " a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, del ${data.fechaInicioEvento} al ${data.fechaFinEvento}, para la presentación de la ponencia: " ${data.tituloPonencia} ". `,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Adicionalmente solicito se se realicen los trámites pertinentes para que se auspicie con presupuesto del Vicerrectorado de Investigación, Innovación y Vinculación, la asignación de viáticos y subsistencias al exterior, compra de pasajes aéreos y pago de inscripción.",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta la documentación correspondiente",
                bold: true,
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
                text:
                  data.nombres.toUpperCase() +
                  " " +
                  data.apellidos.toUpperCase(),
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
                text: "Profesor",
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
  if (
    data.tituloPonencia &&
    data.tituloPonencia.trim() !== "" &&
    data.tituloPonencia.trim() !== "No aplica"
  ) {
    ponentciaText =
      "Para la participacion de la ponencia '" + data.tituloPonencia + "'";
  } else {
    ponentciaText = "";
  }
  const plugins = { text, image, qrcode: barcodes.qrcode };
  const transporteInfo = {};
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
  for (let i = 0; i < 8; i++) {
    transporteInfo[`transporteTipo${i + 1}`] = data.transporte[i]?.tipoTransporte || "";
    transporteInfo[`transporteNombre${i + 1}`] = data.transporte[i]?.nombreTransporte || "";
    transporteInfo[`transporteRuta${i + 1}`] = data.transporte[i]?.ruta || "";
    transporteInfo[`transporteFechaS${i + 1}`] = formatDate(data.transporte[i]?.fechaSalida) || "";
    transporteInfo[`transporteFechaSH${i + 1}`] = data.transporte[i]?.horaSalida || "";
    transporteInfo[`transporteFechaL${i + 1}`] = formatDate(data.transporte[i]?.fechaLlegada) || "";
    transporteInfo[`transporteFechaLH${i + 1}`] = data.transporte[i]?.horaLlegada || "";
  }
  const inputs = [
    {
      "fechaSolicitud":     formattedDate,
      "viaticos":           data.viaticosSubsistencias === "SI" ? "X" : "",
      "movilizacion":       data.movilizacion === "SI" ? "X" : "",
      "subsistencias":      data.viaticosSubsistencias === "SI" ? "X" : "",
      "alimentacion":       data.alimentacion === "SI" ? "X" : "",
      "nombresCompletos":   data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      "lugar":              data.ciudadEvento + ", " + data.paisEvento,
      "puesto":             data.cargo,
      "unidadPerteneciente":data.departamento,

      "fechaSalida":        formatDate(data.transporte[0]?.fechaSalida),
      "horaSalida":         data.transporte[0]?.horaSalida,

      "fechaLlegada":       formatDate(ultimaFechaLlegada),
      "horaLlegada":        ultimaHoraLlegada,

      "servidores":         data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase() + data.servidores.toUpperCase(),

      "actividades": "Dentro de las actividades del proyecto  " +
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

      ...transporteInfo,

      "banco": data.nombreBanco,
      "bancoTipoCuenta": data.tipoCuenta,
      "numeroCuenta": data.numeroCuenta,

      "nombresCompletos2": data.nombres.toUpperCase() +
      " " +
      data.apellidos.toUpperCase() +
      "\n" +
      data.cargo.toUpperCase() +
      "\n" +
      data.cedula,

      "nombresCompletosJefeInmediato": data.nombreJefeInmediato.toUpperCase() +
      "\n" +
      data.cargoJefeInmediato.toUpperCase()
    }
  ];
  
  
  
  
  const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  saveAs(
    blob,
    "Anexo 1 - Solicitud de viáticos EPN " + data.codigoProyecto + ".pdf"
  );
}
// Nueva función para generar el Anexo A2 en PDF
export async function generateAnexoA2(data) {
  const template = {
    schemas: schemasAnexoA2,
    basePdf: basePdfAnexoA2,
  };
  const plugins = { text, image, qrcode: barcodes.qrcode };
  const diferencia = JSON.parse(localStorage.getItem("diferenciaDias"))?.diferencia || 0;
  const actividades = {};

  // Genera dinámicamente las propiedades para activN, activFecha, y activDescripcion
  for (let i = 0; i < 22; i++) {
    actividades[`activN${i + 1}`] = (data.actividadesInmutables[i] && diferencia > 15) ? (i + 1).toString() : "";
    actividades[`activFecha${i + 1}`] = diferencia < 16 ? "" : data.actividadesInmutables[i]?.fecha || "";
    actividades[`activDescripcion${i + 1}`] = diferencia < 16 ? "" : data.actividadesInmutables[i]?.descripcion || "";
  }
  let valorInscripcionStr = "";
  let fechaPagoInscripcionStr = "";

  // Iteramos sobre cada inscripción en el array 'inscripciones'
  data.inscripciones.forEach((inscripcion) => {
    // Concatenamos el valor de inscripción con un '$' y un salto de línea
    if (inscripcion.valorInscripcion) {
      valorInscripcionStr += `$${inscripcion.valorInscripcion}\n`;
    }

    // Construimos la cadena de la fecha de pago dependiendo de cuál campo tiene valor
    if (inscripcion.antesDeFecha) {
      fechaPagoInscripcionStr += `antes de ${formatDate(inscripcion.antesDeFecha)}\n`;
    } else if (inscripcion.despuesDeFecha) {
      fechaPagoInscripcionStr += `después de ${formatDate(inscripcion.despuesDeFecha)}\n`;
    } else if (inscripcion.limiteFecha) {
      fechaPagoInscripcionStr += `${formatDate(inscripcion.limiteFecha)}\n`;
    }
  });
  

  const inputs = [
    {
      "fechaPag1": formattedDate,
      "codigoProyecto": data.codigoProyecto,
      "tituloProyecto": data.tituloProyecto,
      "nombresParticipante":  data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      "rolProyecto": data.rolEnProyecto,
      "departamento": data.departamento,
      "tituloEvento": data.tituloEvento,
      "ciudad": data.ciudadEvento.toUpperCase(),
      "pais": data.paisEvento.toUpperCase(),
      "fechasEvento":  "Desde el " + data.fechaInicioEvento + " hasta el " + data.fechaFinEvento,
      "tipoEvento1": data.tipoEvento === "Conferencia o congreso" ? "X" : "",
      "tipoEvento2": data.tipoEvento === "Taller" ? "X" : "",
      "tipoEvento3": data.tipoEvento === "Otro evento académico" ? "X" : "",
      "tipoEvento3otro": data.otroEventoEspecificar,
      "participacion1":  data.participacionEvento === "Presentación de artículo indexado"? "X": "",
      "participacion2": data.participacionEvento === "Presentación de póster, abstract, charla magistral u otros" ? "X": "",
      "participacion3": data.participacionEvento === "Asistencia" ? "X" : "",
      "ponencia": data.tituloPonencia,
      "pasajesS": data.pasajesAereos === "SI" ? "X" : "",
      "viaticosS": data.viaticosSubsistencias === "SI" ? "X" : "",
      "inscripcionS": data.inscripcion === "SI" ? "X" : "",
      "pasajesN": data.pasajesAereos === "NO" ? "X" : "",
      "viaticosN": data.viaticosSubsistencias === "NO" ? "X" : "",
      "inscripciónN": data.inscripcion === "NO" ? "X" : "",

      "fechaPag2": formattedDate,
      "objetivoEvento": data.objetivoProyecto,
      "relevanciaEvento": data.relevanciaEvento,

      "valorInscripcion": valorInscripcionStr.trim(), // Removemos el último salto de línea
      "fechaPagoInscripcion": fechaPagoInscripcionStr.trim(), // Removemos el último salto de línea


      "transferencia": data.metodoPago === "Transferencia" ? "X" : "",
      "otroPago": data.metodoPago === "Otra" ? "X" : "",
      "hospedajeS": data.hospedaje === "SI" ? "X" : "",
      "hospedajeN": data.hospedaje === "NO" ? "X" : "",
      "movS": data.movilizacion === "SI" ? "X" : "",
      "movN": data.movilizacion === "NO" ? "X" : "",
      "alimentacionS": data.alimentacion === "SI" ? "X" : "",
      "alimentacionN": data.alimentacion === "NO" ? "X" : "",
      "declaraciónN": data.seleccionDeclaracion === "noCubre" ? "X" : "",
      "declaracioneS": data.seleccionDeclaracion === "siCubre" ? "X" : "",

      "fechaPag3": formattedDate,

      ...actividades,

      "justificacionMas15":diferencia < 16 ? "No aplica" :data.justificacionComision,
      "fechaSolicitud": formattedDate,
      "nombreDirector":  data.nombres.toUpperCase()+ " "+data.apellidos.toUpperCase(),
      "codigoProyecto2": data.codigoProyecto,

      "fechaPag4": formattedDate,
      "calculo": "Calculo dias de comision entre las fechas de salida y de regreso: " + diferencia
    }
  ];

  const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  saveAs(
    blob,
    "Anexo 2a-Participación en EVENTO dentro de Proyecto " +
      data.codigoProyecto +
      ".pdf"
  );
}

export async function generateAnexoAOutsideProject(data){
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
  if (
    data.tituloPonencia &&
    data.tituloPonencia.trim() !== "" &&
    data.tituloPonencia.trim() !== "No aplica"
  ) {
    ponentciaText =
      "Para la participacion de la ponencia '" + data.tituloPonencia +"' del tipo "+ data.tipoPonencia;
  } else {
    ponentciaText = "";
  }
  const plugins = { text, image, qrcode: barcodes.qrcode };
  const transporteInfo = {};
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
  for (let i = 0; i < 8; i++) {
    transporteInfo[`transporteTipo${i + 1}`] = data.transporte[i]?.tipoTransporte || "";
    transporteInfo[`transporteNombre${i + 1}`] = data.transporte[i]?.nombreTransporte || "";
    transporteInfo[`transporteRuta${i + 1}`] = data.transporte[i]?.ruta || "";
    transporteInfo[`transporteFechaS${i + 1}`] = formatDate(data.transporte[i]?.fechaSalida) || "";
    transporteInfo[`transporteFechaSH${i + 1}`] = data.transporte[i]?.horaSalida || "";
    transporteInfo[`transporteFechaL${i + 1}`] = formatDate(data.transporte[i]?.fechaLlegada) || "";
    transporteInfo[`transporteFechaLH${i + 1}`] = data.transporte[i]?.horaLlegada || "";
  }
  const inputs = [
    {
      "fechaSolicitud":     formattedDate,
      "viaticos":           data.viaticosSubsistencias === "SI" ? "X" : "",
      "movilizacion":       data.viaticosSubsistencias === "SI" ? "X" : "",
      "subsistencias":      data.viaticosSubsistencias === "SI" ? "X" : "",
      "alimentacion":       data.viaticosSubsistencias === "SI" ? "X" : "",
      "nombresCompletos":   data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      "lugar":              data.ciudadEvento + ", " + data.paisEvento,
      "puesto":             data.puesto,
      "unidadPerteneciente":data.departamento,

      "fechaSalida":        formatDate(data.transporte[0]?.fechaSalida),
      "horaSalida":         data.transporte[0]?.horaSalida,

      "fechaLlegada":       formatDate(ultimaFechaLlegada),
      "horaLlegada":        ultimaHoraLlegada,

      "servidores":         data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase() + data.servidores.toUpperCase(),

      "actividades": "Dentro de las actividades " +
       " se llevará a cabo la participación en el evento  '" +
      data.tituloEvento +
      "', que tendrá lugar del  " +
      data.fechaInicioEvento +
      "  al  " +
      data.fechaFinEvento +
      " en la ciudad de  " +
      data.ciudadEvento +
      ", " +
      data.paisEvento +
      ". " +
      ponentciaText,

      ...transporteInfo,

      "banco": data.nombreBanco,
      "bancoTipoCuenta": data.tipoCuenta,
      "numeroCuenta": data.numeroCuenta,

      "nombresCompletos2": data.nombres.toUpperCase() +
      " "+
      data.apellidos.toUpperCase() +
      "\n" +
      data.puesto.toUpperCase() +
      "\n" +
      data.cedula,

      "nombresCompletosJefeInmediato": data.nombreJefeInmediato.toUpperCase() +
      "\n" +
      data.cargoJefeInmediato.toUpperCase()
    }
  ];
  
  
  
  
  const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  saveAs(
    blob,
    "Anexo 1 - Solicitud de viáticos EPN " + data.codigoProyecto + ".pdf"
  );
}


//formatear la fecha en formato dd/mm/yyyy
function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}
