import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        ¡Bienvenido a Atención Canina!
      </Typography>
      <Typography variant="h6" gutterBottom>
        ¿Qué deseas hacer hoy?
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ m: 1 }} 
          onClick={() => navigate('/duenos')}
        >
          Ver Dueños
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ m: 1 }} 
          onClick={() => navigate('/mascotas')}
        >
          Ver Mascotas
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ m: 1 }} 
          onClick={() => navigate('/citas')}
        >
          Ver Citas
        </Button>
      </Box>
    </Box>
  );
}

export default Home;
