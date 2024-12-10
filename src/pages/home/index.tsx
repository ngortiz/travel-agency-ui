import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';
import image1 from '../../assets/image1.jpg';
import image2 from '../../assets/image2.jpg';
import image3 from '../../assets/image3.jpg';

import { PackageDetails } from '../../components/PackageDetailsModal';
import PackageCard from '../../PackageCard';
import PackageDetailsModal from '../../components/PackageDetailsModal';

const StyledCarouselItem = styled(Box)`
  background-size: cover;
  background-position: center;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const StyledOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;

const StyledSearchField = styled(TextField)`
  && {
    width: 100%;
    max-width: 700px;
    margin-top: 60px;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    fieldset {
      border: 2px solid transparent;
    }
    &:hover,
    &:focus-within {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      fieldset {
        border: 2px solid #127ca8;
      }
    }
    input {
      font-size: 18px;
      padding: 12px 18px;
      color: #127ca8;
    }
  }
`;

const StyledPackageCard = styled.div`
  background-color: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    border: 2px solid #127ca8;
  }
`;

const Home: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageDetails | null>(
    null
  );
  const [packages, setPackages] = useState<PackageDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/packages`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleViewMore = React.useCallback((packageDetails: PackageDetails) => {
    setSelectedPackage(packageDetails);
    setOpen(true);
  }, []);

  const handleWhatsApp = () => {
    const phoneNumber = '123456789';
    const message =
      '¡Hola! Estoy interesado en más información sobre los paquetes de viaje.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank');
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPackage(null);
  };

  const carouselItems = [
    {
      title: 'Bienvenidos a nuestra agencia',
      description: 'Ofrecemos las mejores experiencias de viaje.',
      image: image1,
    },
    {
      title: 'Descubre lugares únicos',
      description: 'Aventuras inolvidables en cada rincón del mundo.',
      image: image2,
    },
    {
      title: 'Viaja con nosotros',
      description: 'Tu viaje comienza aquí.',
      image: image3,
    },
  ];

  return (
    <Box sx={{ marginTop: '64px' }}>
      {/* Carousel */}
      <Carousel
        indicators
        navButtonsAlwaysVisible
        animation='slide'
        indicatorIconButtonProps={{
          style: { color: '#127ca8' },
        }}
        activeIndicatorIconButtonProps={{
          style: { color: '#FFD700' },
        }}
        navButtonsProps={{
          style: { backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '50%' },
        }}
      >
        {carouselItems.map((item, index) => (
          <StyledCarouselItem
            key={index}
            sx={{ backgroundImage: `url(${item.image})` }}
          >
            <StyledOverlay>
              <Box sx={{ maxWidth: '70%' }}>
                <Typography
                  variant='h2'
                  sx={{ fontWeight: 'bold', color: '#fff' }}
                >
                  {item.title}
                </Typography>
                <Typography variant='h5' sx={{ color: '#fff', opacity: 0.85 }}>
                  {item.description}
                </Typography>
              </Box>
            </StyledOverlay>
          </StyledCarouselItem>
        ))}
      </Carousel>

      {/* Search Field */}
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <StyledSearchField
          variant='outlined'
          placeholder='Buscar experiencias, destinos...'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: '#127ca8' }} />
              </InputAdornment>
            ),
          }}
        />
      </Container>

      {/* Package Cards */}
      <Container sx={{ marginTop: '40px', paddingBottom: '40px' }}>
        {loading ? (
          <Typography>Cargando paquetes...</Typography>
        ) : error ? (
          <Typography color='error'>Error: {error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {packages.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <StyledPackageCard>
                  <PackageCard
                    {...pkg}
                    onClick={() => handleViewMore(pkg)}
                    onWhatsApp={handleWhatsApp}
                  />
                </StyledPackageCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <PackageDetailsModal
        open={open}
        handleClose={handleClose}
        packageDetails={selectedPackage}
      />
    </Box>
  );
};

export default Home;
