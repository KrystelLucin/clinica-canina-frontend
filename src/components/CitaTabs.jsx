import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import CitaDetail from './CitaDetail';
import ServicioDetail from './ServicioDetail';
import ServicioForm from './ServicioForm';

function CitaTabs({ cita, mascota, detalleServicio, modoCrearDetalle, onGuardarDetalle, onCancelarDetalle, tabSeleccionado, onTabChange }) {

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tabSeleccionado}
        onChange={(event, newValue) => onTabChange(newValue)}
        centered
        textColor="primary"
        indicatorColor="primary"
      >

        <Tab label="Detalle de la Cita" disabled={modoCrearDetalle} />
        {(modoCrearDetalle || detalleServicio) && <Tab label="Servicio Brindado" />}
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tabSeleccionado === 0 && (
          <CitaDetail cita={cita} />
        )}

        {tabSeleccionado === 1 && (
          modoCrearDetalle ? (
            <ServicioForm
              idCita={cita.id}
              onSave={onGuardarDetalle}
              onCancel={onCancelarDetalle}
            />
          ) : (
            detalleServicio ? (
              <ServicioDetail
                cita={cita}
                detalleServicio={detalleServicio}
                mascota={mascota}
              />
            ) : (
              <Typography align="center" sx={{ mt: 2 }}>
                No hay detalles registrados.
              </Typography>
            )
          )
        )}
      </Box>
    </Box>
  );
}

export default CitaTabs;
