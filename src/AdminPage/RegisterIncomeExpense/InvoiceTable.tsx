import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  Container,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';

import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';
import { Invoice } from '../../interfaces/invoice';

// Styled Components
const StyledTableContainer = styled(TableContainer)`
  margin-top: 16px;
  background-color: #f7f9fc;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledTableCell = styled(TableCell)`
  font-weight: bold;
  color: #3f51b5;
  border-bottom: 2px solid #e0e0e0;
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #eef2f7;
  }
  &:hover {
    background-color: #dfe9f3;
  }
`;

const StyledHeaderRow = styled(TableRow)`
  background-color: #127ca8;
`;

const StyledHeaderCell = styled(TableCell)`
  color: white !important;
  font-weight: bold !important;
  text-transform: uppercase;
`;

const SearchContainer = styled.div`
  && {
    width: 43%;
    max-width: 700px;
    margin-top: 55px;
    margin-left: 56%;
    border-radius: 4px;
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
  @media (max-width: 900px) {
    height: 400px;
  }

  @media (max-width: 700px) {
    height: 300px;
  }
`;

const StyledSearchField = styled(TextField)`
font-size: 18px;
padding: 12px 18px;
color: #127ca8;
width: 100%;
}`;

const StyledPagination = styled(TablePagination)`
  & .MuiTablePagination-toolbar {
    justify-content: space-between;
  }
  & .MuiTablePagination-select {
    color: #127ca8;
  }
`;
const StyledHeaderTypography = styled(Typography)`
  color: #127ca8 !important;
  font-weight: bold;
  font-size: 2rem;
  margin-bottom: 2px !important;
  margin-top: 20px !important;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  transition: color 0.3s ease;

  &:hover {
    color: #0f5b8c;
  }
`;
const MainContainer = styled(Container)`
  margin-top: 32px;
  padding: 24px;
  'linear-gradient(135deg, #f6f7fa, #c3d9e8)',
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1700px !important;
`;

const StyledIconButton = styled(IconButton)`
  background-color: #ffffff !important;

  color: #e53935 !important; // Ícono rojo
  border-radius: 50% !important; // Botón circular

  &:hover {
    background-color: #e53935 !important;
    color: #ffffff !important; // Ícono blanco
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

interface InvoiceTableProps {
  invoices: Invoice[];
  deleteInvoice: (invoiceId: number) => void;
  onViewInvoice: (invoiceId: number) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  deleteInvoice,
  onViewInvoice,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    console.log(invoice);
    const { document_number, customer, ruc } = invoice.invoice.headers;
    return (
      document_number.toLowerCase().includes(search.toLowerCase()) ||
      customer.toLowerCase().includes(search.toLowerCase()) ||
      ruc.toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginatedInvoices = filteredInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <MainContainer>
      <>
        <StyledHeaderTypography variant='h4' color='primary' gutterBottom>
          Facturas Registradas
        </StyledHeaderTypography>

        <SearchContainer>
          <StyledSearchField
            variant='outlined'
            size='small'
            placeholder='Buscar por Nro, Cliente o RUC....'
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon sx={{ color: '#127ca8' }} />
                </InputAdornment>
              ),
            }}
          />
        </SearchContainer>

        <StyledTableContainer>
          <Table>
            <TableHead>
              <StyledHeaderRow>
                <StyledHeaderCell>Nro de Documento</StyledHeaderCell>
                <StyledHeaderCell>Cliente</StyledHeaderCell>
                <StyledHeaderCell>Ruc</StyledHeaderCell>
                <StyledHeaderCell>Tipo</StyledHeaderCell>
                <StyledHeaderCell>Condición</StyledHeaderCell>
                <StyledHeaderCell>Fecha</StyledHeaderCell>
                <StyledHeaderCell>Total</StyledHeaderCell>
                <StyledHeaderCell>Vizualizar</StyledHeaderCell>
                <StyledHeaderCell>Eliminar</StyledHeaderCell>
              </StyledHeaderRow>
            </TableHead>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <StyledTableRow key={invoice.invoice.headers.id}>
                  <StyledTableCell>
                    {invoice.invoice.headers.document_number || 'N/A'}
                  </StyledTableCell>
                  <StyledTableCell>
                    {invoice.invoice.headers.customer || 'N/A'}
                  </StyledTableCell>
                  <StyledTableCell>
                    {invoice.invoice.headers.ruc || 'N/A'}
                  </StyledTableCell>
                  <StyledTableCell>
                    {invoice.invoice.headers.transaction_type || 'N/A'}
                  </StyledTableCell>
                  <StyledTableCell>
                    {invoice.invoice.headers.condition || 'N/A'}
                  </StyledTableCell>
                  <StyledTableCell>
                    {invoice.invoice.headers.date || 'N/A'}
                  </StyledTableCell>
                  <StyledTableCell>
                    {`Gs ${new Intl.NumberFormat('es-PY').format(
                      invoice.invoice.headers.total
                    )}`}
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      color='primary'
                      onClick={() => onViewInvoice(invoice.invoice.headers.id)}
                    >
                      <PreviewIcon />
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell>
                    <StyledIconButton
                      color='error'
                      onClick={() => deleteInvoice(invoice.invoice.headers.id)}
                    >
                      <DeleteIcon />
                    </StyledIconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <StyledPagination
          count={filteredInvoices.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Filas por página:'
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </>
    </MainContainer>
  );
};

export default InvoiceTable;
