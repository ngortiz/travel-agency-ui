import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: 'auto',
  maxWidth: 900,
  borderRadius: '15px',
  background: 'linear-gradient(135deg, #e3f2fd, #e8f5e9)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
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
    client: '',
    ruc: '',
    email: '',
    condition: '',
    type: '',
    documentType: '',
    documentNumber: '',
    date: '',
  });

  const [transactionDetails, setTransactionDetails] = useState([
    {
      transaction_type: '',
      quantity: '',
      unit_price: '',
      tax_type: '',
      description: '',
    },
  ]);

  const [totals, setTotals] = useState({
    exempt: 0,
    tax5: 0,
    tax10: 0,
    total: 0,
  });

  const calculateTotals = (details: typeof transactionDetails) => {
    let exempt = 0;
    let tax5 = 0;
    let tax10 = 0;

    details.forEach((detail) => {
      const quantity = parseFloat(detail.quantity) || 0;
      const unitPrice = parseFloat(detail.unit_price) || 0;
      const subtotal = quantity * unitPrice;

      if (detail.tax_type === 'Exento') {
        exempt += subtotal;
      } else if (detail.tax_type === 'IVA 5%') {
        tax5 += subtotal * 0.05;
      } else if (detail.tax_type === 'IVA 10%') {
        tax10 += subtotal * 0.1;
      }
    });

    setTotals({
      exempt,
      tax5,
      tax10,
      total: exempt + tax5 + tax10,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedDetails = [...transactionDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [name]: value,
      };
      setTransactionDetails(updatedDetails);
      calculateTotals(updatedDetails);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const addTransactionDetail = () => {
    setTransactionDetails([
      ...transactionDetails,
      {
        transaction_type: '',
        quantity: '',
        unit_price: '',
        tax_type: '',
        description: '',
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData, transactionDetails);
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

        <form onSubmit={handleSubmit}>
          {/* Cabecera: Datos del Cliente */}
          <Typography variant='h6' gutterBottom color='textSecondary'>
            Datos del Cliente
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledTextField
                name='client'
                label='Cliente'
                value={formData.client}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                name='ruc'
                label='RUC'
                value={formData.ruc}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                name='email'
                label='Email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                name='documentType'
                label='Tipo de Documento'
                value={formData.documentType}
                onChange={handleChange}
                select
                fullWidth
                required
              >
                <MenuItem value='factura'>Factura</MenuItem>
                <MenuItem value='recibo'>Recibo</MenuItem>
              </StyledTextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                name='documentNumber'
                label='Nro de Documento'
                value={formData.documentNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          <Typography
            variant='h6'
            gutterBottom
            color='textSecondary'
            mt={4}
          ></Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledTextField
                select
                name='condition'
                label='Condición de Venta'
                value={formData.condition}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value='contado'>Contado</MenuItem>
                <MenuItem value='credito'>Crédito</MenuItem>
              </StyledTextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                select
                name='type'
                label='Tipo'
                value={formData.type}
                onChange={(e) => handleChange}
                fullWidth
                required
              >
                <MenuItem value='Ingreso'>Ingreso</MenuItem>
                <MenuItem value='IVA 5%'>Gasto</MenuItem>
              </StyledTextField>
            </Grid>
            <Grid item xs={12} md={4}>
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
          </Grid>

          {/* Detalle de la Transacción */}
          <Typography variant='h6' gutterBottom color='textSecondary' mt={4}>
            Detalle de la Transacción
          </Typography>
          {transactionDetails.map((detail, index) => (
            <Grid container spacing={3} key={index}>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  name='quantity'
                  label='Cantidad'
                  type='number'
                  value={detail.quantity}
                  onChange={(e) => handleChange(e, index)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  name='unit_price'
                  label='Precio Unitario'
                  type='number'
                  value={detail.unit_price}
                  onChange={(e) => handleChange(e, index)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  select
                  name='tax_type'
                  label='Tipo de Impuesto'
                  value={detail.tax_type}
                  onChange={(e) => handleChange(e, index)}
                  fullWidth
                  required
                >
                  <MenuItem value='IVA 10%'>IVA 10%</MenuItem>
                  <MenuItem value='IVA 5%'>IVA 5%</MenuItem>
                  <MenuItem value='Exento'>Exento</MenuItem>
                </StyledTextField>
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  name='description'
                  label='Descripción'
                  value={detail.description}
                  onChange={(e) => handleChange(e, index)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          ))}
          <Box display='flex' justifyContent='flex-end' mt={2}>
            <StyledButton
              variant='contained'
              onClick={addTransactionDetail}
              type='button'
            >
              Agregar
            </StyledButton>
          </Box>

          {/* Totales */}
          <Typography variant='h6' gutterBottom color='textSecondary' mt={4}>
            Totales
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Exentas</TableCell>
                  <TableCell>IVA 5%</TableCell>
                  <TableCell>IVA 10%</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{totals.exempt.toFixed(2)}</TableCell>
                  <TableCell>{totals.tax5.toFixed(2)}</TableCell>
                  <TableCell>{totals.tax10.toFixed(2)}</TableCell>
                  <TableCell>{totals.total.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Botón Guardar */}
          <Box display='flex' justifyContent='center' mt={4}>
            <StyledButton variant='contained' type='submit'>
              Guardar
            </StyledButton>
          </Box>
        </form>
      </FormPaper>
    </Box>
  );
};

export default RegisterIncomeExpense;
