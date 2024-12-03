import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 6rem 1rem;
  background: linear-gradient(135deg, #f2f2f2, #e0f7fa);
`;

const FormTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  color: #127ca8;
  margin-bottom: 2rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;

  padding-bottom: 0.5rem;
  width: 100%;
  max-width: 700px;
`;

const Form = styled.form`
  width: 100%;
  max-width: 700px;
  background-color: #ffffff;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 1.1rem;
  color: #37474f;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.9rem;
  font-size: 1rem;
  color: #37474f;
  border: 2px solid #d1d1d1;
  border-radius: 10px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #127ca8;
    background-color: #ffffff;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 0.9rem;
  font-size: 1rem;
  color: #37474f;
  border: 2px solid #d1d1d1;
  border-radius: 10px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
  resize: vertical;

  &:focus {
    border-color: #127ca8;
    background-color: #ffffff;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 40%;
  padding: 1rem;
  font-size: 1.1rem;
  background-color: #127ca8;
  color: #ffffff;
  border: 2px solid #127ca8;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 1 4px 15px rgba(0, 0, 0, 0.1);
  margin-left: 28%;

  &:hover {
    color: #127ca8;
    background-color: #ffffff;
  }

  &:active {
    background-color: #084268;
    transform: scale(0.98);
  }
`;

const CreatePackage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Datos del paquete enviados:', image);
  };

  return (
    <Container>
      <FormTitle>Crear Nuevo Paquete de Viaje</FormTitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nombre del Paquete:</Label>
          <Input type="text" placeholder="Ingrese el nombre del paquete" />
        </FormGroup>

        <FormGroup>
          <Label>Descripción:</Label>
          <TextArea placeholder="Ingrese una descripción"></TextArea>
        </FormGroup>

        <FormGroup>
          <Label>Precio:</Label>
          <Input type="number" placeholder="Ingrese el precio" />
        </FormGroup>

        <FormGroup>
          <Label>País:</Label>
          <Input type="text" placeholder="Ingrese el país" />
        </FormGroup>

        <FormGroup>
          <Label>Ciudad:</Label>
          <Input type="text" placeholder="Ingrese la ciudad" />
        </FormGroup>

        <FormGroup>
          <Label>Fechas:</Label>
          <Input type="date" />
        </FormGroup>

        <FormGroup>
          <Label>Duración:</Label>
          <Input type="text" placeholder="Ingrese la duración" />
        </FormGroup>

        <FormGroup>
          <Label>Incluye:</Label>
          <TextArea placeholder="Ingrese los servicios incluidos"></TextArea>
        </FormGroup>

        <FormGroup>
          <Label>No Incluye:</Label>
          <TextArea placeholder="Ingrese los servicios no incluidos"></TextArea>
        </FormGroup>

        <FormGroup>
          <Label>Imagen del Paquete:</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </FormGroup>

        <SubmitButton type="submit">Guardar Paquete</SubmitButton>
      </Form>
    </Container>
  );
};

export default CreatePackage;
