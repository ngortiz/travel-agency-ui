import React, { useState, useEffect } from 'react';
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
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

// Estilos personalizados
const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: '30px',
  maxWidth: 900,
  borderRadius: '15px',
  background: 'linear-gradient(135deg, #f5f7fa, #c3d9e8)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '10px',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(4),
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
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiInputLabel-root': {
    color: '#1a76d2',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '50%',
  padding: theme.spacing(1),
  background: 'linear-gradient(90deg, #2196f3, #4caf50)',
  color: '#ffffff',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  transition: 'background 0.3s ease, transform 0.2s ease',
  marginLeft: '20px',
  marginTop: '22px',
  '&:hover': {
    background: 'linear-gradient(90deg, #1e88e5, #43a047)',
    transform: 'scale(1.1)',
  },
}));

// Componente principal
const RegisterIncomeExpense: React.FC = () => {
  const [formData, setFormData] = useState({
    customer: '',
    ruc: '',
    email: '',
    condition: '',
    transaction_type: '',
    document_type: '',
    document_number: '',
    date: '',
  });

  const [transactionDetails, setTransactionDetails] = useState([
    {
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

  const [invoices, setInvoices] = useState([]); // Estado para almacenar las facturas

  // Función para calcular totales
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
        tax10 += subtotal / 1.1;
      }
    });

    setTotals({
      exempt,
      tax5,
      tax10,
      total: exempt + tax5 + tax10,
    });
  };

  // Función para manejar cambios
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

  // Función para agregar un nuevo detalle
  const addTransactionDetail = () => {
    setTransactionDetails([
      ...transactionDetails,
      {
        quantity: '',
        unit_price: '',
        tax_type: '',
        description: '',
      },
    ]);
  };

  // Función para eliminar un detalle
  const removeTransactionDetail = (index: number) => {
    const updatedDetails = transactionDetails.filter((_, i) => i !== index);
    setTransactionDetails(updatedDetails);
    calculateTotals(updatedDetails);
  };

  // Función para obtener facturas desde la API
  const fetchInvoices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      } else {
        console.error('Error al obtener las facturas:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
    }
  };

  useEffect(() => {
    fetchInvoices(); // Llamar a la API al montar el componente
  }, []);

  // Función para manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      invoice: {
        headers: {
          customer: formData.customer,
          ruc: formData.ruc,
          email: formData.email,
          condition: formData.condition,
          document_type: formData.document_type,
          document_number: formData.document_number,
          transaction_type: formData.transaction_type,
          date: formData.date,
        },
        details: transactionDetails.map((detail) => ({
          quantity: parseInt(detail.quantity, 10),
          unit_price: parseFloat(detail.unit_price),
          description: detail.description,
          tax_type:
            detail.tax_type === 'IVA 10%'
              ? 'iva10'
              : detail.tax_type === 'IVA 5%'
              ? 'iva5'
              : 'exento',
        })),
      },
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        // Resetear formulario
        setFormData({
          customer: '',
          ruc: '',
          email: '',
          condition: '',
          transaction_type: '',
          document_type: '',
          document_number: '',
          date: '',
        });
        setTransactionDetails([
          { quantity: '', unit_price: '', tax_type: '', description: '' },
        ]);
        setTotals({ exempt: 0, tax5: 0, tax10: 0, total: 0 });

        fetchInvoices(); // Refrescar las facturas
      } else {
        console.error('Error al enviar los datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa, #e3f2fd)',
        padding: '50px',
      }}
    >
      <FormPaper elevation={6}>
        <Typography variant='h4' align='center' color='primary' gutterBottom>
          Registrar Ingreso/Gasto
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Contenedor: Datos del Cliente */}
          <SectionPaper>
            <Typography variant='h6' gutterBottom color='textSecondary'>
              Datos del Cliente
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  name='customer'
                  label='Cliente'
                  value={formData.customer}
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
                  name='transaction_type'
                  label='Tipo'
                  value={formData.transaction_type}
                  onChange={(e) => handleChange(e)}
                  select
                  fullWidth
                  required
                >
                  <MenuItem value='ingreso'>Ingreso</MenuItem>
                  <MenuItem value='egreso'>Egreso</MenuItem>
                </StyledTextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  name='document_type'
                  label='Tipo de Documento'
                  value={formData.document_type}
                  onChange={(e) => handleChange(e)}
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
                  name='document_number'
                  label='Nro de Documento'
                  value={formData.document_number}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StyledTextField
                  select
                  name='condition'
                  label='Condicion de Venta'
                  value={formData.condition}
                  onChange={(e) => handleChange(e)}
                  fullWidth
                  required
                >
                  <MenuItem value='contado'>Contado</MenuItem>
                  <MenuItem value='credito'>Credito</MenuItem>
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
          </SectionPaper>

          {/* Contenedor: Detalle de la Transacción */}
          <SectionPaper>
            <Typography variant='h6' gutterBottom color='textSecondary'>
              Detalle de la Transacción
            </Typography>

            {transactionDetails.map((detail, index) => (
              <Box key={index} sx={{ marginBottom: 4 }}>
                <Grid container spacing={3} alignItems='center'>
                  <Grid item xs={12} md={3}>
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
                  <Grid item xs={12} md={3}>
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
                  <Grid item xs={12} md={3}>
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
                  {/* IconButton con DeleteIcon */}
                  <StyledIconButton
                    color='error'
                    onClick={() => removeTransactionDetail(index)}
                  >
                    <DeleteIcon />
                  </StyledIconButton>
                </Grid>

                <Grid container spacing={3} mt={2}>
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
              </Box>
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
          </SectionPaper>

          {/* Contenedor: Totales */}
          <SectionPaper>
            <Typography variant='h6' gutterBottom color='textSecondary'>
              Totales
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exento</TableCell>
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
          </SectionPaper>

          {/* Botón Guardar */}
          <Box display='flex' justifyContent='center' mt={4}>
            <StyledButton variant='contained' type='submit'>
              Guardar
            </StyledButton>
          </Box>
        </form>
        {/* Tabla de Facturas */}
        <Typography variant='h5' gutterBottom>
          Facturas Registradas
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nro de Documento</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Ruc</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Condición</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice: any, index) => {
                const headers = invoice.headers || {}; // Asegúrate de que headers no sea undefined

                return (
                  <TableRow key={index}>
                    <TableCell>{headers.document_number || 'N/A'}</TableCell>
                    <TableCell>{headers.customer || 'N/A'}</TableCell>
                    <TableCell>{headers.ruc || 'N/A'}</TableCell>
                    <TableCell>{headers.transaction_type || 'N/A'}</TableCell>
                    <TableCell>{headers.condition || 'N/A'}</TableCell>
                    <TableCell>{headers.date || 'N/A'}</TableCell>
                    <TableCell>{headers.total ?? 'N/A'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </FormPaper>
    </Box>
  );
};
export default RegisterIncomeExpense;
