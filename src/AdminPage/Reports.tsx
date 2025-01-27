import React, { useState } from 'react';
import styled from 'styled-components';

const ReportContainer = styled.div`
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #127ca8;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #555;
`;

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;

  &:focus {
    outline: none;
    border-color: #127ca8;
    box-shadow: 0 0 5px rgba(18, 124, 168, 0.5);
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;

  &:focus {
    outline: none;
    border-color: #127ca8;
    box-shadow: 0 0 5px rgba(18, 124, 168, 0.5);
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background-color: #127ca8;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0e6390;
  }
`;

const Report: React.FC = () => {
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Tipo: ${type}, Desde: ${startDate}, Hasta: ${endDate}`);
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

        <Button type='submit'>Generar Reporte</Button>
      </Form>
    </ReportContainer>
  );
};

export default Report;
