import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          Atención Canina
        </Typography>

        <Box>
          <Button color="inherit" onClick={() => navigate('/')}>Inicio</Button>
          <Button color="inherit" onClick={() => navigate('/duenos')}>Dueños</Button>
          <Button color="inherit" onClick={() => navigate('/mascotas')}>Mascotas</Button>
          <Button color="inherit" onClick={() => navigate('/citas')}>Citas</Button>
          <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
