import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { generate } from "@pdfme/generator";
import { text, image, barcodes } from "@pdfme/schemas";

import {basePdfAnexo10} from "./basePdfAnexo10";
import {schemasAnexo10} from "./schemasAnexo10";
//Constantes
const today = new Date();
const day = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados, por lo que se suma 1
const year = today.getFullYear();
const formattedDate = `${day}/${month}/${year}`;

export async function generateAnexo10NationalOutsideProject(data){

    const template={
        schemas: schemasAnexo10,
        basePdf: basePdfAnexo10,
    };

    const plugins = { text, image, qrcode: barcodes.qrcode };
    
    let valorInscripcionStr = "";
   let fechaPagoInscripcionStr = "";
     
   if (data && data.inscripciones && Array.isArray(data.inscripciones)) {
     data.inscripciones.forEach((inscripcion) => {
       if (data.inscripcion === "SI") {
         if (inscripcion.valorInscripcion) {
           valorInscripcionStr += `${inscripcion.monedaPago} ${inscripcion.valorInscripcion}\n`;
         }
   
         if (inscripcion.pagoLimite && inscripcion.limiteFecha) {
           fechaPagoInscripcionStr += `${inscripcion.pagoLimite} ${inscripcion.limiteFecha}\n`;
         }
       } else if (data.inscripcion === "NO") {
         // Manejo del caso en que data.inscripcion es "NO"
         valorInscripcionStr += '\n';
         fechaPagoInscripcionStr += '\n';
       }
     });
   }    
    
    const inputs = [
    {
      "nombresApellidos":               data.nombres.toUpperCase()+" "+data.apellidos.toUpperCase(),
      "fechaPedido":                    "",
      "departamento":                   data.departamento,
      "tituloEvento":                   data.tituloEvento,
      "ciudadPaisEvento":               data.ciudadEvento+ ", Ecuador",
      "fechaInicioEvento":              data.fechaInicioEvento,
      "fechaFinEvento":                 data.fechaFinEvento,
      "RelevanciaAcademica":            data.RelevanciaAcademica,
      "tituloPonencia":                 data.tituloPonencia,
      "tipoPonencia":                   data.tipoPonencia,
      "detalleArticuloSI":              data.detalleArticuloSI,
      "articuloPublicadoSi":            data.articuloPublicado==="SI" ? "X":"",
      "articuloPublicadoNo":            data.articuloPublicado==="NO" ? "X":"",
      "pasajesAereosSi":                data.pasajesAereos==="SI" ? "X":"",
      "pasajesAereosNo":                data.pasajesAereos==="NO" ? "X":"",
      "viaticosSubsistenciasSi":        data.viaticosSubsistencias==="SI"? "X": "",
      "viaticosSubsistenciasNo":        data.viaticosSubsistencias==="NO"? "X": "",
      "inscripcionSi":                  data.inscripcion==="SI"?"X":"",
      "inscripcionNo":                  data.inscripcion==="NO"?"X":"",
      "valorInscripcion":               valorInscripcionStr.trim(),
      "pagoLimiteFecha":                fechaPagoInscripcionStr.trim(),
      "metodoPagoTransferencia":        data.metodoPago==="Transferencia"? "X":"",
      "metodoPagoOtra":                 data.metodoPago==="Otra"? "X":"",
      "nombresAp":                      data.nombres.toUpperCase()+" "+data.apellidos.toUpperCase(),
      "departament":                    data.puesto.toUpperCase()
    }
  ];
  
    const pdf = await generate({ template, plugins, inputs });
  
    saveAs(
        blob,
        "Anexo 10 - Formulario salidas nacionales fuera de proyecto EPN.pdf"
      );

}