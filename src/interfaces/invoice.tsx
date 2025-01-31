import { TransactionDetail } from './transactionDetail';

export interface Invoice {
  invoice: {
    headers: {
      id: number;
      document_type: string;
      document_number: string;
      customer: string;
      ruc: string;
      email: string;
      transaction_type: string;
      condition: string;
      date: string;
      total: number;
      subtotal?: number; // Asegúrate de que `subtotal` esté definido como opcional
      tax_type?: string;
      tax5?: number;
      tax10?: number;
    };
    details: TransactionDetail[];
  };
}
