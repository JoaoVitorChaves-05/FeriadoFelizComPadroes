export interface ExternalPaymentRequest {
  orderId: string;
  amount: number;
  currency: 'BRL';
}

export interface ExternalPaymentResult {
  approved: boolean;
  transactionId: string;
  providerStatus: string;
  message: string;
  source: 'live' | 'cache';
  elapsedMs: number;
}

export interface PaymentGateway {
  confirmPayment(request: ExternalPaymentRequest): Promise<ExternalPaymentResult>;
}

export interface PaymentGatewayOrderValueListener {
  onOrderAmountChanged(orderId: string, newAmount: number): void;
}
