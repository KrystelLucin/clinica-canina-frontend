import { Box, Card, CardContent, Typography, Divider } from '@mui/material';

function DuenoDetail({ dueno }) {
  if (!dueno) return null; 

  return (
    <Card sx={{ maxWidth: 700, margin: '0 auto', p: 2 }}>
      <CardContent>
        
        <Typography variant="h4" gutterBottom align="center">
          {dueno.nombreCompleto}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Número de Identificación:
          </Typography>
          <Typography variant="body1">
            {dueno.id || 'No disponible'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Dirección:
          </Typography>
          <Typography variant="body1">
            {dueno.direccion || 'No disponible'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">
            Teléfono:
          </Typography>
          <Typography variant="body1">
            {dueno.telefono || 'No disponible'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" color="textSecondary">
            Correo electrónico:
          </Typography>
          <Typography variant="body1">
            {dueno.correo || 'No disponible'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DuenoDetail;
