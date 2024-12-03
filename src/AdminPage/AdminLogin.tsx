import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, TextField, Button, Typography, Stack } from '@mui/material';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  margin-top: 30px;
  text-align: center;
`;

const StyledForm = styled.form`
  max-width: 400px;
  margin: 0 auto;
`;

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === 'admin' && password === 'password123') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      const redirectTo = location.state?.redirectTo || '/admin';
      navigate(redirectTo);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Inicio de Sesión - Admin
      </Typography>
      <StyledForm onSubmit={handleLogin}>
        <Stack spacing={2}>
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Iniciar Sesión
          </Button>
        </Stack>
      </StyledForm>
    </StyledContainer>
  );
};

export default AdminLogin;
