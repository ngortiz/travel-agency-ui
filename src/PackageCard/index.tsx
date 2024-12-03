import React from 'react';
import styled from 'styled-components';
import {
  Card as MuiCard,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';
import { PackageDetails } from '../components/PackageDetailsModal';
import { WhatsApp } from '@mui/icons-material';

const Card = styled(MuiCard)`
  margin: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
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

const PackageCard: React.FC<
  PackageDetails & { onClick: () => void; onWhatsApp: () => void }
> = ({ image_url, name, description, sell_price, onClick, onWhatsApp }) => {
  return (
    <Card onClick={onClick}>
      <StyledCardMedia image={image_url} />
      <CardContent>
        <Typography variant="h5" fontWeight="bold">
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: 2 }}
        >
          {description}
        </Typography>
        <PriceAndButtonsContainer>
          <PriceTypography variant="h6">{sell_price}</PriceTypography>
          <ButtonContainer>
            <WhatsAppText
              variant="h6"
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
    </Card>
  );
};

export default PackageCard;
