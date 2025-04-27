import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Divider, CircularProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getDuenoById } from '../api/duenos';
import { getEspeciesById } from '../api/especies';
import { getRazasById } from '../api/razas';
import { getSexosById } from '../api/sexos';

function MascotaDetail({ mascota }) {
    const [especie, setEspecie] = useState('');
    const [raza, setRaza] = useState('');
    const [sexo, setSexo] = useState('');
    const [loading, setLoading] = useState(true);
    const [nombreDueno, setNombreDueno] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const [especieRes, razaRes, sexoRes, duenoRes] = await Promise.all([
                    getEspeciesById(mascota.idEspecie),
                    getRazasById(mascota.idRaza),
                    getSexosById(mascota.idSexo),
                    getDuenoById(mascota.idDueno)
                ]);
                setEspecie(especieRes.data.nombre);
                setRaza(razaRes.data.nombre);
                setSexo(sexoRes.data.nombre);
                setNombreDueno(duenoRes.data.nombreCompleto);
            } catch (error) {
                console.error('Error al cargar información adicional de la mascota:', error);
            } finally {
                setLoading(false);
            }
        }

        if (mascota) {
            fetchData();
        }
    }, [mascota]);

    if (!mascota) return null;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
            <CardContent>
                <Typography variant="h4" gutterBottom align="center">
                    {mascota.nombre}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">Fecha de Nacimiento:</Typography>
                        <Typography variant="body1">{mascota.fechaNacimiento ? new Date(mascota.fechaNacimiento).toLocaleDateString() : 'No disponible'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">Sexo:</Typography>
                        <Typography variant="body1">{sexo || 'Desconocido'}</Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">Especie:</Typography>
                        <Typography variant="body1">{especie || 'Desconocido'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">Raza:</Typography>
                        <Typography variant="body1">{raza || 'Desconocido'}</Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">Color:</Typography>
                        <Typography variant="body1">{mascota.color || 'No disponible'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">Peso:</Typography>
                        <Typography variant="body1">{mascota.peso ? `${mascota.peso} kg` : 'No disponible'}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="textSecondary">Dueño:</Typography>
                </Box>

                <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">Cédula:</Typography>
                        <Typography variant="body1">{mascota.idDueno}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" color="textSecondary">Nombre Completo:</Typography>
                        <Typography variant="body1" sx={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(`/duenos?selectedDueno=${mascota.idDueno}`)}>
                            {nombreDueno || 'Nombre desconocido'}
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" color="textSecondary">Información Adicional:</Typography>
                    <Typography variant="body1">{mascota.informacionAdicional || 'No disponible'}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

export default MascotaDetail;