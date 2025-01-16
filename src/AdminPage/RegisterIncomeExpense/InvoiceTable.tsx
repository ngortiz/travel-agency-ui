import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TablePagination,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
  font-weight: bold;
  text-transform: uppercase;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
  margin-left: 75%;
`;

const StyledSearchField = styled(TextField)`
  & .MuiInputBase-root {
    background-color: white;
    border-radius: 4px;
  }
  & .MuiInputLabel-root {
    color: #3f51b5;
  }
`;

const StyledPagination = styled(TablePagination)`
  & .MuiTablePagination-toolbar {
    justify-content: space-between;
  }
  & .MuiTablePagination-select {
    color: #3f51b5;
  }
`;

// Interfaces

interface InvoiceTableProps {
  invoices: Invoice[];
  deleteInvoice: (invoiceId: number) => void;
}

// Componente Principal
const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  deleteInvoice,
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
    <>
      <Typography variant='h5' gutterBottom>
        Facturas Registradas
      </Typography>

      <SearchContainer>
        <StyledSearchField
          variant='outlined'
          size='small'
          placeholder='Buscar por Nro, Cliente o RUC'
          onChange={handleSearch}
          InputProps={{
            endAdornment: <SearchIcon />,
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
                  Gs. {invoice.invoice.headers.total || 'N/A'}
                </StyledTableCell>
                <StyledTableCell>
                  <IconButton
                    color='error'
                    onClick={() => deleteInvoice(invoice.invoice.headers.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
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
  );
};

export default InvoiceTable;
