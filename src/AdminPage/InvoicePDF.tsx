import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import html2pdf from 'html2pdf.js';

interface InvoiceData {
  document_number: string;
  company: string;
  address: string;
  phone: string;
  email: string;
  customer: string;
  ruc: string;
  date: string;
  document_type: string;
  condition: string;
  details: { description: string; quantity: number; unit_price: number }[];
  totals: { exempt: number; tax5: number; tax10: number; total: number };
}

interface Props {
  invoiceData: InvoiceData;
}

const InvoicePDF: React.FC<Props> = ({ invoiceData }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (invoiceRef.current) {
      html2pdf()
        .set({
          margin: 10,
          filename: `Factura_${invoiceData.document_number}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(invoiceRef.current)
        .save();
    }
  }, [invoiceData]);

  return (
    <HiddenContainer>
      <Container ref={invoiceRef}>
        <Header>
          <CompanyInfo>
            <CompanyName>{invoiceData.company}</CompanyName>
            <InfoText>
              <strong>Dirección:</strong> {invoiceData.address}
            </InfoText>
            <InfoText>
              <strong>Teléfono:</strong> {invoiceData.phone}
            </InfoText>
          </CompanyInfo>
          <InvoiceBox>
            <InfoText>
              <strong>Timbrado Nº:</strong> XXXXXXX
            </InfoText>
            <InfoText>
              <strong>Inicio de Vigencia:</strong> XXXXXX
            </InfoText>
            <InfoText>
              <strong>RUC:</strong> XXXXXXX-0
            </InfoText>
            <InfoText>
              <strong>Factura:</strong> {invoiceData.document_number}
            </InfoText>
          </InvoiceBox>
        </Header>

        {/* Datos de la Factura */}
        <InfoRow>
          <InfoText>
            <strong>Fecha de Emisión:</strong> {invoiceData.date}
          </InfoText>
          <InfoText>
            <strong>Condición de Venta:</strong> {invoiceData.condition}
          </InfoText>
        </InfoRow>

        {/* Datos del Cliente */}
        <SectionTitle>Datos del Cliente</SectionTitle>
        <ClientInfo>
          <InfoText>
            <strong>Nombre:</strong> {invoiceData.customer}
          </InfoText>
          <InfoText>
            <strong>RUC:</strong> {invoiceData.ruc}
          </InfoText>
        </ClientInfo>

        {/* Detalles */}
        <SectionTitle>Detalles</SectionTitle>
        <Table>
          <thead>
            <TableHeader>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </TableHeader>
          </thead>
          <tbody>
            {invoiceData.details.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCellCenter>{item.quantity}</TableCellCenter>
                <TableCellRight>
                  {item.unit_price.toLocaleString('es-PY')} PYG
                </TableCellRight>
                <TableCellRight>
                  {(item.quantity * item.unit_price).toLocaleString('es-PY')}{' '}
                  PYG
                </TableCellRight>
              </TableRow>
            ))}
          </tbody>
        </Table>

        {/* Totales */}
        <SectionTitle>Totales</SectionTitle>
        <Table>
          <tbody>
            <TableRow>
              <TableCell>
                <strong>Exento:</strong>
              </TableCell>
              <TableCellRight>
                {invoiceData.totals.exempt.toLocaleString('es-PY')} PYG
              </TableCellRight>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>IVA 5%:</strong>
              </TableCell>
              <TableCellRight>
                {invoiceData.totals.tax5.toLocaleString('es-PY')} PYG
              </TableCellRight>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>IVA 10%:</strong>
              </TableCell>
              <TableCellRight>
                {invoiceData.totals.tax10.toLocaleString('es-PY')} PYG
              </TableCellRight>
            </TableRow>
            <TableRowTotal>
              <TableCell>
                <strong>Total:</strong>
              </TableCell>
              <TableCellRight>
                {invoiceData.totals.total.toLocaleString('es-PY')} PYG
              </TableCellRight>
            </TableRowTotal>
          </tbody>
        </Table>
      </Container>
    </HiddenContainer>
  );
};

// 🔹 Styled Components 🔹

const HiddenContainer = styled.div`
  position: absolute;
  left: -9999px;
  visibility: hidden;
`;

const Container = styled.div`
  max-width: 800px;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #333;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const CompanyInfo = styled.div`
  text-align: left;
`;

const CompanyName = styled.h2`
  margin: 0;
  color: #127ca8;
`;

const InvoiceBox = styled.div`
  text-align: left;
  border: 2px solid #127ca8;
  padding: 15px;
  border-radius: 0px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 2px solid #333;
  padding-bottom: 10px;
`;

const ClientInfo = styled.div`
  border-bottom: 2px solid #333;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const InfoText = styled.p`
  margin: 5px 0;
`;

const SectionTitle = styled.h3`
  color: #555;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
`;

const TableHeader = styled.tr`
  background: #b2b5b8;
  color: white;
  text-align: left;

  th {
    padding: 8px;
    border: 1px solid #ddd;
  }
`;

const TableRow = styled.tr`
  td {
    padding: 8px;
    border: 1px solid #ddd;
  }
`;

const TableRowTotal = styled.tr`
  background: #b2b5b8;
  color: white;
  font-weight: bold;

  td {
    padding: 8px;
    border: 1px solid #ddd;
  }
`;

const TableCell = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
`;

const TableCellCenter = styled(TableCell)`
  text-align: center;
`;

const TableCellRight = styled(TableCell)`
  text-align: right;
`;

export default InvoicePDF;
