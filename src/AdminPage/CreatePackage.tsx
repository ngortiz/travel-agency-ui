import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const Notification = styled.div<{ show: boolean; type: 'success' | 'error' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px;
  color: ${(props) => (props.type === 'success' ? '#3c763d' : '#a94442')};
  background-color: ${(props) =>
    props.type === 'success' ? '#dff0d8' : '#f2dede'};
  border: 1px solid transparent;
  border-color: ${(props) =>
    props.type === 'success' ? '#d6e9c6' : '#ebccd1'};
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform: translateY(${(props) => (props.show ? '0' : '-20px')});
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const CreatePackage: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null); // Ref para el formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost_price: '',
    sell_price: '',
    city: '',
    country: '',
    start_date: '',
    end_date: '',
    included_services: '',
    non_included_services: '',
    image_url: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // fetch a la api con el id
      fetchPackage(id);
      setIsEditMode(true);
    }
  }, []);

  const fetchPackage = async (id: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/packages/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    setFormData({
      name: data.name,
      description: data.description,
      cost_price: data.cost_price,
      sell_price: data.sell_price,
      city: data.city,
      country: data.country,
      start_date: data.start_date,
      end_date: data.end_date,
      included_services: data.included_services.join(','),
      non_included_services: data.non_included_services.join(','),
      image_url: data.image_url,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image && !formData.image_url) {
      setNotification({
        show: true,
        message: 'Por favor, selecciona o conserva una imagen.',
        type: 'error',
      });
      setTimeout(
        () => setNotification({ show: false, message: '', type: 'success' }),
        3000
      );
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('authToken');
      if (!token) {
        setNotification({
          show: true,
          message: 'Token no encontrado. Por favor inicia sesión nuevamente.',
          type: 'error',
        });
        setTimeout(
          () => setNotification({ show: false, message: '', type: 'success' }),
          3000
        );
        return;
      }

      const imageBase64 = image ? await convertImageToBase64(image) : null;

      const payload = {
        package: {
          ...formData,
          cost_price: parseFloat(formData.cost_price),
          sell_price: parseFloat(formData.sell_price),
          included_services: formData.included_services
            .split(',')
            .map((s) => s.trim()),
          non_included_services: formData.non_included_services
            .split(',')
            .map((s) => s.trim()),
          image: imageBase64
            ? {
                data: imageBase64,
                format: image ? image.type.split('/')[1].toUpperCase() : '',
              }
            : formData.image_url // Si no hay imagen nueva, usa la URL existente
            ? { url: formData.image_url }
            : null,
        },
      };

      const url = isEditMode
        ? `${import.meta.env.VITE_API_URL}/packages/${id}`
        : `${import.meta.env.VITE_API_URL}/packages`;
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorDetails = await response.json().catch(() => null);
        setNotification({
          show: true,
          message: `Error: ${errorDetails?.message || response.statusText}`,
          type: 'error',
        });
        setTimeout(
          () => setNotification({ show: false, message: '', type: 'success' }),
          3000
        );
        return;
      }

      setNotification({
        show: true,
        message: id
          ? 'Paquete actualizado exitosamente.'
          : 'Paquete creado exitosamente.',
        type: 'success',
      });

      // Limpia el formulario usando el ref
      formRef.current?.reset();
      setFormData({
        name: '',
        description: '',
        cost_price: '',
        sell_price: '',
        city: '',
        country: '',
        start_date: '',
        end_date: '',
        included_services: '',
        non_included_services: '',
        image_url: '',
      });
      setImage(null);
    } catch (error) {
      console.error('Error capturado:', error);
      setNotification({
        show: true,
        message: 'Error al crear el paquete.',
        type: 'error',
      });
    } finally {
      setLoading(false);
      setTimeout(
        () => setNotification({ show: false, message: '', type: 'success' }),
        3000
      );
    }
  };

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

  return (
    <Container>
      <FormTitle>Crear Nuevo Paquete de Viaje</FormTitle>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nombre del Paquete:</Label>
          <Input
            type='text'
            name='name'
            placeholder='Ingrese el nombre del paquete'
            onChange={handleChange}
            value={formData.name}
          />
        </FormGroup>
        <FormGroup>
          <Label>Descripción:</Label>
          <TextArea
            name='description'
            placeholder='Ingrese una descripción'
            onChange={handleChange}
            value={formData.description}
          ></TextArea>
        </FormGroup>
        <FormGroup>
          <Label>Precio de Costo:</Label>
          <Input
            type='number'
            name='cost_price'
            placeholder='Ingrese el precio de costo'
            onChange={handleChange}
            value={formData.sell_price}
          />
        </FormGroup>
        <FormGroup>
          <Label>Precio de Venta:</Label>
          <Input
            type='number'
            name='sell_price'
            placeholder='Ingrese el precio de venta'
            onChange={handleChange}
            value={formData.sell_price}
          />
        </FormGroup>
        <FormGroup>
          <Label>Ciudad:</Label>
          <Input
            type='text'
            name='city'
            placeholder='Ingrese la ciudad'
            onChange={handleChange}
            value={formData.city}
          />
        </FormGroup>
        <FormGroup>
          <Label>País:</Label>
          <Input
            type='text'
            name='country'
            placeholder='Ingrese el país'
            onChange={handleChange}
            value={formData.country}
          />
        </FormGroup>
        <FormGroup>
          <Label>Fecha de Inicio:</Label>
          <Input
            type='date'
            name='start_date'
            onChange={handleChange}
            value={formData.start_date}
          />
        </FormGroup>
        <FormGroup>
          <Label>Fecha de Fin:</Label>
          <Input
            type='date'
            name='end_date'
            onChange={handleChange}
            value={formData.end_date}
          />
        </FormGroup>
        <FormGroup>
          <Label>Servicios Incluidos:</Label>
          <TextArea
            name='included_services'
            placeholder='Ingrese los servicios'
            onChange={handleChange}
            value={formData.included_services}
          ></TextArea>
        </FormGroup>
        <FormGroup>
          <Label>Imagen del Paquete:</Label>
          {formData.image_url && !image && (
            <div>
              <img
                src={formData.image_url}
                alt='Imagen del paquete'
                style={{ maxWidth: '100%', marginBottom: '1rem' }}
              />
              <p>
                Imagen actual. Puedes cargar una nueva si deseas reemplazarla.
              </p>
            </div>
          )}
          <Input
            type='file'
            accept='image/*'
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]); // Actualiza el estado solo si hay archivo
              }
            }}
          />
        </FormGroup>

        {isEditMode ? (
          <SubmitButton type='submit' disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Paquete'}
          </SubmitButton>
        ) : (
          <SubmitButton type='submit' disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Paquete'}
          </SubmitButton>
        )}
      </Form>

      {notification.show && (
        <Notification show={notification.show} type={notification.type}>
          {notification.message}
        </Notification>
      )}
    </Container>
  );
};

export default CreatePackage;
