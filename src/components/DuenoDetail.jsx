import { useState, useEffect } from 'react';
import { Card, CardContent, Box, Typography, Button, Divider, List, ListItem, ListItemButton, ListItemText, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { getMascotasByDuenoId } from '../api/mascotas';
function DuenoDetail({ dueno }) {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMascotas() {
      try {
        const response = await getMascotasByDuenoId(dueno.id);
        setMascotas(response.data);
      } catch (error) {
        console.error('Error al cargar mascotas del dueño:', error);
      } finally {
        setLoading(false);
      }
    }

    if (dueno) {
      fetchMascotas();
    }
  }, [dueno]);
  if (!dueno) return null;

  return (
    <Card sx={{ maxWidth: 700, margin: '0 auto', p: 2 }}>
      <CardContent>
        
        <Typography variant="h4" gutterBottom align="center">
          {dueno.nombreCompleto}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/duenos/edit/${dueno.id}`)}
            sx={{ mb: 2 }}
          >
            Editar
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Número de Identificación:
          </Typography>
          <Typography variant="body1">
            {dueno.id || 'No disponible'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Dirección:
          </Typography>
          <Typography variant="body1">
            {dueno.direccion || 'No disponible'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Teléfono:
          </Typography>
          <Typography variant="body1">
            {dueno.telefono || 'No disponible'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" color="textSecondary">
            Correo electrónico:
          </Typography>
          <Typography variant="body1">
            {dueno.correo || 'No disponible'}
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Mascotas:</Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : mascotas.length > 0 ? (
            <List>
              {mascotas.map((mascota) => (
                <ListItem key={mascota.id} disablePadding>
                  <ListItemButton onClick={() => navigate(`/mascotas?selectedMascota=${mascota.id}`)}>
                    <ListItemText primary={mascota.nombre} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">No tiene mascotas registradas.</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default DuenoDetail;
