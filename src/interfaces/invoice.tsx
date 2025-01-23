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
    };
    details: TransactionDetail[];
  };
}
