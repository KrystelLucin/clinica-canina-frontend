import { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemButton, ListItemText, Typography, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getDuenos } from '../api/duenos';

function DuenosList({ onSelectDueno, selectedDuenoId }) {
  const [duenos, setDuenos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDuenos() {
      try {
        const response = await getDuenos();
        setDuenos(response.data);
        setLoading(false);

        if (selectedDuenoId) {
          const duenoSeleccionado = response.data.find(d => d.id === selectedDuenoId);
          if (duenoSeleccionado) {
            onSelectDueno(duenoSeleccionado);
          }
        }
      } catch (err) {
        console.error('Error al cargar dueños:', err);
        setError(true);
        setLoading(false);
      }
    }

    fetchDuenos();
  }, [selectedDuenoId, onSelectDueno]);

  const filteredDuenos = duenos
    .filter(dueno => dueno.nombreCompleto.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <TextField
        label="Buscar dueño"
        variant="outlined"
        fullWidth
        size="small"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<AddIcon />}
        onClick={() => navigate('/duenos/new')}
        sx={{ mb: 2 }}
      >
        Nuevo Dueño
      </Button>


      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          Error al cargar los dueños. Intenta nuevamente.
        </Typography>
      ) : filteredDuenos.length > 0 ? (
        <List>
          {filteredDuenos.map((dueno) => (
            <ListItem key={dueno.id} disablePadding>
              <ListItemButton onClick={() => onSelectDueno(dueno)}>
                <ListItemText primary={dueno.nombreCompleto} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          No se encontraron dueños.
        </Typography>
      )}
    </Box>
  );
}

export default DuenosList;
