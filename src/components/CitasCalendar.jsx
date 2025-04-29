import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getCitas, getCitasByProfesional, getCitasByMascota } from '../api/citas';
import { getServicioById } from '../api/servicios';
import { getMascotaById } from '../api/mascotas';
import CitaModal from './CitaModal';

function CitasCalendar({ profesionalFiltro, mascotaFiltro }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCita, setSelectedCita] = useState(null);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchCitas() {
      setLoading(true);
      try {
        let response;
        if (profesionalFiltro) {
          response = await getCitasByProfesional(profesionalFiltro);
        } else if (mascotaFiltro) {
          response = await getCitasByMascota(mascotaFiltro);
        } else {
          response = await getCitas();
        }

        const citasEnriquecidas = await Promise.all(response.data.map(async (cita) => {
          try {
            const mascotaRes = await getMascotaById(cita.idMascota);
            const servicioRes = await getServicioById(cita.idServicio);

            return {
              cita,
              mascota: mascotaRes.data,
              servicio: servicioRes.data
            };
          } catch (error) {
            console.error('Error al cargar información adicional de una cita:', error);
            return null;
          }
        }));

        setCitas(citasEnriquecidas.filter(item => item !== null));
      } catch (error) {
        console.error('Error al cargar citas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCitas();
  }, [profesionalFiltro, mascotaFiltro]);

  const handleEventClick = (clickInfo) => {
    const citaSeleccionada = citas.find(c => c.cita.id.toString() === clickInfo.event.id);
    if (citaSeleccionada) {
      setSelectedCita(citaSeleccionada.cita);
      setSelectedMascota(citaSeleccionada.mascota);
      setSelectedServicio(citaSeleccionada.servicio);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCita(null);
    setSelectedMascota(null);
    setSelectedServicio(null);
  };

  const colorEvento = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'orange';
      case 'Confirmada': return 'green';
      case 'Realizada': return 'skyblue';
      case 'Cancelada': return 'red';
      default: return 'grey';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          eventContent={(arg) => {
            const color = arg.backgroundColor || 'gray';
          
            return (
              <div style={{ textAlign: 'left', fontSize: '0.75rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    marginRight: '5px'
                  }}></div>
                  <div style={{ color: 'gray', fontSize: '0.7rem' }}>
                    {arg.timeText}
                  </div>
                </div>
          
                <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '2px' }}>
                  {arg.event.extendedProps.mascotaNombre}
                </div>
          
                <div style={{ fontSize: '0.7rem' }}>
                  {arg.event.extendedProps.servicioNombre}
                </div>
              </div>
            );
          }}          
          
          events={citas.map(({ cita, mascota, servicio }) => ({
            id: cita.id.toString(),
            start: cita.fechaHora,
            title: ``,
            backgroundColor: colorEvento(cita.estado),
            extendedProps: {
              mascotaNombre: mascota.nombre,
              servicioNombre: servicio.nombre,
            },
          }))}
          eventClick={handleEventClick}
          height="auto"
        />
      )}

      {selectedCita && (
        <CitaModal
          open={modalOpen}
          onClose={handleCloseModal}
          cita={selectedCita}
          mascota={selectedMascota}
          servicio={selectedServicio}
        />
      )}
    </Box>
  );
}

export default CitasCalendar;