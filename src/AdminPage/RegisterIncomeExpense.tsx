import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Grid,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: 'auto',
  maxWidth: 600,
  borderRadius: '15px',
  background: 'linear-gradient(135deg, #e3f2fd, #e8f5e9)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: '20px',
  padding: theme.spacing(1.5, 4),
  background: 'linear-gradient(90deg, #2196f3, #4caf50)',
  color: '#ffffff',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(90deg, #1e88e5, #43a047)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiInputLabel-root': {
    color: '#127ca8',
  },
}));

const RegisterIncomeExpense: React.FC = () => {
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    description: '',
    date: '',
    ruc: '',
    client: '',
    taxType: '',
    receiptType: '',
    receiptNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    // Aquí puedes enviar los datos al backend
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd, #e8f5e9)',
        padding: '20px',
      }}
    >
      <FormPaper elevation={6}>
        <Typography variant='h4' align='center' color='primary' gutterBottom>
          Registrar Ingreso/Gasto
        </Typography>
        <Typography
          variant='subtitle1'
          align='center'
          color='textSecondary'
          gutterBottom
        >
          Complete los campos para registrar un nuevo ingreso o gasto.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Tipo */}
            <Grid item xs={12}>
              <StyledTextField
                select
                name='type'
                label='Tipo'
                value={formData.type}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value='income'>Ingreso</MenuItem>
                <MenuItem value='expense'>Gasto</MenuItem>
              </StyledTextField>
            </Grid>

            {/* Monto */}
            <Grid item xs={12}>
              <StyledTextField
                name='amount'
                label='Monto'
                type='number'
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <StyledTextField
                name='description'
                label='Descripción'
                value={formData.description}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Fecha */}
            <Grid item xs={12}>
              <StyledTextField
                name='date'
                label='Fecha'
                type='date'
                value={formData.date}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                name='client'
                label='Cliente'
                value={formData.client}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                name='ruc'
                label='Ruc'
                value={formData.ruc}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Tipo de Impuesto */}
            <Grid item xs={12}>
              <StyledTextField
                select
                name='taxType'
                label='Tipo de Impuesto'
                value={formData.taxType}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value='IVA 10%'>IVA 10%</MenuItem>
                <MenuItem value='IVA 5%'>IVA 5%</MenuItem>
                <MenuItem value='Exento'>Exento</MenuItem>
              </StyledTextField>
            </Grid>

            {/* Tipo de Comprobante */}
            <Grid item xs={12}>
              <StyledTextField
                select
                name='receiptType'
                label='Tipo de Comprobante'
                value={formData.receiptType}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value='Factura'>Factura</MenuItem>
                <MenuItem value='Recibo'>Recibo</MenuItem>
                <MenuItem value='Otro'>Otro</MenuItem>
              </StyledTextField>
            </Grid>

            {/* Número de Comprobante */}
            <Grid item xs={12}>
              <StyledTextField
                name='receiptNumber'
                label='Número de Comprobante'
                value={formData.receiptNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          {/* Botón Guardar */}
          <StyledButton variant='contained' type='submit' fullWidth>
            Guardar
          </StyledButton>
        </form>
      </FormPaper>
    </Box>
  );
};

export default RegisterIncomeExpense;
