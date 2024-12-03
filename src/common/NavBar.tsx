import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom'; 

const COLORS = {
  primary: '#127ca8',
  text: '#ffffff',
  hover: '#00a65a',
};

const StyledBox = styled.div`
  flex-grow: 1;
`;

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
    font-size: 0.9rem;
  }
`;

const StyledIconButton = styled(IconButton)`
  color: ${COLORS.text};
`;

const AdminButton = styled.button`
  background-color: #127ca8 !important;
  color: #ffffff;
  padding: 0.5rem 1rem;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  border: 1px solid #f4f6f9;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  font-size: 1rem;

  &:hover {
    background-color: #ffffff !important;
    color: #127ca8;
    border: 2px solid #127ca8;
  }

  &:active {
    background-color: #0b5d3c;
  }

  @media (max-width: 600px) {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const StyledStack = styled(Stack)`
  @media (max-width: 300px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px; /* Espaciado entre los elementos */
  }
`;

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica si el usuario está autenticado al cargar el componente
  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      navigate('/admin-login', { state: { redirectTo: '/admin' } });
    }
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/123456789', '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:contacto@agencytravel.com';
  };

  return (
    <>
      <StyledBox>
        <StyledAppBar position="fixed">
          <Toolbar>
            <Container maxWidth="xl">
              <StyledStack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <StyledLogo src={logo} alt="Agency Logo" />

                <StyledStack direction="row" spacing={4}>
                  <StyledTypography variant="h6" onClick={handleWhatsAppClick}>
                    <StyledIconButton aria-label="WhatsApp">
                      <WhatsApp />
                    </StyledIconButton>
                    Contacto
                  </StyledTypography>

                  <StyledTypography variant="h6" onClick={handleEmailClick}>
                    <StyledIconButton aria-label="Email">
                      <Email />
                    </StyledIconButton>
                    Email
                  </StyledTypography>

                  {/* Botón de Administración */}
                  <AdminButton onClick={handleAdminClick}>
                    {isAuthenticated ? 'Inicio' : 'Login Admin'}
                  </AdminButton>
                </StyledStack>
              </StyledStack>
            </Container>
          </Toolbar>
        </StyledAppBar>
      </StyledBox>
    </>
  );
};

export default NavBar;
