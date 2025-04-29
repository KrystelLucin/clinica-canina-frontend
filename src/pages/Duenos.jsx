import { useState } from 'react';
import { Box, CssBaseline, Drawer, Toolbar, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import DuenosList from '../components/DuenosList';
import DuenoDetail from '../components/DuenoDetail';

const drawerWidth = 300;

function Duenos() {
  const [selectedDueno, setSelectedDueno] = useState(null);

  const [searchParams] = useSearchParams();
  const selectedDuenoIdFromUrl = searchParams.get('selectedDueno');

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
        <DuenosList 
          onSelectDueno={setSelectedDueno} 
          selectedDuenoId={selectedDuenoIdFromUrl}
        />
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {selectedDueno ? (
          <DuenoDetail dueno={selectedDueno} />
        ) : (
          <Typography variant="h5" align="center" sx={{ mt: 10 }}>
            Selecciona un dueño de la lista
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Duenos;
