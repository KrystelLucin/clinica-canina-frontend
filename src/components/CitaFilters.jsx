import { useState, useEffect } from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getProfesionales } from '../api/profesionales';
import { getMascotas } from '../api/mascotas';

function CitaFilters({ profesionalFiltro, setProfesionalFiltro, mascotaFiltro, setMascotaFiltro }) {
  const [profesionales, setProfesionales] = useState([]);
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profesionalesRes, mascotasRes] = await Promise.all([
          getProfesionales(),
          getMascotas()
        ]);
        setProfesionales(profesionalesRes.data);
        setMascotas(mascotasRes.data);
      } catch (error) {
        console.error('Error al cargar profesionales o mascotas:', error);
      }
    }
    fetchData();
  }, []);

  const handleLimpiarFiltros = () => {
    setProfesionalFiltro('');
    setMascotaFiltro('');
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Profesional</InputLabel>
        <Select
          value={profesionalFiltro}
          label="Profesional"
          onChange={(e) => setProfesionalFiltro(e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          {profesionales.map((profesional) => (
            <MenuItem key={profesional.id} value={profesional.id}>{profesional.nombreCompleto}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Mascota</InputLabel>
        <Select
          value={mascotaFiltro}
          label="Mascota"
          onChange={(e) => setMascotaFiltro(e.target.value)}
        >
          <MenuItem value="">Todas</MenuItem>
          {mascotas.map((mascota) => (
            <MenuItem key={mascota.id} value={mascota.id}>{mascota.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" size="small" onClick={handleLimpiarFiltros}>
        Limpiar Filtros
      </Button>
    </Box>
  );
}

export default CitaFilters;