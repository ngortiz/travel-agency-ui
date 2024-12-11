// Importar styled-components y Material-UI
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Card as MuiCard,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert, WhatsApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Estilización del Card principal
const Card = styled(MuiCard)`
  position: relative; /* Necesario para posicionar el botón */
  margin: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 12px;

  &:hover {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
    transform: scale(1.02);
    border: 2px solid #127ca8;
  }
`;

const StyledCardMedia = styled(CardMedia)`
  height: 200px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  object-fit: cover;
`;

const PriceTypography = styled(Typography)`
  color: #127ca8;
  font-weight: bold;
  margin: 8px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledButton = styled(Button)`
  background-color: transparent !important;
  border: 2px solid #127ca8 !important;
  color: #ffffff;
  font-weight: bold;
  text-transform: none;
  transition: all 0.3s ease;
  border-radius: 12px !important;
  font-size: 9px !important;
  padding: 5px 10px;

  &:hover {
    background-color: #ffffff;
    color: #127ca8;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }
`;

const WhatsAppText = styled(Typography)`
  color: #00a65a;
  font-weight: bold;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #127ca8;
  }
`;

const PriceAndButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const MenuButton = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 50%;

  &:hover {
    background-color: rgba(200, 200, 200, 0.8);
  }
`;

const StyledMenu = styled(Menu)`
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 2px solid #127ca8;
`;

interface PackageCardProps {
  id: number;
  image_url: string;
  name: string;
  description: string;
  sell_price: number;
  onClick: () => void;
  onWhatsApp: () => void;
  onDelete: (id: number) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  id,
  image_url,
  name,
  description,
  sell_price,
  onClick,
  onWhatsApp,
  onDelete,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate('/create-package', {
      state: { id, image_url, name, description, sell_price },
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onDelete(id);
  };

  return (
    <Card onClick={onClick}>
      <StyledCardMedia
        image={image_url || 'https://via.placeholder.com/200'}
        title={name}
      />

      <CardContent>
        <Typography variant='h5' fontWeight='bold'>
          {name}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ marginBottom: 2 }}
        >
          {description}
        </Typography>
        <PriceAndButtonsContainer>
          <PriceTypography variant='h6'>US$ {sell_price}</PriceTypography>
          <ButtonContainer>
            <WhatsAppText
              variant='h6'
              onClick={(e) => {
                e.stopPropagation();
                onWhatsApp();
              }}
            >
              <WhatsApp />
            </WhatsAppText>
            <StyledButton
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Ver más
            </StyledButton>
          </ButtonContainer>
        </PriceAndButtonsContainer>
      </CardContent>

      {isAuthenticated && (
        <>
          <MenuButton
            onClick={handleMenuOpen}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(200, 200, 200, 0.8)',
              },
            }}
          >
            <MoreVert />
          </MenuButton>
          <StyledMenu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem onClick={handleEdit}>Editar</MenuItem>
            <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
          </StyledMenu>
        </>
      )}
    </Card>
  );
};

export default PackageCard;
