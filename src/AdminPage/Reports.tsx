import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InvoiceTable from './RegisterIncomeExpense/InvoiceTable';
import { Invoice } from '../interfaces/invoice';
import { useNavigate } from 'react-router-dom';

const ReportContainer = styled.div`
  padding: 3rem 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 6.5rem;
`;

const TableContainer = styled.div`
  margin-top: 2rem;
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: #127ca8;
  margin-bottom: 3.5rem;
  text-align: center;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
`;

const Select = styled.select`
  padding: 0.7rem 4rem;
  font-size: 1rem;
  border: 1px solid #1a76d2;
  border-radius: 8px;
  background-color: #f9f9f9;
  &:focus {
    outline: none;
    border-color: #127ca8;
    box-shadow: 0 0 5px rgba(18, 124, 168, 0.5);
  }
`;

const Input = styled.input`
  padding: 0.7rem 4rem;
  font-size: 1rem;
  border: 1px solid #1a76d2;
  border-radius: 8px;
  background-color: #f9f9f9;
  &:focus {
    outline: none;
    border-color: #127ca8;
    box-shadow: 0 0 5px rgba(18, 124, 168, 0.5);
  }
`;

const Button = styled.button`
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  padding: 13px 15px;
  background: linear-gradient(90deg, #2196f3, #4caf50);
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  margin-right: 15px;
  width: 10%;
  &:hover {
    background: linear-gradient(90deg, #1e88e5, #43a047);
  }
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  td {
    padding: 0.8rem;
    font-size: 0.9rem;
    color: #333;
  }
  td.amount {
    font-weight: bold;
  }
  td.positive {
    color: green;
  }
  td.negative {
    color: red;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Reports: React.FC<{ onViewInvoice: (invoiceId: number) => void }> = ({
  onViewInvoice,
}) => {
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [generatedReport, setGeneratedReport] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

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
        setGeneratedReport(data);
      } else {
        console.error('Error al obtener las facturas.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const navigate = useNavigate();

  const handleViewInvoice = (invoiceId: number) => {
    navigate(`/visualizar-factura/${invoiceId}`);
  };

  // Filtrar facturas según el tipo seleccionado
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filteredData = invoices.filter(
      (invoice) =>
        type === 'Todo' || invoice.invoice.headers.transaction_type === type
    );

    setGeneratedReport(filteredData);
  };

  const deleteInvoice = (invoiceId: number) => {
    setGeneratedReport((prev) =>
      prev.filter((invoice) => invoice.invoice.headers.id !== invoiceId)
    );
  };

  const totalIngresos =
    generatedReport
      .filter(
        (invoice) => invoice.invoice.headers.transaction_type === 'Ingreso'
      )
      .reduce((acc, invoice) => acc + invoice.invoice.headers.total, 0) || 0;

  const totalGastos =
    generatedReport
      .filter(
        (invoice) => invoice.invoice.headers.transaction_type === 'Egreso'
      )
      .reduce((acc, invoice) => acc + invoice.invoice.headers.total, 0) || 0;

  const diferencia = totalIngresos - totalGastos;

  return (
    <ReportContainer>
      <Title>Reportes de Ingresos y Gastos</Title>
      <Form onSubmit={handleSubmit}>
        <Select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value='' disabled>
            Seleccione tipo
          </option>
          <option value='Todo'>Todo</option>
          <option value='Ingreso'>Ingreso</option>
          <option value='Egreso'>Egreso</option>
        </Select>
        <Input
          type='date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          type='date'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <Button type='submit'>Generar</Button>
      </Form>

      <InvoiceTable
        invoices={generatedReport}
        deleteInvoice={deleteInvoice}
        onViewInvoice={onViewInvoice}
      />

      <TableContainer>
        <Table>
          <TableBody>
            <tr>
              <td>Total Ingresos:</td>
              <td>${totalIngresos}</td>
            </tr>
            <tr>
              <td>Total Gastos:</td>
              <td>${totalGastos}</td>
            </tr>
            <tr>
              <td>Diferencia:</td>
              <td>${diferencia}</td>
            </tr>
          </TableBody>
        </Table>
      </TableContainer>
    </ReportContainer>
  );
};

export default Reports;
