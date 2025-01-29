import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print'; // Importación corregida

const ReportContainer = styled.div`const ReportContainer = styled.div
padding: 3rem 2rem;
background: #ffffff;
border-radius: 10px;
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
max-width: 1200px;
margin: 0 auto;
margin-top: 6.5rem;
padding: 57px;

;`;

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
  border: 1px solid #1a76d2 ;
  border-radius: 8px;
  background-color: #f9f9f9;
  color:'#1a76d2 '
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

const TableContainer = styled.div`
  margin-top: 2rem;
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #127ca8;
  color: white;

  th {
    padding: 0.8rem;

    font-size: 1rem;
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

const StyledIconButton = styled(IconButton)({
  borderRadius: '50%',

  background: 'linear-gradient(90deg, #2196f3, #4caf50)',
  color: '#ffffff !important',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  transition: 'background 0.3s ease, transform 0.2s ease',
  marginLeft: '20px',
  marginTop: '22px',
  '&:hover': {
    background: 'linear-gradient(90deg, #1e88e5, #43a047)',
    transform: 'scale(1.1)',
  },
});

const Report: React.FC = () => {
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fakeData = {
      type,
      startDate,
      endDate,
      entries: [
        {
          id: 1,
          date: '2025-01-10',
          amount: 150,
          type: 'Ingreso',
          customerName: 'Juan Pérez',
          ruc: '1234567890',
          invoiceNumber: 'FAC-001',
          paymentCondition: 'Contado',
          voucherType: 'Factura',
          status: 'Aceptado',
        },
        {
          id: 2,
          date: '2025-01-12',
          amount: -50,
          type: 'Egreso',
          customerName: 'María Gómez',
          ruc: '0987654321',
          invoiceNumber: 'FAC-002',
          paymentCondition: 'Crédito',
          voucherType: 'Recibo',
          status: 'Anulado',
        },
        {
          id: 3,
          date: '2025-01-15',
          amount: 300,
          type: 'Ingreso',
          customerName: 'Carlos Sánchez',
          ruc: '1122334455',
          invoiceNumber: 'FAC-003',
          paymentCondition: 'Contado',
          voucherType: 'Factura',
          status: 'Aceptado',
        },
      ].filter((entry) => type === 'Todo' || entry.type === type),
    };
    setGeneratedReport(fakeData);
  };

  const totalIngresos =
    generatedReport?.entries
      .filter((e: any) => e.amount > 0)
      .reduce((acc: number, e: any) => acc + e.amount, 0) || 0;
  const totalGastos =
    generatedReport?.entries
      .filter((e: any) => e.amount < 0)
      .reduce((acc: number, e: any) => acc + Math.abs(e.amount), 0) || 0;
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

      {/* Mostrar el reporte generado */}
      {generatedReport && (
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cliente</th>
                <th>RUC</th>
                <th>Nro. Factura</th>
                <th>Condición de Venta</th>
                <th>Tipo Comprobante</th>
                <th>Estado</th>
                <th>Importe</th>
              </tr>
            </TableHead>

            <TableBody>
              {generatedReport.entries.map((entry: any) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.type}</td>
                  <td>{entry.customerName}</td>
                  <td>{entry.ruc}</td>
                  <td>{entry.invoiceNumber}</td>
                  <td>{entry.paymentCondition}</td>
                  <td>{entry.voucherType}</td>
                  <td>{entry.status}</td>
                  <td
                    className={`amount ${
                      entry.amount > 0 ? 'positive' : 'negative'
                    }`}
                  >
                    ${entry.amount}
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
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
        </TableContainer>
      )}
    </ReportContainer>
  );
};

export default Report;
