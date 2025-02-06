import React from 'react';
import logo from '../assets/logo.png';
import {
  AppBar,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import styled from 'styled-components';
import { Email, WhatsApp } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  primary: '#127ca8',
  text: '#ffffff',
  hover: '#00a65a',
};

const StyledAppBar = styled(AppBar)`
  background-color: #ffffff !important;
`;

const StyledLogo = styled.img`
  height: 70px;
  border-radius: 100px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 2px solid ${COLORS.primary};

  @media (max-width: 600px) {
    height: 50px;
  }
`;

const StyledTypography = styled(Typography)`
  color: ${COLORS.primary};
  font-weight: bold;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.hover};
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

const AdminButton = styled.button`
  background: linear-gradient(90deg, #2196f3, #4caf50);
  color: #ffffff;
  padding: 0.5rem 1rem;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  border: 1px solid #f4f6f9;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;

  '&:hover': {
    background: linear-gradient(90deg, #1e88e5, #43a047);
  }

  @media (max-width: 600px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
    width: auto;
    max-width: 100%;
    text-align: center;
  }
`;

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Detectar la ruta actual
  const { isAuthenticated, logout } = useAuth();

  const handleButtonClick = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/admin-login');
    }
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/+595985163420', '_blank');
  };

  const handleGoToAdmin = () => {
    navigate('/admin');
  };

  return (
    <StyledAppBar position='fixed'>
      <Toolbar>
        <Container maxWidth='xl'>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <StyledLogo src={logo} alt='Agency Logo' />

            <Stack direction='row' spacing={4}>
              <StyledTypography variant='h6' onClick={handleWhatsAppClick}>
                <IconButton aria-label='WhatsApp'>
                  <WhatsApp />
                </IconButton>
                Contacto
              </StyledTypography>

              {/* Botón "Ir al Admin" solo visible en Home */}
              {location.pathname === '/' && isAuthenticated && (
                <AdminButton onClick={handleGoToAdmin}>Ir al Admin</AdminButton>
              )}

              {/* Botón de administración */}
              <AdminButton onClick={handleButtonClick}>
                {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
              </AdminButton>
            </Stack>
          </Stack>
        </Container>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavBar;
