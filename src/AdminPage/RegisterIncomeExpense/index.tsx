import React, { useState, useEffect } from 'react';
import InvoiceTable from './InvoiceTable';
import FormComponent from './FormComponent';
import { Box } from '@mui/material';

interface Invoice {
  id: number;
  invoice: {
    headers: {
      document_number: string;
      customer: string;
      ruc: string;
      transaction_type: string;
      condition: string;
      date: string;
      total: number;
    };
  };
}

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

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Estado para almacenar las facturas

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
        const data: Invoice[] = await response.json();
        setInvoices(data); // Actualiza el estado con el tipo adecuado
      } else {
        console.error('Error al obtener las facturas:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
    }
  };

  // Función para eliminar una factura
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
        console.log(`Factura ${invoiceId} eliminada.`);
        fetchInvoices(); // Refresca las facturas después de eliminar
      } else {
        console.error('Error al eliminar factura:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar factura:', error);
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
      <>
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
      </>
    </Box>
  );
};

export default RegisterIncomeExpense;
