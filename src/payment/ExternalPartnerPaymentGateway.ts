import { ExternalPaymentRequest, ExternalPaymentResult, PaymentGateway } from './types';

export class ExternalPartnerPaymentGateway implements PaymentGateway {
  async confirmPayment(request: ExternalPaymentRequest): Promise<ExternalPaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const approved = Math.random() >= 0.15;

    return {
      approved,
      transactionId: `TX-${request.orderId}-${Date.now()}`,
      providerStatus: approved ? 'CONFIRMADO' : 'RECUSADO',
      message: approved
        ? 'Pagamento confirmado pelo parceiro externo.'
        : 'Pagamento recusado pelo parceiro externo.',
      source: 'live',
      elapsedMs: 0,
    };
  }
}
