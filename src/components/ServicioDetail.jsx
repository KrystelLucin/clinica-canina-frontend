import { useState, useEffect } from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { getDuenoById } from '../api/duenos';
import { generateReport } from '../utils/generateReport';
import { getTipoMedicamentoById } from '../api/tiposMedicamento';
import { getServicioById } from '../api/servicios';
import { getEspecieById } from '../api/especies';
import { getRazaById } from '../api/razas';
import { getSexoById } from '../api/sexos';
import { getProfesionalById } from '../api/profesionales';

function ServicioDetail({cita, detalleServicio, mascota }) {
  const [nombreServicio, setNombreServicio] = useState('No disponible');
  const [nombreTipoMedicamento, setNombreTipoMedicamento] = useState('Ninguno');

  useEffect(() => {
    async function fetchData() {
      try {
        if (detalleServicio?.idServicio) {
          const servicioRes = await getServicioById(detalleServicio.idServicio);
          setNombreServicio(servicioRes.data.nombre);
        }
        if (detalleServicio?.idTipoMedicamento) {
          const tipoMedicamentoRes = await getTipoMedicamentoById(detalleServicio.idTipoMedicamento);
          setNombreTipoMedicamento(tipoMedicamentoRes.data.nombre);
        }
      } catch (error) {
        console.error('Error al cargar servicio o tipo de medicamento:', error);
      }
    }

    fetchData();
  }, [detalleServicio]);

  const handleGenerarReporte = async () => {
    try {
      const duenoResponse = await getDuenoById(mascota.idDueno);
      const dueno = duenoResponse.data;
  
      const [especieRes, razaRes, sexoRes] = await Promise.all([
        getEspecieById(mascota.idEspecie),
        getRazaById(mascota.idRaza),
        getSexoById(mascota.idSexo)
      ]);
  
      const [profesionalRes, servicioRes] = await Promise.all([
        getProfesionalById(cita.idProfesional),
        getServicioById(cita.idServicio)
      ]);
  
      const datosCompletos = {
        cita,
        mascota,
        dueno,
        detalleServicio,
        especie: especieRes.data,
        raza: razaRes.data,
        sexo: sexoRes.data,
        profesional: profesionalRes.data,
        servicio: servicioRes.data
      };
  
      await generateReport(datosCompletos);
  
    } catch (error) {
      console.error('Error al generar el reporte completo:', error);
    }
  };
  

  return (
    <Box>
      <Typography variant="h6" align="center" gutterBottom>
        Detalle del Servicio
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="textSecondary">
          Servicio:
        </Typography>
        <Typography variant="body1">
          {nombreServicio || 'No disponible'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="textSecondary">
          Tipo de Medicamento:
        </Typography>
        <Typography variant="body1">
          {nombreTipoMedicamento || 'Ninguno'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="textSecondary">
          Observaciones:
        </Typography>
        <Typography variant="body1">
          {detalleServicio.observaciones || 'Sin observaciones'}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleGenerarReporte}
        sx={{ mt: 3 }}
      >
        Generar Reporte
      </Button>
    </Box>
  );
}

export default ServicioDetail;