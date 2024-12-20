import React, { useState } from 'react';
import styled from 'styled-components';
import { FiUpload, FiTrash } from 'react-icons/fi';

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

const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #127ca8;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
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
  border: 1px solid #127ca8;
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
`;

const Placeholder = styled.p`
  font-size: 1rem;
  color: #999;
  margin-top: 10px;
`;

const Button = styled.button`
  width: 100%;
  max-width: 200px;
  padding: 10px 20px;
  background-color: #127ca8;
  color: white;
  border: none;
  border-radius: 10px;
  margin-top: 20px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 300px;
  border-radius: 10px;
  margin-top: 10px;
`;

const DeleteButton = styled(Button)`
  background-color: #ff5c5c;

  &:hover {
    background-color: white;
    color: #ff5c5c;
    border: 2px solid #ff5c5c;
  }
`;

const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
  });
};

const UploadBanners: React.FC = () => {
  const [banners, setBanners] = useState<{ [key: string]: File | null }>({
    banner1: null,
    banner2: null,
    banner3: null,
    banner4: null,
  });

  const [notifications, setNotifications] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>(
    {}
  );

  const addNotification = (message: string) => {
    setNotifications((prev) => [...prev, message]);
    setTimeout(() => setNotifications((prev) => prev.slice(1)), 3000);
  };

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

  const handleUpload = async (bannerKey: string) => {
    const file = banners[bannerKey];
    if (file && !isUploading[bannerKey]) {
      setIsUploading((prev) => ({ ...prev, [bannerKey]: true }));
      try {
        const base64Image = await convertImageToBase64(file);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/banners`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              banner: {
                image: {
                  format: file.type.split('/')[1],
                  data: base64Image,
                },
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        addNotification(`Banner ${bannerKey.toUpperCase()} subido con éxito`);
      } catch (error) {
        addNotification(
          error instanceof Error ? error.message : 'Error desconocido'
        );
      } finally {
        setIsUploading((prev) => ({ ...prev, [bannerKey]: false }));
      }
    }
  };

  const handleDelete = (bannerKey: string) => {
    setBanners((prev) => ({ ...prev, [bannerKey]: null }));
    addNotification(`Banner ${bannerKey.toUpperCase()} eliminado`);
  };

  return (
    <Container>
      <Title>Subir Banners</Title>
      {notifications.map((note, index) => (
        <Notification key={index}>{note}</Notification>
      ))}
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
                <>
                  <PreviewImage
                    src={URL.createObjectURL(banners[bannerKey]!)}
                    alt={`Vista previa de ${bannerKey}`}
                  />
                  <FileName>{banners[bannerKey]?.name}</FileName>
                  <Button
                    disabled={isUploading[bannerKey]}
                    onClick={() => handleUpload(bannerKey)}
                  >
                    {isUploading[bannerKey] ? 'Subiendo...' : 'Subir'}
                  </Button>
                  <DeleteButton onClick={() => handleDelete(bannerKey)}>
                    Eliminar
                  </DeleteButton>
                </>
              ) : (
                <Placeholder>No se ha seleccionado un archivo</Placeholder>
              )}
            </UploadSection>
          </UploadBox>
        ))}
      </BannerContainer>
    </Container>
  );
};

export default UploadBanners;
