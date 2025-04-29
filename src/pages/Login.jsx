import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginRequest } from '../api/auth';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import Swal from 'sweetalert2';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await loginRequest({ 
        NombreUsuario: username, 
        Contrasena: password 
      });
  
      localStorage.setItem('token', response.data.token);
  
      login();
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
  
      const backendMessage = error.response?.data || 'Error desconocido';
  
      if (backendMessage.includes('bloqueada')) {
        Swal.fire({
          icon: 'warning',
          title: '¡Cuenta bloqueada!',
          text: 'Tu cuenta ha sido bloqueada por demasiados intentos fallidos.',
        });
      } else{
        Swal.fire({
          icon: 'error',
          title: '¡Usuario o contraseña incorrecta!',
          text: 'El usuario o contraseña que ingresaste no es válida.',
        });
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: '#87CEEB', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, width: 350, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Atención Canina
        </Typography>
        <Typography variant="h6" gutterBottom>
          Inicio de Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ marginTop: 2 }}
          >
            Ingresar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
