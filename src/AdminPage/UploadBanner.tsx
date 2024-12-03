import React, { useState } from 'react';
import styled from 'styled-components';
import { FiUpload } from 'react-icons/fi';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa, #fffffff);
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #127ca8;
  margin-bottom: 2rem;
  text-align: center;
`;

const UploadBox = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  svg {
    color: #127ca8;
    font-size: 1.5rem;
  }
`;

const Input = styled.input`
  display: none;
`;

const FileName = styled.p`
  font-size: 1rem;
  color: #666;
  margin-top: 10px;
  font-style: italic;
`;

const Placeholder = styled.p`
  font-size: 1rem;
  color: #999;
  font-style: italic;
  margin-top: 10px;
`;

const Button = styled.button`
  width: 100%;
  max-width: 200px;
  padding: 10px 20px;
  background-color: #127ca8;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    color: #127ca8;
    background-color: #ffffff;
    border: 2px solid #127ca8;
  }

  &:active {
    background-color: #084268;
    transform: scale(0.98);
  }
`;

const UploadBanner: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      alert(`Subiendo archivo: ${file.name}`);
    } else {
      alert('Por favor selecciona un archivo antes de subir.');
    }
  };

  return (
    <Container>
      <Title>Subir Banner</Title>
      <UploadBox>
        <UploadSection>
          <Label htmlFor="file-upload">
            <FiUpload />
            Selecciona un archivo de imagen
          </Label>
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {file ? (
            <FileName>{file.name}</FileName>
          ) : (
            <Placeholder>No se ha seleccionado un archivo</Placeholder>
          )}
          <Button onClick={handleUpload}>Subir Banner</Button>
        </UploadSection>
      </UploadBox>
    </Container>
  );
};

export default UploadBanner;
