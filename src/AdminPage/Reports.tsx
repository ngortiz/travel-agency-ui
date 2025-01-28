import React, { useState } from 'react';
import styled from 'styled-components';
import { Box, IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print'; // Importación corregida

const ReportContainer = styled.div`
  padding: 3rem 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  max-width: 900px;
  margin: 0 auto;
  margin-top: 6.5rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: #127ca8;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
  display: block;
`;

const Select = styled.select`
  padding: 0.7rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;

  &:focus {
    outline: none;
    border-color: #127ca8;
    box-shadow: 0 0 5px rgba(18, 124, 168, 0.5);
  }
`;

const Input = styled.input`
  padding: 0.7rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;

  &:focus {
    outline: none;
    border-color: #127ca8;
    box-shadow: 0 0 5px rgba(18, 124, 168, 0.5);
  }
`;
const Button = styled.button({
  borderRadius: '20px',
  width: '20%',
  border: 'none',
  padding: '10px 15px',
  background: 'linear-gradient(90deg, #2196f3, #4caf50)',
  color: '#ffffff',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(90deg, #1e88e5, #43a047)',
  },
});

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

const TableContainer = styled.div`
  margin-top: 2rem;
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  align-items: center;
`;

const TableHead = styled.thead`
  background-color: #127ca8;
  color: white;
  align-items: center;

  th {
    padding: 0.8rem;
    text-align: left;
    font-size: 1rem;
    align-items: center;
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

const Report: React.FC = () => {
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generar datos ficticios para el reporte
    const fakeData = {
      type,
      startDate,
      endDate,
      entries: [
        {
          id: 1,
          date: '2023-01-10',
          amount: 150,
          customerName: 'Juan Pérez',
          ruc: '1234567890',
          invoiceNumber: 'FAC-001',
          paymentCondition: 'Contado',
          voucherType: 'Factura',
          status: 'Aceptado',
        },
        {
          id: 2,
          date: '2023-01-12',
          amount: -50,
          customerName: 'María Gómez',
          ruc: '0987654321',
          invoiceNumber: 'FAC-002',
          paymentCondition: 'Crédito',
          voucherType: 'Recibo',
          status: 'Anulado',
        },
        {
          id: 3,
          date: '2023-01-15',
          amount: 300,
          customerName: 'Carlos Sánchez',
          ruc: '1122334455',
          invoiceNumber: 'FAC-003',
          paymentCondition: 'Contado',
          voucherType: 'Factura',
          status: 'Aceptado',
        },
      ],
    };
    setGeneratedReport(fakeData);
  };

  return (
    <ReportContainer>
      <Title>Reportes de Ingresos y Gastos</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor='type'>Tipo:</Label>
          <Select
            id='type'
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value='' disabled>
              Seleccione tipo
            </option>
            <option value='ingreso'>Ingreso</option>
            <option value='egreso'>Egreso</option>
          </Select>
        </div>

        <div>
          <Label htmlFor='startDate'>Fecha Desde:</Label>
          <Input
            type='date'
            id='startDate'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor='endDate'>Fecha Hasta:</Label>
          <Input
            type='date'
            id='endDate'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <Button type='submit'>Generar</Button>
      </Form>

      {/* Mostrar el reporte generado */}
      {generatedReport && (
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th>Fecha</th>
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
          <StyledIconButton>
            <PrintIcon />
          </StyledIconButton>
        </TableContainer>
      )}
    </ReportContainer>
  );
};

export default Report;
