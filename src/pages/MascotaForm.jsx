import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, CircularProgress, FormControl, InputLabel, Select } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useParams } from 'react-router-dom';
import { getMascotaById, createMascota, updateMascota } from '../api/mascotas';
import { getDuenos } from '../api/duenos';
import { getEspecies } from '../api/especies';
import { getRazas } from '../api/razas';
import { getSexos } from '../api/sexos';

function MascotaForm() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [mascotaData, setMascotaData] = useState({
      nombre: '',
      idDueno: '',
      idEspecie: 1, // por defecto Canina
      idRaza: '',
      idSexo: '',
      fechaNacimiento: null,
      color: '',
      peso: '',
      informacionAdicional: '',
    });
  
    const [duenos, setDuenos] = useState([]);
    const [especies, setEspecies] = useState([]);
    const [razas, setRazas] = useState([]);
    const [sexos, setSexos] = useState([]);
  
    const [filteredRazas, setFilteredRazas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
  
    useEffect(() => {
      async function fetchData() {
        try {
          const [duenosRes, especiesRes, razasRes, sexosRes] = await Promise.all([
            getDuenos(),
            getEspecies(),
            getRazas(),
            getSexos(),
          ]);
          setDuenos(duenosRes.data);
          setEspecies(especiesRes.data);
          setRazas(razasRes.data);
          setSexos(sexosRes.data);
        } catch (error) {
          console.error('Error al cargar datos auxiliares:', error);
        }
      }
  
      async function fetchMascota() {
        if (id) {
          setLoading(true);
          try {
            const response = await getMascotaById(id);
            setMascotaData(response.data);
            setFilteredRazas(response.data.idEspecie ? 
              razas.filter(r => r.idEspecie === response.data.idEspecie) : []);
          } catch (error) {
            console.error('Error al cargar mascota:', error);
          } finally {
            setLoading(false);
          }
        }
      }
  
      fetchData().then(fetchMascota);
    }, [id]);
  
    useEffect(() => {
      if (mascotaData.idEspecie) {
        setFilteredRazas(razas.filter(r => r.idEspecie === mascotaData.idEspecie));
      } else {
        setFilteredRazas([]);
      }
    }, [mascotaData.idEspecie, razas]);
  
    const handleChange = (e) => {
      setMascotaData({
        ...mascotaData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleDateChange = (newDate) => {
      setMascotaData({
        ...mascotaData,
        fechaNacimiento: newDate,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
  
      try {
        if (id) {
          await updateMascota(id, mascotaData);
        } else {
          await createMascota(mascotaData);
        }
        navigate('/mascotas');
      } catch (error) {
        console.error('Error al guardar mascota:', error);
      } finally {
        setSaving(false);
      }
    };
  
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }  

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {id ? 'Editar Mascota' : 'Nueva Mascota'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="nombre"
          value={mascotaData.nombre}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="select-dueno-label">Dueño</InputLabel>
          <Select
            labelId="select-dueno-label"
            name="idDueno"
            value={mascotaData.idDueno}
            label="Dueño"
            onChange={handleChange}
            required
          >
            {duenos.map((dueno) => (
              <MenuItem key={dueno.id} value={dueno.id}>
                <Box>
                  <Typography variant="body1">{dueno.nombreCompleto}</Typography>
                  <Typography variant="caption" color="textSecondary">{dueno.id}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="select-especie-label">Especie</InputLabel>
          <Select
            labelId="select-especie-label"
            name="idEspecie"
            value={mascotaData.idEspecie}
            label="Especie"
            onChange={handleChange}
            required
          >
            {especies.map((especie) => (
              <MenuItem key={especie.id} value={especie.id}>
                {especie.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="select-raza-label">Raza</InputLabel>
          <Select
            labelId="select-raza-label"
            name="idRaza"
            value={mascotaData.idRaza}
            label="Raza"
            onChange={handleChange}
            required
            disabled={!filteredRazas.length}
          >
            {filteredRazas.map((raza) => (
              <MenuItem key={raza.id} value={raza.id}>
                {raza.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="select-sexo-label">Sexo</InputLabel>
          <Select
            labelId="select-sexo-label"
            name="idSexo"
            value={mascotaData.idSexo}
            label="Sexo"
            onChange={handleChange}
            required
          >
            {sexos.map((sexo) => (
              <MenuItem key={sexo.id} value={sexo.id}>
                {sexo.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Fecha de Nacimiento"
            value={mascotaData.fechaNacimiento}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
          />
        </LocalizationProvider>

        <TextField
          label="Color"
          name="color"
          value={mascotaData.color}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Peso (kg)"
          name="peso"
          type="number"
          value={mascotaData.peso}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Información Adicional"
          name="informacionAdicional"
          value={mascotaData.informacionAdicional}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate('/mascotas')}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default MascotaForm;
