import React from 'react';
import { Box, Typography, Link, Grid, Divider } from '@mui/material';
import { LocationOn, Phone, Email } from '@mui/icons-material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import styled from 'styled-components';

const FooterContainer = styled(Box)`
  background-color: #127ca8;
  color: #ffffff;
  padding: 40px 20px;
  text-align: center;
`;

const InfoContainer = styled(Box)`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const SocialMediaContainer = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  margin: 10px;
`;

const DividerStyled = styled(Divider)`
  background-color: #fff;
  margin: 20px 0;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <InfoContainer>
        <Typography variant='h6' gutterBottom>
          Contacto
        </Typography>
        <Box display='flex' alignItems='center' gap='8px'>
          <LocationOn />
          <Typography>Constitución Nacional casi Antequera, 6000</Typography>
        </Box>
        <Typography>Encarnación, Paraguay</Typography>

        <Box display='flex' alignItems='center' gap='8px'>
          <Phone />
          <Typography>0984 489517</Typography>
        </Box>
        <Box display='flex' alignItems='center' gap='8px'>
          <Email />
          <Typography>info@empresa.com</Typography>
        </Box>
      </InfoContainer>

      <DividerStyled />

      <Typography variant='h6' gutterBottom>
        Síguenos
      </Typography>
      <SocialMediaContainer>
        <Link
          href='https://facebook.com/tuempresa'
          target='_blank'
          rel='noopener noreferrer'
          color='inherit'
        >
          <FacebookIcon fontSize='large' sx={{ color: '#fff' }} />{' '}
        </Link>
        <Link
          href='https://instagram.com/tuempresa'
          target='_blank'
          rel='noopener noreferrer'
          color='inherit'
        >
          <InstagramIcon fontSize='large' sx={{ color: 'orange' }} />{' '}
        </Link>
      </SocialMediaContainer>

      <Typography variant='body2' mt={3}>
        &copy; {new Date().getFullYear()} Globe Travel. Todos los derechos
        reservados.
      </Typography>
    </FooterContainer>
  );
};

export default Footer;
