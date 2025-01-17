import React, { useState, useEffect } from 'react';
import InvoiceTable from './InvoiceTable';
import FormComponent from './FormComponent';
import { Box, Snackbar, Alert } from '@mui/material';
import { Invoice } from '../../interfaces/invoice';

// Utilidades para formatear números
const formatNumber = (value: number): string =>
  value.toLocaleString('es-ES', { minimumFractionDigits: 0 });
const unformatNumber = (value: string): number =>
  parseFloat(value.replace(/\./g, '')) || 0;

interface TransactionDetail {
  quantity: string;
  unit_price: string;
  tax_type: string;
  description: string;
}

const RegisterIncomeExpense: React.FC = () => {
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
  >([{ quantity: '', unit_price: '', tax_type: '', description: '' }]);

  const [totals, setTotals] = useState({
    exempt: 0,
    tax5: 0,
    tax10: 0,
    total: 0,
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);

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

  const calculateTotals = (details: TransactionDetail[]) => {
    let exempt = 0;
    let tax5 = 0;
    let tax10 = 0;

    details.forEach((detail) => {
      const quantity = unformatNumber(detail.quantity);
      const unitPrice = unformatNumber(detail.unit_price);
      const subtotal = quantity * unitPrice;

      if (detail.tax_type === 'Exento') {
        exempt += subtotal;
      } else if (detail.tax_type === 'IVA 5%') {
        tax5 += subtotal / 21;
      } else if (detail.tax_type === 'IVA 10%') {
        tax10 += subtotal / 11;
      }
    });

    setTotals({
      exempt,
      tax5: Math.round(tax5),
      tax10: Math.round(tax10),
      total: exempt + tax5 * 21 + tax10 * 11,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedDetails = [...transactionDetails];
      if (name === 'quantity' || name === 'unit_price') {
        updatedDetails[index][name as keyof TransactionDetail] = formatNumber(
          unformatNumber(value.replace(/\D/g, ''))
        );
      } else {
        updatedDetails[index][name as keyof TransactionDetail] = value;
      }

      setTransactionDetails(updatedDetails);
      calculateTotals(updatedDetails);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const addTransactionDetail = () => {
    setTransactionDetails([
      ...transactionDetails,
      { quantity: '', unit_price: '', tax_type: '', description: '' },
    ]);
  };

  const removeTransactionDetail = (index: number) => {
    const updatedDetails = transactionDetails.filter((_, i) => i !== index);
    setTransactionDetails(updatedDetails);
    calculateTotals(updatedDetails);
  };

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
          quantity: unformatNumber(detail.quantity),
          unit_price: unformatNumber(detail.unit_price),
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
          { quantity: '', unit_price: '', tax_type: '', description: '' },
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
      />
      <InvoiceTable invoices={invoices} deleteInvoice={deleteInvoice} />
    </Box>
  );
};

export default RegisterIncomeExpense;
