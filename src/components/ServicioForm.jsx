import { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, CircularProgress } from '@mui/material';
import { getServicios } from '../api/servicios';
import { getTiposMedicamento } from '../api/tiposMedicamento';

function ServicioForm({ idCita, onCancel, onSave }) {
  const [servicioId, setServicioId] = useState('');
  const [tipoMedicamentoId, setTipoMedicamentoId] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [servicios, setServicios] = useState([]);
  const [tiposMedicamento, setTiposMedicamento] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [serviciosRes, tiposMedicamentoRes] = await Promise.all([
          getServicios(),
          getTiposMedicamento()
        ]);
        setServicios(serviciosRes.data);
        setTiposMedicamento(tiposMedicamentoRes.data);
      } catch (error) {
        console.error('Error al cargar servicios o tipos de medicamento:', error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const detalleServicio = {
        idCita,
        idServicio: servicioId,
        idTipoMedicamento: tipoMedicamentoId || null,
        observaciones,
      };
      await onSave(detalleServicio);
    } catch (error) {
      console.error('Error al guardar detalle del servicio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="select-servicio-label">Servicio</InputLabel>
        <Select
          labelId="select-servicio-label"
          value={servicioId}
          label="Servicio"
          onChange={(e) => setServicioId(e.target.value)}
          required
        >
          {servicios.map((servicio) => (
            <MenuItem key={servicio.id} value={servicio.id}>
              {servicio.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="select-tipo-medicamento-label">Tipo de Medicamento (opcional)</InputLabel>
        <Select
          labelId="select-tipo-medicamento-label"
          value={tipoMedicamentoId}
          label="Tipo de Medicamento"
          onChange={(e) => setTipoMedicamentoId(e.target.value)}
        >
          <MenuItem value="">Ninguno</MenuItem>
          {tiposMedicamento.map((tipo) => (
            <MenuItem key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Observaciones"
        multiline
        rows={3}
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
        fullWidth
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading || !servicioId}>
          {loading ? <CircularProgress size={24} /> : 'Guardar'}
        </Button>
      </Box>
    </Box>
  );
}

export default ServicioForm;