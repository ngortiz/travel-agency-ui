import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';

export interface PackageDetails {
  id: number;
  name: string;
  image_url: string;
  description: string;
  sell_price: number | string;
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  included_services: string[];
}

interface PackageDetailsModalProps {
  open: boolean;
  handleClose: () => void;
  packageDetails: PackageDetails | null;
}

const StyledDialogContent = styled(DialogContent)`
  padding: 16px;
  overflow-y: auto;
`;

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    width: 100%;
    max-width: 900px;
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 600px;
  overflow-y: auto;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const StyledImage = styled.img`
  flex: 1;
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.6rem;
  color: #127ca8;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid #127ca8;
`;

const StyledLabel = styled.span`
  font-weight: bold;
  color: #127ca8;
  font-size: 1rem;
  flex: 1;
  margin-right: 10px;
`;

const StyledSpan = styled.span`
  font-weight: normal;
  color: #555;
  font-size: 1rem;
  flex: 2;
`;

const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({
  open,
  handleClose,
  packageDetails,
}) => (
  <StyledDialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
    {packageDetails && (
      <>
        <StyledDialogTitle>
          DETALLE DEL PAQUETE
          <IconButton onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <StyledDialogContent>
          <CardContainer>
            <StyledImage
              src={packageDetails.image_url}
              alt='Paquete de viaje'
            />
            <InfoContainer>
              <DetailRow>
                <StyledLabel>Nombre del paquete:</StyledLabel>
                <StyledSpan>{packageDetails.name}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>Descripción:</StyledLabel>
                <StyledSpan>{packageDetails.description}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>Precio:</StyledLabel>
                <StyledSpan>US$ {packageDetails.sell_price}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>País:</StyledLabel>
                <StyledSpan>{packageDetails.country}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>Ciudad:</StyledLabel>
                <StyledSpan>{packageDetails.city}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>Fecha de Salida:</StyledLabel>
                <StyledSpan>{packageDetails.start_date}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>Fecha de Retorno:</StyledLabel>
                <StyledSpan>{packageDetails.end_date}</StyledSpan>
              </DetailRow>
              <DetailRow>
                <StyledLabel>Incluye:</StyledLabel>
                <StyledSpan>
                  {packageDetails.included_services.join(', ')}
                </StyledSpan>
              </DetailRow>
            </InfoContainer>
          </CardContainer>
        </StyledDialogContent>
      </>
    )}
  </StyledDialog>
);

export default PackageDetailsModal;
