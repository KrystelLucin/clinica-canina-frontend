import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CitaFilters from '../components/CitaFilters';
import CitasCalendar from '../components/CitasCalendar';
import AddIcon from '@mui/icons-material/Add';

function Citas() {
  const navigate = useNavigate();

  const [profesionalFiltro, setProfesionalFiltro] = useState('');
  const [mascotaFiltro, setMascotaFiltro] = useState('');

  const handleNuevaCita = () => {
    navigate('/citas/new');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <CitaFilters
          profesionalFiltro={profesionalFiltro}
          setProfesionalFiltro={setProfesionalFiltro}
          mascotaFiltro={mascotaFiltro}
          setMascotaFiltro={setMascotaFiltro}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNuevaCita}
        >
          Nueva Cita
        </Button>
      </Box>

      <CitasCalendar
        profesionalFiltro={profesionalFiltro}
        mascotaFiltro={mascotaFiltro}
      />
    </Box>
  );
}

export default Citas;
