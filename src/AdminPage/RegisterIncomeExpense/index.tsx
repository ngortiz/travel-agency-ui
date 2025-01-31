import React, { useState, useEffect } from 'react';
import InvoiceTable from './InvoiceTable';
import FormComponent from './FormComponent';
import { Box, Snackbar, Alert, Button } from '@mui/material';
import { Invoice } from '../../interfaces/invoice';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { TransactionDetail } from '../../interfaces/transactionDetail';
import { useParams, useNavigate } from 'react-router-dom';

// Desformatear el número a un formato limpio para cálculos
const unformatNumber = (value: string): number => {
  const numericValue = value.replace(/[^\d.]/g, '');
  return parseFloat(numericValue);
};

const RegisterIncomeExpense: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>(); // Obtener el ID desde la URL
  const navigate = useNavigate(); // Usamos el hook de navegación

  useEffect(() => {
    if (invoiceId) {
      invoiceId;
    }
  }, [invoiceId]);

  // Estado para visualizar/ocultar la tabla

  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

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

  const [errors, setErrors] = useState({
    customer: false,
    ruc: false,
    email: false,
    condition: false,
    transaction_type: false,
    document_type: false,
    document_number: false,
    date: false,
  });

  const [transactionDetails, setTransactionDetails] = useState<
    TransactionDetail[]
  >([{ quantity: 0, unit_price: 0, tax_type: '', description: '' }]);

  const [totals, setTotals] = useState({
    exempt: 0,
    tax5: 0,
    tax10: 0,
    total: 0,
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isDisplayMode, setIsDisplayMode] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState<number | null>(
    null
  );

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData]) {
        newErrors[key] = true;
        isValid = false;
      } else {
        newErrors[key] = false;
      }
    });

    transactionDetails.forEach((detail, index) => {
      if (
        !detail.quantity ||
        !detail.unit_price ||
        !detail.tax_type ||
        !detail.description
      ) {
        isValid = false;
        newErrors[`transactionDetails-${index}`] = true;
      }
    });

    setErrors(newErrors);
    return isValid;
  };
  const calculateTotals = () => {
    const newTotals = { exempt: 0, tax5: 0, tax10: 0, total: 0 };

    transactionDetails.forEach((detail) => {
      const quantity = detail.quantity || 0;
      const unitPrice = detail.unit_price || 0;
      const subtotal = quantity * unitPrice;

      if (detail.tax_type === 'exenta') {
        newTotals.exempt += subtotal;
      } else if (detail.tax_type === 'iva5') {
        newTotals.tax5 += (subtotal / 1.05) * 0.05;
      } else if (detail.tax_type === 'iva10') {
        newTotals.tax10 += (subtotal / 1.1) * 0.1;
      }

      newTotals.total += subtotal;
    });

    setTotals({
      exempt: Math.round(newTotals.exempt),
      tax5: Math.round(newTotals.tax5),
      tax10: Math.round(newTotals.tax10),
      total: Math.round(newTotals.total),
    });
  };

  useEffect(() => {
    calculateTotals();
  }, [transactionDetails]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    const normalizedValue =
      name === 'quantity' || name === 'unit_price'
        ? parseFloat(value.replace(/\./g, '').replace(/,/g, '')) || 0
        : value;

    if (typeof index === 'number') {
      transactionDetails[index] = {
        ...transactionDetails[index],
        [name]: normalizedValue,
      };
      setTransactionDetails([...transactionDetails]);
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const addTransactionDetail = () => {
    setTransactionDetails([
      ...transactionDetails,
      { quantity: 0, unit_price: 0, tax_type: '', description: '' },
    ]);
  };

  const removeTransactionDetail = (index: number) => {
    const updatedDetails = transactionDetails.filter((_, i) => i !== index);
    setTransactionDetails(updatedDetails);
    calculateTotals();
  };
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (invoiceId) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/invoices/${invoiceId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              },
            }
          );

          if (response.ok) {
            const invoice: Invoice = await response.json();
            setSelectedInvoice(invoice);
            setFormData(invoice.invoice.headers);

            const details = invoice.invoice.details.map((detail) => ({
              quantity: Number(detail.quantity),
              unit_price: Number(detail.unit_price),
              tax_type: detail.tax_type,
              description: detail.description,
            }));

            setTransactionDetails(details);
            calculateTotals(); // Recalcular totales al cargar los detalles

            setIsDisplayMode(true);
          } else {
            setNotification({
              show: true,
              message: 'Error al obtener los detalles de la factura.',
              type: 'error',
            });
          }
        } catch (error) {
          setNotification({
            show: true,
            message: 'Error al obtener los detalles de la factura.',
            type: 'error',
          });
        }
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]); // Asegúrate de que esto se ejecute cada vez que cambie `invoiceId`

  const fetchInvoices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        const data: Invoice[] = await response.json();
        setInvoices(data);
      } else {
        setNotification({
          show: true,
          message: 'Error al obtener las facturas.',
          type: 'error',
        });
      }
    } catch (error) {
      setNotification({
        show: true,
        message: 'Error al obtener las facturas.',
        type: 'error',
      });
    }
  };
  const handleBackButton = () => {
    navigate('/admin/reports'); // Redirige a la página de reportes
  };

  const handleViewInvoice = async (invoiceId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/invoices/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (response.ok) {
        const invoice: Invoice = await response.json();

        setSelectedInvoice(invoice);
        setFormData(invoice.invoice.headers);

        const details = invoice.invoice.details.map((detail) => ({
          quantity: Number(detail.quantity),
          unit_price: Number(detail.unit_price),
          tax_type: detail.tax_type,
          description: detail.description,
        }));

        setTransactionDetails(details);
        calculateTotals();

        setIsDisplayMode(true);
      } else {
        throw new Error('Error al obtener los detalles de la factura.');
      }
    } catch (error) {
      setNotification({
        show: true,
        message: 'Error al obtener los detalles de la factura.',
        type: 'error',
      });
    }
  };

  const handleOpenModal = (invoiceId: number) => {
    setInvoiceIdToDelete(invoiceId); // Guardamos el ID de la factura a eliminar
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInvoiceIdToDelete(null); // Resetear el ID al cerrar el modal
  };

  const handleConfirmDelete = () => {
    if (invoiceIdToDelete !== null) {
      deleteInvoice(invoiceIdToDelete);
    }
    setIsModalOpen(false); // Cerrar el modal después de confirmar
  };

  const deleteInvoice = async (invoiceId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/invoices/${invoiceId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (response.ok) {
        setNotification({
          show: true,
          message: 'Factura eliminada exitosamente.',
          type: 'success',
        });
        fetchInvoices();
      } else {
        setNotification({
          show: true,
          message: 'Error al eliminar la factura.',
          type: 'error',
        });
      }
    } catch (error) {
      setNotification({
        show: true,
        message: 'Error al eliminar la factura.',
        type: 'error',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setNotification({
        show: true,
        message: 'Por favor, complete todos los campos obligatorios.',
        type: 'error',
      });
      return;
    }

    const payload = {
      invoice: {
        headers: formData,
        details: transactionDetails.map((detail) => ({
          quantity: unformatNumber(detail.quantity.toString()),
          unit_price: unformatNumber(detail.unit_price.toString()),
          description: detail.description,
          tax_type: detail.tax_type,
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
        setNotification({
          show: true,
          message: 'Factura guardada exitosamente.',
          type: 'success',
        });
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
          { quantity: 0, unit_price: 0, tax_type: '', description: '' },
        ]);
        setTotals({ exempt: 0, tax5: 0, tax10: 0, total: 0 });
        fetchInvoices();
      } else {
        setNotification({
          show: true,
          message: 'Error al guardar la factura.',
          type: 'error',
        });
      }
    } catch (error) {
      setNotification({
        show: true,
        message: 'Error al guardar la factura.',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

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
      <Snackbar
        open={notification.show}
        autoHideDuration={3000}
        onClose={() =>
          setNotification({ show: false, message: '', type: 'success' })
        }
      >
        <Alert
          onClose={() =>
            setNotification({ show: false, message: '', type: 'success' })
          }
          severity={notification.type}
          sx={{ width: '110%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <FormComponent
        formData={formData}
        transactionDetails={transactionDetails}
        totals={totals}
        handleChange={handleChange}
        addTransactionDetail={addTransactionDetail}
        removeTransactionDetail={removeTransactionDetail}
        handleSubmit={handleSubmit}
        isDisplayMode={isDisplayMode}
      />
      {/* Mostrar solo el botón Volver Atrás si estamos en modo visualización */}
      {isDisplayMode && (
        <Button
          variant='contained'
          color='primary'
          onClick={handleBackButton}
          sx={{
            marginBottom: '20px',
            background: 'linear-gradient(90deg, #2196f3, #4caf50)',
            padding: '10px 20px',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: '600',
            textTransform: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(90deg, #1e88e5, #43a047)',
              transform: 'scale(1.05)',
            },
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          Volver Atrás
        </Button>
      )}

      {/* Mostrar la tabla de facturación solo si NO estamos en modo de visualización */}
      {!isDisplayMode && (
        <InvoiceTable
          invoices={invoices}
          deleteInvoice={handleOpenModal}
          onViewInvoice={handleViewInvoice}
        />
      )}

      {/* Confirmar la eliminación de la factura en un modal */}
      <ConfirmDeleteModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default RegisterIncomeExpense;
