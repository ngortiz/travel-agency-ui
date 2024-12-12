import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  margin-top: 10% !important;
  text-align: center;
`;

const StyledForm = styled.form`
  max-width: 400px;
  margin: 0 auto;
`;

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      console.log(username);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email: username.trim(),
            password: password.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error de la API:', errorResponse);

        throw new Error(errorResponse.message || 'Error en la autenticación');
      }

      const data = await response.json();
      const { token, user } = data;

      login(token);
      navigate('/admin');
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err.message);
      setError(err.message || 'Usuario o contraseña incorrectos');
    }
  };

  return (
    <StyledContainer>
      <Typography variant='h4' gutterBottom>
        Inicio de Sesión - Admin
      </Typography>
      <StyledForm onSubmit={handleLogin}>
        <Stack spacing={2}>
          <TextField
            label='Correo Electrónico'
            variant='outlined'
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label='Contraseña'
            type='password'
            variant='outlined'
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color='error'>{error}</Typography>}
          <Button type='submit' variant='contained' color='primary' fullWidth>
            Iniciar Sesión
          </Button>
        </Stack>
      </StyledForm>
    </StyledContainer>
  );
};

export default AdminLogin;
