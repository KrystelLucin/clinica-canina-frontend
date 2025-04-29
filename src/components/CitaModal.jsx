import { useState, useEffect } from 'react';
import { Box, Modal, Typography, IconButton, Divider, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { updateCita } from '../api/citas';
import { createDetalleServicio, getDetalleServicioByCita } from '../api/servicios';
import CitaTabs from './CitaTabs';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
};

function CitaModal({ open, onClose, cita, mascota, servicio }) {
  const [modoCrearDetalle, setModoCrearDetalle] = useState(false);
  const [estadoPrevio, setEstadoPrevio] = useState(cita.estado);
  const [bloquearModal, setBloquearModal] = useState(false);
  const [detalleCreado, setDetalleCreado] = useState(false);
  const [tabSeleccionado, setTabSeleccionado] = useState(0);
  const [detalleServicio, setDetalleServicio] = useState(null);

  const [estadoSeleccionado, setEstadoSeleccionado] = useState(cita.estado);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();

  const colorEstado = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'orange';
      case 'Confirmada': return 'green';
      case 'Realizada': return 'skyblue';
      case 'Cancelada': return 'red';
      default: return 'grey';
    }
  };

  const handleEstadoChange = (event) => {
    const nuevoEstado = event.target.value;
  
    if (nuevoEstado === 'Realizada' && cita.estado !== 'Realizada') {
      setEstadoPrevio(cita.estado);
      setEstadoSeleccionado('Realizada');
      setModoCrearDetalle(true);
      setBloquearModal(true);
      setTabSeleccionado(1);
    } else {
      setEstadoSeleccionado(nuevoEstado);
      setConfirmDialogOpen(true);
    }
  };
  

  const handleGuardarDetalleServicio = async (detalleServicio) => {
    try {
      await updateCita(cita.id, { ...cita, estado: 'Realizada' });

      await createDetalleServicio(detalleServicio);

      window.location.reload();
    } catch (error) {
      console.error('Error al guardar detalle de servicio:', error);
    }
  };

  const handleCancelarDetalleServicio = () => {
    setModoCrearDetalle(false);
    setBloquearModal(false);
    setEstadoSeleccionado(estadoPrevio);
    setTabSeleccionado(0);
  };

  useEffect(() => {
    async function fetchDetalleServicio() {
      if (cita.estado === 'Realizada') {
        try {
          const response = await getDetalleServicioByCita(cita.id);
          setDetalleServicio(response.data);
        } catch (error) {
          console.error('Error al cargar el detalle de servicio:', error);
        }
      }
    }

    fetchDetalleServicio();
  }, [cita]);

  const handleConfirmChange = async () => {
    try {
      const citaActualizada = {
        ...cita,
        estado: estadoSeleccionado,
      };
      await updateCita(cita.id, citaActualizada);
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleEditCita = () => {
    navigate(`/citas/edit/${cita.id}`);
  };

  return (
    <Modal open={open} onClose={bloquearModal ? undefined : onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <FormControl size="small" disabled={cita.estado === 'Cancelada' || modoCrearDetalle || cita.estado === 'Realizada' }>
            <InputLabel id="estado-label">Estado de la Cita</InputLabel>
            <Select
              labelId="estado-label"
              value={estadoSeleccionado}
              label="Estado de la Cita"
              onChange={handleEstadoChange}
              sx={{ color: colorEstado(estadoSeleccionado), minWidth: 150 }}
            >
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Confirmada">Confirmada</MenuItem>
              <MenuItem value="Realizada">Realizada</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" align="center" sx={{ flexGrow: 1 }}>
            {mascota.nombre}
          </Typography>

          <Box>
            <IconButton color="primary" onClick={handleEditCita} disabled={cita.estado === 'Cancelada' || modoCrearDetalle}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onClose} disabled={modoCrearDetalle}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          {servicio?.nombre || 'Servicio no registrado'}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <CitaTabs
          cita={cita}
          mascota={mascota}
          detalleServicio={detalleServicio}
          modoCrearDetalle={modoCrearDetalle}
          onGuardarDetalle={handleGuardarDetalleServicio}
          onCancelarDetalle={handleCancelarDetalleServicio}
          tabSeleccionado={tabSeleccionado}
          onTabChange={(newValue) => setTabSeleccionado(newValue)}
        />

        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>Cambiar Estado</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Está seguro que desea cambiar el estado de esta cita a "{estadoSeleccionado}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleConfirmChange} autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
}

export default CitaModal;