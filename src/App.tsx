import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from './common/NavBar';
import Home from './pages/home';
import { AppProvider } from './context/AppProvider'; 
import AdminLogin from './AdminPage/AdminLogin';

import CreatePackage from './AdminPage/CreatePackage';
import UploadBanner from './AdminPage/UploadBanner';
import AdminDashboard from './AdminPage/AdminDashboard';

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Rutas protegidas con layout persistente */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="create-package" element={<CreatePackage />} />
            <Route path="upload-banner" element={<UploadBanner />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
