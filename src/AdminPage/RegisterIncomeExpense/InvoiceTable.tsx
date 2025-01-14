import React from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from 'styled-components';

const StyledTableContainer = styled(Paper)`
  margin-top: 16px;
  padding: 16px;
`;

const StyledPagination = styled(TablePagination)`
  & .MuiTablePagination-select {
    color: blue;
  }
`;

interface Invoice {
  id: number;
  invoice: {
    headers: {
      document_number: string;
      customer: string;
      ruc: string;
      transaction_type: string;
      condition: string;
      date: string;
      total: number;
    };
  };
}

interface InvoiceTableProps {
  invoices: Invoice[];
  deleteInvoice: (invoiceId: number) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  deleteInvoice,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 4));
    setPage(0);
  };

  const paginatedInvoices = invoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Typography variant='h5' gutterBottom>
        Facturas Registradas
      </Typography>
      <Paper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nro de Documento</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Ruc</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Condición</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice: any, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {invoice.invoice.headers.document_number || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {invoice.invoice.headers.customer || 'N/A'}
                  </TableCell>
                  <TableCell>{invoice.invoice.headers.ruc || 'N/A'}</TableCell>
                  <TableCell>
                    {invoice.invoice.headers.transaction_type || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {invoice.invoice.headers.condition || 'N/A'}
                  </TableCell>
                  <TableCell>{invoice.invoice.headers.date || 'N/A'}</TableCell>
                  <TableCell>
                    Gs. {invoice.invoice.headers.total || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color='error'
                      onClick={() => deleteInvoice(invoice.invoice.headers.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
      <StyledPagination
        count={invoices.length}
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
