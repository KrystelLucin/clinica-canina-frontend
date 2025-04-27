import { useState, useEffect } from 'react';
import { Box, TextField, List, ListItem, ListItemButton, ListItemText, Typography, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { getMascotas, getMascotasByDueno } from '../api/mascotas';

function MascotasList({ onSelectMascota, selectedMascotaId }) {
    const [mascotas, setMascotas] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchMode, setSearchMode] = useState('mascota');

    useEffect(() => {
        async function fetchMascotas() {
            try {
                const response = await getMascotas();
                setMascotas(response.data);
                setLoading(false);

                if (selectedMascotaId) {
                    const mascotaSeleccionada = response.data.find(m => m.id === Number(selectedMascotaId));
                    if (mascotaSeleccionada) {
                        onSelectMascota(mascotaSeleccionada);
                    }
                }
            } catch (err) {
                console.error('Error al cargar mascotas:', err);
                setError(true);
                setLoading(false);
            }
        }

        fetchMascotas();
    }, [selectedMascotaId, onSelectMascota]);

    useEffect(() => {
        async function fetchMascotasByDueno() {
            if (searchMode === 'dueno' && searchText.trim() !== '') {
                setLoading(true);
                try {
                    const response = await getMascotasByDueno(searchText);
                    setMascotas(response.data);
                } catch (err) {
                    console.error('Error al buscar por dueño:', err);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            }
        }

        fetchMascotasByDueno();
    }, [searchText, searchMode]);

    // Buscar por mascota
    const filteredMascotas = searchMode === 'mascota'
        ? mascotas.filter(mascota =>
            mascota.nombre.toLowerCase().includes(searchText.toLowerCase())
        )
        : mascotas;

    return (
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <ToggleButtonGroup
                value={searchMode}
                exclusive
                onChange={(e, newMode) => {
                    if (newMode !== null) {
                        setSearchMode(newMode);
                        setSearchText('');
                        setError(false);
                    }
                }}
                fullWidth
                sx={{ mb: 2 }}
            >
                <ToggleButton value="mascota">Buscar por Mascota</ToggleButton>
                <ToggleButton value="dueno">Buscar por Dueño</ToggleButton>
            </ToggleButtonGroup>

            <TextField
                label={searchMode === 'mascota' ? "Nombre de Mascota" : "Nombre de Dueño"}
                variant="outlined"
                fullWidth
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{ mb: 2 }}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" align="center" sx={{ mt: 4 }}>
                    Error al cargar las mascotas. Intenta nuevamente.
                </Typography>
            ) : filteredMascotas.length > 0 ? (
                <List>
                    {filteredMascotas.map((mascota) => (
                        <ListItem key={mascota.id} disablePadding>
                            <ListItemButton onClick={() => onSelectMascota(mascota)}>
                                <ListItemText primary={mascota.nombre} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" align="center" sx={{ mt: 4 }}>
                    No se encontraron mascotas.
                </Typography>
            )}
        </Box>
    );
}

export default MascotasList;
