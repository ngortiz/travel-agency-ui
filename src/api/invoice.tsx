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
  } catch (error: any) {
    console.error('Error en createInvoice:', error);
    return { error: error.message };
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
  } catch (error: any) {
    console.error('Error en fetchInvoices:', error);
    return { error: error.message };
  }
};
const fetchInvoice = async (
  invoiceId: number
): Promise<Invoice | { error: string }> => {
  if (isNaN(invoiceId)) return { error: 'ID de factura inválido' };
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
  } catch (error: any) {
    console.error('Error en fetchInvoiceDetails:', error);
    return { error: error.message };
  }
};

const deleteInvoice = async (invoiceId: number) => {
  if (isNaN(invoiceId)) return { error: 'ID de factura inválido' };

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

export { createInvoice, fetchInvoices, fetchInvoice, deleteInvoice };
