import { useState, useEffect } from 'react';
import { Box, Typography, Divider, CircularProgress } from '@mui/material';
import { getProfesionalById } from '../api/profesionales';

function CitaDetail({ cita }) {
  const [profesional, setProfesional] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfesional() {
      try {
        const response = await getProfesionalById(cita.idProfesional);
        setProfesional(response.data);
      } catch (error) {
        console.error('Error al cargar profesional:', error);
      } finally {
        setLoading(false);
      }
    }

    if (cita?.idProfesional) {
      fetchProfesional();
    }
  }, [cita]);

  if (!cita) return null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Detalle de la Cita
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle1" color="textSecondary">
        Fecha:
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {new Date(cita.fechaHora).toLocaleDateString()}
      </Typography>

      <Typography variant="subtitle1" color="textSecondary">
        Hora:
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {new Date(cita.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Typography>

      <Typography variant="subtitle1" color="textSecondary">
        Profesional a cargo:
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {profesional?.nombreCompleto || 'No disponible'}
      </Typography>

      <Typography variant="subtitle1" color="textSecondary">
        Motivo:
      </Typography>
      <Typography variant="body1">
        {cita.motivo || 'No especificado'}
      </Typography>
    </Box>
  );
}

export default CitaDetail;