import React from 'react';
import {
  Box,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
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

interface FormComponentProps {
  formData: any;
  transactionDetails: any[];
  totals: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => void;
  addTransactionDetail: () => void;
  removeTransactionDetail: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({
  formData,
  transactionDetails,
  totals = { exempt: 0, tax5: 0, tax10: 0, total: 0 }, // Default value
  handleChange,
  addTransactionDetail,
  removeTransactionDetail,
  handleSubmit,
}) => {
  return (
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
            <StyledButton onClick={addTransactionDetail} type='button'>
              Agregar
            </StyledButton>
          </Box>
        </SectionPaper>
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
        <Box display='flex' justifyContent='center' mt={3}>
          <StyledButton type='submit'>Guardar</StyledButton>
        </Box>
      </form>
    </FormPaper>
  );
};

export default FormComponent;
