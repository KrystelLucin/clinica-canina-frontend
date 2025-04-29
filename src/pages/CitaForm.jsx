import { useState, useEffect } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Divider, CircularProgress } from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useParams } from 'react-router-dom';
import { getServicios, createDetalleServicio, updateDetalleServicio } from '../api/servicios';
import { getMascotas } from '../api/mascotas';
import { getProfesionales } from '../api/profesionales';
import { getTiposMedicamento } from '../api/tiposMedicamento';
import { getCitaById, createCita, updateCita } from '../api/citas';

function CitaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formularioCita, setFormularioCita] = useState({
    idMascota: '',
    idServicio: '',
    fecha: null,
    hora: null,
    idProfesional: '',
    motivo: '',
  });

  const [detalleServicio, setDetalleServicio] = useState({
    idServicio: '',
    idTipoMedicamento: '',
    observaciones: '',
  });

  const [servicios, setServicios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [tiposMedicamento, setTiposMedicamento] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const modoEdicion = Boolean(id);

  useEffect(() => {
    async function fetchData() {
      try {
        const [serviciosRes, mascotasRes, profesionalesRes, tiposMedicamentoRes] = await Promise.all([
          getServicios(),
          getMascotas(),
          getProfesionales(),
          getTiposMedicamento()
        ]);
        setServicios(serviciosRes.data);
        setMascotas(mascotasRes.data);
        setProfesionales(profesionalesRes.data);
        setTiposMedicamento(tiposMedicamentoRes.data);

        if (modoEdicion) {
          setLoading(true);
          const citaRes = await getCitaById(id);
          const fechaHora = new Date(citaRes.data.fechaHora);
          setFormularioCita({
            idMascota: citaRes.data.idMascota,
            idServicio: citaRes.data.idServicio,
            fecha: fechaHora,
            hora: fechaHora,
            idProfesional: citaRes.data.idProfesional,
            motivo: citaRes.data.motivo,
          });
          if (citaRes.data.estado === 'Confirmada' && citaRes.data.detalleServicio) {
            setDetalleServicio({
              idDetalleServicio: citaRes.data.detalleServicio.id,
              idServicio: citaRes.data.detalleServicio.idServicio,
              idTipoMedicamento: citaRes.data.detalleServicio.idTipoMedicamento || '',
              observaciones: citaRes.data.detalleServicio.observaciones || '',
            });
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    }

    fetchData();
  }, [id, modoEdicion]);

  const handleChangeCita = (e) => {
    setFormularioCita({ ...formularioCita, [e.target.name]: e.target.value });
  };

  const handleChangeDetalleServicio = (e) => {
    setDetalleServicio({ ...detalleServicio, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const fechaHoraUnificada = new Date(
      formularioCita.fecha.getFullYear(),
      formularioCita.fecha.getMonth(),
      formularioCita.fecha.getDate(),
      formularioCita.hora.getHours(),
      formularioCita.hora.getMinutes()
    );

    const datosCita = {
      idMascota: formularioCita.idMascota,
      idServicio: formularioCita.idServicio,
      fechaHora: fechaHoraUnificada.toISOString(),
      idProfesional: formularioCita.idProfesional,
      motivo: formularioCita.motivo,
      estado: 'Pendiente',
    };

    try {
      let citaGuardada;

      if (modoEdicion) {
        await updateCita(id, datosCita);
        citaGuardada = { id };
      } else {
        const response = await createCita(datosCita);
        citaGuardada = response.data;
      }

      if (modoEdicion && detalleServicio.idDetalleServicio) {
        await updateDetalleServicio(detalleServicio.idDetalleServicio, detalleServicio);
      } else if (modoEdicion || (!modoEdicion && detalleServicio.idServicio)) {
        await createDetalleServicio({
          ...detalleServicio,
          idCita: citaGuardada.id,
        });
      }

      navigate('/citas');
    } catch (error) {
      console.error('Error al guardar cita o detalle del servicio:', error);
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
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {modoEdicion ? 'Editar Cita' : 'Nueva Cita'}
      </Typography>

      <FormControl fullWidth>
        <InputLabel>Mascota</InputLabel>
        <Select name="idMascota" value={formularioCita.idMascota} label="Mascota" onChange={handleChangeCita} required>
          {mascotas.map((mascota) => (
            <MenuItem key={mascota.id} value={mascota.id}>{mascota.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Servicio</InputLabel>
        <Select name="idServicio" value={formularioCita.idServicio} label="Servicio" onChange={handleChangeCita} required>
          {servicios.map((servicio) => (
            <MenuItem key={servicio.id} value={servicio.id}>{servicio.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Fecha"
          value={formularioCita.fecha}
          onChange={(newValue) => setFormularioCita({ ...formularioCita, fecha: newValue })}
          renderInput={(params) => <TextField {...params} fullWidth required />}
        />
        <TimePicker
          label="Hora"
          value={formularioCita.hora}
          onChange={(newValue) => setFormularioCita({ ...formularioCita, hora: newValue })}
          renderInput={(params) => <TextField {...params} fullWidth required sx={{ mt: 2 }} />}
        />
      </LocalizationProvider>

      <FormControl fullWidth>
        <InputLabel>Profesional</InputLabel>
        <Select name="idProfesional" value={formularioCita.idProfesional} label="Profesional" onChange={handleChangeCita} required>
          {profesionales.map((profesional) => (
            <MenuItem key={profesional.id} value={profesional.id}>{profesional.nombreCompleto}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Motivo"
        name="motivo"
        value={formularioCita.motivo}
        onChange={handleChangeCita}
        fullWidth
        required
      />

      {modoEdicion && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Detalle del Servicio Brindado
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Servicio Brindado</InputLabel>
            <Select name="idServicio" value={detalleServicio.idServicio} label="Servicio Brindado" onChange={handleChangeDetalleServicio} required>
              {servicios.map((servicio) => (
                <MenuItem key={servicio.id} value={servicio.id}>{servicio.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Tipo de Medicamento (opcional)</InputLabel>
            <Select name="idTipoMedicamento" value={detalleServicio.idTipoMedicamento} label="Tipo de Medicamento" onChange={handleChangeDetalleServicio}>
              <MenuItem value="">Ninguno</MenuItem>
              {tiposMedicamento.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Observaciones"
            name="observaciones"
            value={detalleServicio.observaciones}
            onChange={handleChangeDetalleServicio}
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        </Box>
      )}

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar Cita'}
      </Button>
    </Box>
  );
}

export default CitaForm;
