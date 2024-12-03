import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiPackage, FiImage, FiMenu, FiX } from 'react-icons/fi';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f4f6f9;
`;

const Sidebar = styled.nav<{ isOpen: boolean }>`
  background: linear-gradient(135deg, #e0f7fa, #f1f8e9);
  padding: 2rem;
  color: #127ca8;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 250px;
  transition: all 0.3s ease;
  margin-top: 5%;

  h3 {
    margin-bottom: 2rem;
    font-size: 1.8rem;
    color: #127ca8;
    font-weight: bold;
    text-align: center;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const MenuItem = styled.li`
  margin-bottom: 1rem;
`;

const StyledLink = styled(Link)`
  color: #127ca8;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: #ffffff;
    background-color: #127ca8;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const Content = styled.div`
  flex: 1;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  background: #127ca8;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: #0e6390;
  }
`;

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <DashboardContainer>
      <ToggleButton onClick={toggleSidebar}>
        {isSidebarOpen ? <FiX /> : <FiMenu />}
      </ToggleButton>

      <Sidebar isOpen={isSidebarOpen}>
        <h3>GLOBE TRAVEL</h3>
        <MenuList>
          <MenuItem>
            <StyledLink to="/admin/create-package">
              <FiPackage size={20} />
              Crear Paquete
            </StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/admin/upload-banner">
              <FiImage size={20} />
              Banner
            </StyledLink>
          </MenuItem>
        </MenuList>
      </Sidebar>

      <Content>
        <Outlet />
      </Content>
    </DashboardContainer>
  );
};

export default AdminDashboard;
