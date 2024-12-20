import React, { useState } from 'react';
import styled from 'styled-components';
import { FiUpload } from 'react-icons/fi';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f7ff, #ffffff);
  padding: 40px 20px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #127ca8;
  margin-bottom: 2rem;
  text-align: center;
`;

const BannerContainer = styled.div`
  display: grid;
  gap: 20px;
  width: 90%;
  max-width: 500px;
`;

const UploadBox = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #127ca8;

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

const UploadBanners: React.FC = () => {
  const [banners, setBanners] = useState<{ [key: string]: File | null }>({
    banner1: null,
    banner2: null,
    banner3: null,
    banner4: null,
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    bannerKey: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanners((prev) => ({
        ...prev,
        [bannerKey]: file,
      }));
    }
  };

  const handleUpload = (bannerKey: string) => {
    const file = banners[bannerKey];
    if (file) {
      alert(`Subiendo archivo para ${bannerKey}: ${file.name}`);
    } else {
      alert(
        `Por favor selecciona un archivo para ${bannerKey} antes de subir.`
      );
    }
  };

  return (
    <Container>
      <Title>Subir Banners</Title>
      <BannerContainer>
        {Object.keys(banners).map((bannerKey) => (
          <UploadBox key={bannerKey}>
            <UploadSection>
              <Label htmlFor={`file-upload-${bannerKey}`}>
                <FiUpload />
                Selecciona un archivo para {bannerKey.toUpperCase()}
              </Label>
              <Input
                id={`file-upload-${bannerKey}`}
                type='file'
                accept='image/*'
                onChange={(e) => handleFileChange(e, bannerKey)}
              />
              {banners[bannerKey] ? (
                <FileName>{banners[bannerKey]?.name}</FileName>
              ) : (
                <Placeholder>No se ha seleccionado un archivo</Placeholder>
              )}
              <Button onClick={() => handleUpload(bannerKey)}>
                Subir {bannerKey.toUpperCase()}
              </Button>
            </UploadSection>
          </UploadBox>
        ))}
      </BannerContainer>
    </Container>
  );
};

export default UploadBanners;
