import { Invoice } from '../interfaces/invoice';

const createInvoice = async (payload: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Error al guardar la factura.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createInvoice:', error);
    throw error;
  }
};

const fetchInvoices = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las facturas.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en fetchInvoices:', error);
    throw error;
  }
};
const fetchInvoiceDetails = async (
  invoiceId: number | string
): Promise<Invoice | null> => {
  const parsedInvoiceId = Number(invoiceId); // Convertimos a número
  if (isNaN(parsedInvoiceId)) return null; // Validamos que sea un número válido

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/invoices/${parsedInvoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener los detalles de la factura.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en fetchInvoiceDetails:', error);
    return null;
  }
};

const handleInvoiceView = async (invoiceId: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/invoices/${invoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener los detalles de la factura.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en handleViewInvoice:', error);
    throw error;
  }
};
const deleteInvoice = async (invoiceId: number) => {
  if (!Number.isInteger(invoiceId)) {
    console.error('ID de factura inválido:', invoiceId);
    return { success: false, error: 'ID de factura inválido' };
  }

  try {
    console.log('Eliminando factura con ID:', invoiceId);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/invoices/${invoiceId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;
      console.error('Error en DELETE:', errorMessage);
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error('Error en deleteInvoice:', error);
    return { success: false, error: 'Error al eliminar la factura' };
  }
};

export {
  createInvoice,
  fetchInvoices,
  fetchInvoiceDetails,
  handleInvoiceView,
  deleteInvoice,
};
