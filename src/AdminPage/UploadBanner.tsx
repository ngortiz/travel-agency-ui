import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUpload, FiTrash } from 'react-icons/fi';
import { CircularProgress, Box } from '@mui/material';
import Swal from 'sweetalert2';

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
  background-color: #dff0d8;
  border: 1px solid transparent;
  color: #3c763d;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
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

const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 300px;
  border-radius: 10px;
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

const DeleteButton = styled(Button)`
  font-weight: 600;
  background: linear-gradient(90deg, #2196f3, #4caf50);
  width: 33%;

  &:hover {
    background: linear-gradient(90deg, #1e88e5, #43a047);
  }
`;

const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

const UploadBanners: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/banners`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const addNotification = (message: string) => {
    setNotifications((prev) => [...prev, message]);
    setTimeout(() => setNotifications((prev) => prev.slice(1)), 5000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
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
        addNotification('Banner subido con éxito');
        fetchBanners();
      } catch (error) {
        console.error('Error uploading banner:', error);
        addNotification('Error al subir el banner');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/banners/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setBanners((prevBanners) =>
        prevBanners.filter((banner) => banner.id !== id)
      );
      Swal.fire({
        title: '¡Eliminado!',
        text: 'El banner ha sido eliminado con éxito.',
        icon: 'success',
        confirmButtonColor: '#127ca8',
      });
      // Volver a obtener los banners desde la API para evitar inconsistencias
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      addNotification('Error al eliminar el banner');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa, #e3f2fd)',
        padding: '50px',
      }}
    >
      <Title>Subir Banners</Title>
      {notifications.map((note, index) => (
        <Notification key={index}>{note}</Notification>
      ))}
      {isLoading ? (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='100vh'
        >
          <CircularProgress />
        </Box>
      ) : (
        <BannerContainer>
          {banners.map((banner) => (
            <UploadBox key={banner.id}>
              <PreviewImage
                src={banner.image_url}
                alt={`Banner ${banner.id}`}
              />
              <DeleteButton onClick={() => handleDelete(banner.id)}>
                <FiTrash /> Eliminar
              </DeleteButton>
            </UploadBox>
          ))}
          <UploadBox>
            <UploadSection>
              <Label htmlFor='file-upload'>
                <FiUpload />
                Selecciona un archivo
              </Label>
              <Input
                id='file-upload'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
              />
              {isUploading && <Button disabled>Subiendo...</Button>}
            </UploadSection>
          </UploadBox>
        </BannerContainer>
      )}
    </Box>
  );
};

export default UploadBanners;
