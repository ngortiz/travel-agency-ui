import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import styled from 'styled-components';
import { Box } from '@mui/material';

// 🎨 Estilos con styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f7fc;
  padding: 20px;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 15px;
`;

const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

const FileName = styled.p`
  margin: 10px 0;
  color: #555;
  font-size: 14px;
`;

const Button = styled.button`
  background: #28a745;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
  margin-top: 15px;

  &:hover {
    background: #218838;
  }
`;

const DataPreview = styled.pre`
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  text-align: left;
  max-height: 200px;
  overflow-y: auto;
  font-size: 12px;
  border: 1px solid #ddd;
  width: 100%;
  margin-top: 10px;
`;

const UploadExcel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);

  // 📌 Función para manejar la carga del archivo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      readExcel(uploadedFile);
    }
  };

  // 📌 Función para leer el archivo Excel
  const readExcel = (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      try {
        const bufferArray = e.target?.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws, {
          defval: '',
          raw: false,
        });

        console.log(
          '📑 Columnas detectadas en el Excel:',
          Object.keys(jsonData[0] || {})
        );
        console.log('📊 Datos leídos del Excel:', jsonData);

        setData(jsonData);
      } catch (error) {
        console.error('❌ Error leyendo el archivo Excel:', error);
        alert(
          'Hubo un error al leer el archivo. Asegúrate de que el formato sea correcto.'
        );
      }
    };
  };

  const convertExcelDate = (excelValue: any) => {
    if (!excelValue) return '';

    if (typeof excelValue === 'number') {
      // Si es un número, lo convertimos desde el formato de Excel
      const excelEpoch = new Date(1899, 11, 30);
      const convertedDate = new Date(
        excelEpoch.getTime() + excelValue * 86400000
      );
      return convertedDate.toISOString().split('T')[0]; // Devuelve YYYY-MM-DD
    }

    if (typeof excelValue === 'string') {
      // Si ya es una cadena, intentamos formatearla correctamente
      const parsedDate = new Date(excelValue);
      return isNaN(parsedDate.getTime())
        ? ''
        : parsedDate.toISOString().split('T')[0];
    }

    return '';
  };
  function blobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // Resolve with Base64 data
      reader.onerror = reject; // Handle errors
      reader.readAsDataURL(blob);
    });
  }
  const cleanRowData = async (row: any) => {
    const response = await fetch(row['image_url'], {
      method: 'GET',
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    const blob = await response.blob();

    const imageData = await blobToBase64(blob);
    return {
      name: row['name']?.trim() || 'Sin nombre',
      description: row['description']?.trim() || 'Descripción no disponible',
      cost_price: row['cost_price'] ? Number(row['cost_price']) : 0,
      sell_price: row['sell_price'] ? Number(row['sell_price']) : 0,
      city: row['city']?.trim() || 'Desconocida',
      country: row['country']?.trim() || 'Desconocido',
      start_date: convertExcelDate(row['start_date']),
      end_date: convertExcelDate(row['end_date']),
      included_services:
        typeof row['included_services'] === 'string'
          ? row['included_services'].split(',').map((s: string) => s.trim())
          : ['No especificado'],
      image: {
        format: row['image_url'].split('.').at(-1),
        data: imageData,
      },
    };
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No hay token de autenticación');
        return;
      }

      const formattedData = data.map(cleanRowData);

      // 🔍 Validación antes de enviar los datos

      console.log('📤 Datos enviados a la API:', formattedData);

      await Promise.all(
        formattedData.map(async (packageData) => {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/packages`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(packageData),
            }
          );

          const responseData = await response.json();
          console.log('📥 Respuesta de la API:', responseData);

          if (!response.ok) {
            throw new Error(
              `Error ${response.status}: ${
                responseData.message || response.statusText
              }`
            );
          }
        })
      );

      alert('✅ Paquetes creados con éxito');
      setData([]);
      setFile(null);
    } catch (error) {
      console.error('❌ Error al enviar los datos:', error);
      alert('Hubo un error al procesar los paquetes.');
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
      <Card>
        <Title>Cargar archivo Excel</Title>
        <Input
          type='file'
          accept='.xlsx, .xls'
          id='fileUpload'
          onChange={handleFileUpload}
        />
        <Label htmlFor='fileUpload'>Seleccionar archivo</Label>

        {file && <FileName>{file.name}</FileName>}

        {data.length > 0 && (
          <>
            <DataPreview>
              {JSON.stringify(data.slice(0, 5), null, 2)}
            </DataPreview>
            <Button onClick={handleSubmit}>Crear Paquetes</Button>
          </>
        )}
      </Card>
    </Box>
  );
};

export default UploadExcel;
