import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './common/NavBar';
import Home from './pages/home';
import { AuthProvider } from './context/AuthContext';
import AdminLogin from './AdminPage/AdminLogin';

import CreatePackage from './AdminPage/CreatePackage';
import UploadBanner from './AdminPage/UploadBanner';
import RegisterIncomeExpense from './AdminPage/RegisterIncomeExpense';
import Reports from './AdminPage/Reports';
import AdminDashboard from './AdminPage/AdminDashboard';
import UploadExcel from './AdminPage/UploadExcel';

const App: React.FC = () => {
  // Definir el método onViewInvoice

  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/admin-login' element={<AdminLogin />} />

          <Route path='/admin' element={<AdminDashboard />}>
            <Route path='create-package' element={<CreatePackage />} />
            <Route path='create-package/:id' element={<CreatePackage />} />
            <Route path='upload-banner' element={<UploadBanner />} />
            <Route path='upload-excel' element={<UploadExcel />} />
            <Route
              path='/admin/register-income-expense'
              element={<RegisterIncomeExpense />}
            />
            <Route
              path='/admin/register-income-expense/:invoiceId'
              element={<RegisterIncomeExpense />}
            />

            <Route path='reports' element={<Reports />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
