import { useState } from 'react';
import { Box, CssBaseline, Drawer, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import MascotasList from '../components/MascotasList';
import MascotaDetail from '../components/MascotaDetail';

const drawerWidth = 300;

function Mascotas() {
  const [selectedMascota, setSelectedMascota] = useState(null);

  const [searchParams] = useSearchParams();
  const selectedMascotaIdFromUrl = searchParams.get('selectedMascota'); 
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: '64px',
            height: 'calc(100% - 64px)',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <MascotasList 
            onSelectMascota={setSelectedMascota} 
            selectedMascotaId={selectedMascotaIdFromUrl}
        />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          mt: '64px',
        }}
      >
        {selectedMascota ? (
          <MascotaDetail mascota={selectedMascota} />
        ) : (
          <Typography variant="h5" align="center" sx={{ mt: 10 }}>
            Selecciona una mascota de la lista
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Mascotas;
