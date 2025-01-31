import React, { useState } from 'react';
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
import { TransactionDetail } from '../../interfaces/transactionDetail';

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
const StyledDateTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    color: '#1a76d2 !important',
  },
  '& .MuiInputLabel-root': {
    color: '#1a76d2 !important',
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

interface FieldErrors {
  [key: string]: boolean;
}

interface FormComponentProps {
  formData: any;
  transactionDetails: TransactionDetail[];
  totals: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => void;
  addTransactionDetail: () => void;
  removeTransactionDetail: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isDisplayMode: boolean;
}

const FormComponent: React.FC<FormComponentProps> = ({
  formData,
  transactionDetails,
  totals = { exempt: 0, tax5: 0, tax10: 0, total: 0 },
  handleChange,
  addTransactionDetail,
  removeTransactionDetail,
  handleSubmit,
  isDisplayMode,
}) => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const normalizeNumber = (value: any) =>
    typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;

  const validateFields = () => {
    const errors: FieldErrors = {};
    if (!formData.customer) errors.customer = true;
    if (!formData.transaction_type) errors.transaction_type = true;
    if (!formData.document_type) errors.document_type = true;
    if (!formData.document_number) errors.document_number = true;
    if (!formData.date) errors.date = true;

    transactionDetails.forEach((detail, index) => {
      if (!detail.quantity || detail.quantity <= 0)
        errors[`quantity_${index}`] = true;
      if (!detail.unit_price || detail.unit_price <= 0)
        errors[`unit_price_${index}`] = true;
      if (!detail.tax_type) errors[`tax_type${index}`] = true;
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields()) {
      handleSubmit(e);
    } else {
      alert('Por favor, complete todos los campos obligatorios.');
    }
  };

  const getErrorStyle = (field: string) =>
    fieldErrors[field]
      ? { border: '2px solid red !important', borderRadius: '10px' }
      : {};

  return (
    <FormPaper elevation={6}>
      <Typography variant='h4' align='center' color='primary' gutterBottom>
        Registrar Ingreso/Gasto
      </Typography>

      <form onSubmit={onSubmit}>
        <SectionPaper>
          {/* Contenedor: Datos del Cliente */}
          <Typography variant='h6' gutterBottom color='textSecondary'>
            Datos del Cliente
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledTextField
                disabled={isDisplayMode}
                name='customer'
                label='Cliente'
                value={formData.customer}
                onChange={handleChange}
                fullWidth
                required
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    'Por favor, complete este campo.'
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity('')
                }
                style={getErrorStyle('customer')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                disabled={isDisplayMode}
                name='ruc'
                label='RUC'
                value={formData.ruc}
                onChange={handleChange}
                fullWidth
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    'Por favor, complete este campo.'
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity('')
                }
                style={getErrorStyle('ruc')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                disabled={isDisplayMode}
                name='email'
                label='Email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                fullWidth
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    'Por favor, complete este campo.'
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity('')
                }
                style={getErrorStyle('email')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                disabled={isDisplayMode}
                name='transaction_type'
                label='Tipo'
                value={formData.transaction_type}
                onChange={(e) => handleChange(e)}
                select
                fullWidth
                required
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    'Por favor, complete este campo.'
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity('')
                }
                style={getErrorStyle('transaction_type')}
              >
                <MenuItem value='ingreso'>Ingreso</MenuItem>
                <MenuItem value='egreso'>Egreso</MenuItem>
              </StyledTextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                disabled={isDisplayMode}
                name='document_type'
                label='Tipo de Documento'
                value={formData.document_type}
                onChange={(e) => handleChange(e)}
                select
                fullWidth
                required
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    'Por favor, complete este campo.'
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity('')
                }
                style={getErrorStyle('document_type')}
              >
                <MenuItem value='factura'>Factura</MenuItem>
                <MenuItem value='recibo'>Recibo</MenuItem>
              </StyledTextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                disabled={isDisplayMode}
                name='document_number'
                label='Nro de Documento'
                value={formData.document_number}
                onChange={handleChange}
                fullWidth
                required
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    'Por favor, complete este campo.'
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity('')
                }
                style={getErrorStyle('document_number')}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StyledTextField
                select
                disabled={isDisplayMode}
                name='condition'
                label='Condicion de Venta'
                value={formData.condition}
                onChange={(e) => handleChange(e)}
                fullWidth
                required
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    'Por favor, complete este campo.'
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity('')
                }
                style={getErrorStyle('condition')}
              >
                <MenuItem value='contado'>Contado</MenuItem>
                <MenuItem value='credito'>Credito</MenuItem>
              </StyledTextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledDateTextField
                disabled={isDisplayMode}
                name='date'
                label='Fecha'
                color='primary'
                type='date'
                value={formData.date}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    'Por favor, complete este campo.'
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity('')
                }
                style={getErrorStyle('date')}
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
                    disabled={isDisplayMode}
                    name='quantity'
                    label='Cantidad'
                    type='text'
                    value={Number(detail.quantity).toLocaleString('es-PY')}
                    onChange={(e) => handleChange(e, index)}
                    fullWidth
                    required
                    onInvalid={(e) =>
                      (e.target as HTMLInputElement).setCustomValidity(
                        'Por favor, complete este campo.'
                      )
                    }
                    onInput={(e) =>
                      (e.target as HTMLInputElement).setCustomValidity('')
                    }
                    style={getErrorStyle('quantity')}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StyledTextField
                    disabled={isDisplayMode}
                    type='text' // Cambiar a texto para evitar restricciones de longitud
                    name='unit_price'
                    label='Precio unitario'
                    value={detail.unit_price.toLocaleString('es-PY')}
                    onChange={(e) => handleChange(e, index)}
                    fullWidth
                    required
                    onInvalid={(e) =>
                      (e.target as HTMLInputElement).setCustomValidity(
                        'Por favor, complete este campo.'
                      )
                    }
                    onInput={(e) =>
                      (e.target as HTMLInputElement).setCustomValidity('')
                    }
                    style={getErrorStyle('unit_price')}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <StyledTextField
                    select
                    disabled={isDisplayMode}
                    name='tax_type'
                    label='Tipo de Impuesto'
                    value={detail.tax_type}
                    onChange={(e) => handleChange(e, index)}
                    fullWidth
                    required
                    onInvalid={(e) =>
                      (e.target as HTMLInputElement).setCustomValidity(
                        'Por favor, complete este campo.'
                      )
                    }
                    onInput={(e) =>
                      (e.target as HTMLInputElement).setCustomValidity('')
                    }
                    style={getErrorStyle('tax_type')}
                  >
                    <MenuItem value='iva10'>IVA 10%</MenuItem>
                    <MenuItem value='iva5'>IVA 5%</MenuItem>
                    <MenuItem value='exenta'>Exento</MenuItem>
                  </StyledTextField>
                </Grid>
                {/* IconButton con DeleteIcon */}
                {!isDisplayMode && (
                  <StyledIconButton
                    color='error'
                    onClick={() => removeTransactionDetail(index)}
                  >
                    <DeleteIcon />
                  </StyledIconButton>
                )}
              </Grid>

              <Grid container spacing={3} mt={2}>
                <Grid item xs={12}>
                  <StyledTextField
                    disabled={isDisplayMode}
                    name='description'
                    label='Descripción'
                    value={detail.description}
                    onChange={(e) => handleChange(e, index)}
                    fullWidth
                    multiline
                    rows={3}
                    onInvalid={(e) =>
                      (e.target as HTMLInputElement).setCustomValidity(
                        'Por favor, complete este campo.'
                      )
                    }
                    onInput={(e) =>
                      (e.target as HTMLInputElement).setCustomValidity('')
                    }
                    style={getErrorStyle('description')}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}

          {!isDisplayMode && (
            <Box display='flex' justifyContent='flex-end' mt={2}>
              <StyledButton onClick={addTransactionDetail} type='button'>
                Agregar
              </StyledButton>
            </Box>
          )}
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
                  <TableCell>
                    {` ${new Intl.NumberFormat('es-PY').format(
                      totals.exempt.toFixed(2)
                    )}`}
                  </TableCell>

                  <TableCell>
                    {` ${new Intl.NumberFormat('es-PY').format(
                      totals.tax5.toFixed(2)
                    )}`}
                  </TableCell>

                  <TableCell>
                    {` ${new Intl.NumberFormat('es-PY').format(
                      totals.tax10.toFixed(2)
                    )}`}
                  </TableCell>
                  <TableCell>
                    {` ${new Intl.NumberFormat('es-PY').format(
                      totals.total.toFixed(2)
                    )}`}
                  </TableCell>
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
