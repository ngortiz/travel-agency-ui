export interface Invoice {
  invoice: {
    headers: {
      id: number;
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
