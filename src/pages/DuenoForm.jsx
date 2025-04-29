import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getDuenoById, createDueno, updateDueno } from '../api/duenos';

function DuenoForm() {
  const { id } = useParams()
  const navigate = useNavigate();

  const [duenoData, setDuenoData] = useState({
    identificacion: '',
    nombreCompleto: '',
    direccion: '',
    telefono: '',
    correo: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchDueno() {
      if (id) {
        setLoading(true);
        try {
          const response = await getDuenoById(id);
          setDuenoData(response.data);
        } catch (error) {
          console.error('Error al cargar datos del dueño:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchDueno();
  }, [id]);

  const handleChange = (e) => {
    setDuenoData({
      ...duenoData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (id) {
        await updateDueno(id, duenoData);
      } else {
        await createDueno({
          ...duenoData,
          id: duenoData.identificacion,
        });
      }
      navigate('/duenos');
    } catch (error) {
      console.error('Error al guardar dueño:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {id ? 'Editar Dueño' : 'Nuevo Dueño'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre Completo"
          name="nombreCompleto"
          value={duenoData.nombreCompleto}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        {!id && (
          <TextField
            label="Cédula o RUC"
            name="identificacion"
            value={duenoData.identificacion}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
        )}

        <TextField
          label="Dirección"
          name="direccion"
          value={duenoData.direccion}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Teléfono"
          name="telefono"
          value={duenoData.telefono}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Correo Electrónico"
          name="correo"
          type="email"
          value={duenoData.correo}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/duenos')}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default DuenoForm;
