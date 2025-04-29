import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateReport({ cita, mascota, dueno, detalleServicio, especie, raza, sexo, profesional, servicio }) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Reporte de Servicio - Atención Canina', 20, 20);

  doc.setFontSize(14);
  doc.text('Datos de la Cita:', 20, 40);
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date(cita.fechaHora).toLocaleDateString()}`, 20, 50);
  doc.text(`Hora: ${new Date(cita.fechaHora).toLocaleTimeString()}`, 20, 60);
  doc.text(`Estado: ${cita.estado}`, 20, 70);
  doc.text(`Motivo: ${cita.motivo}`, 20, 80);
  doc.text(`Profesional: ${profesional.nombreCompleto}`, 20, 90);

  doc.setFontSize(14);
  doc.text('Datos del Cliente:', 20, 110);
  doc.setFontSize(12);
  doc.text(`Nombre: ${dueno.nombreCompleto}`, 20, 120);
  doc.text(`Identificación: ${dueno.id}`, 20, 130);
  doc.text(`Dirección: ${dueno.direccion}`, 20, 140);
  doc.text(`Teléfono: ${dueno.telefono}`, 20, 150);

  doc.setFontSize(14);
  doc.text('Datos de la Mascota:', 20, 170);
  doc.setFontSize(12);
  doc.text(`Nombre: ${mascota.nombre}`, 20, 180);
  doc.text(`Especie: ${especie.nombre}`, 20, 190);
  doc.text(`Raza: ${raza.nombre}`, 20, 200);
  doc.text(`Sexo: ${sexo.nombre}`, 20, 210);

  doc.setFontSize(14);
  doc.text('Detalle del Servicio:', 20, 230);
  doc.setFontSize(12);
  doc.text(`Servicio: ${servicio.nombre}`, 20, 240);
  doc.text(`Tipo de Medicamento: ${detalleServicio.tipoMedicamento || 'Ninguno'}`, 20, 250);
  doc.text(`Observaciones: ${detalleServicio.observaciones || 'Sin observaciones'}`, 20, 260);

  const fileName = `reporte_${mascota.nombre}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
