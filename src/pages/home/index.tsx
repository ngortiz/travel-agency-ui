import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';
import image1 from '../../assets/image1.png';
import image2 from '../../assets/image2.png';
import image3 from '../../assets/image3.png';
import image4 from '../../assets/image4.png';

import { PackageDetails } from '../../components/PackageDetailsModal';
import PackageCard from '../../PackageCard';
import PackageDetailsModal from '../../components/PackageDetailsModal';

const StyledCarouselItem = styled(Box)`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  max-width: 1900px;
  height: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: 900px) {
    height: 400px;
  }

  @media (max-width: 600px) {
    height: 250px;
  }
`;

const StyledOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, -0.7), rgba(0, 0, 0, 0.7));
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
  const [filteredPackages, setFilteredPackages] = useState<PackageDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/packages`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setPackages(data);
      setFilteredPackages(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    const filtered = packages.filter((pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPackages(filtered);
  }, [searchQuery, packages]);

  const handleViewMore = React.useCallback((packageDetails: PackageDetails) => {
    setSelectedPackage(packageDetails);
    setOpen(true);
  }, []);

  const handleWhatsApp = (packageName: string) => {
    const phoneNumber = '+595985163420';
    const message = `¡Hola! Estoy interesado en más información sobre el paquete: ${packageName}.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank');
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPackage(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este paquete?')) {
      return;
    }
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/packages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      setPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg.id !== id)
      );
      alert('Paquete eliminado con éxito');
    } catch (error) {
      console.error('Error eliminando el paquete:', error);
      alert('Hubo un error al intentar eliminar el paquete');
    }
  };

  const carouselItems = [
    {
      image: image1,
    },
    {
      image: image2,
    },
    {
      image: image3,
    },
    {
      image: image4,
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
                ></Typography>
              </Box>
            </StyledOverlay>
          </StyledCarouselItem>
        ))}
      </Carousel>

      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <StyledSearchField
          variant='outlined'
          placeholder='Buscar experiencias, destinos...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: '#127ca8' }} />
              </InputAdornment>
            ),
          }}
        />
      </Container>

      <Container sx={{ marginTop: '40px', paddingBottom: '40px' }}>
        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center'>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color='error'>Error: {error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredPackages.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <StyledPackageCard>
                  <PackageCard
                    id={pkg.id}
                    image_url={pkg.image_url}
                    name={pkg.name}
                    description={pkg.description}
                    sell_price={Number(pkg.sell_price) || 0}
                    onClick={() => handleViewMore(pkg)}
                    onWhatsApp={() => handleWhatsApp(pkg.name)}
                    onDelete={handleDelete}
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
