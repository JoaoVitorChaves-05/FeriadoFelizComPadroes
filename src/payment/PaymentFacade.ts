import { TravelOrder } from '../domain/travel';
import { OrderValueObserver } from '../observers/OrderValueObserver';
import {
  ExternalPaymentResult,
  PaymentGateway,
  PaymentGatewayOrderValueListener,
} from './types';

export class PaymentFacade implements OrderValueObserver {
  constructor(private readonly paymentGateway: PaymentGateway) {}

  onOrderValueChanged(order: TravelOrder): void {
    if (this.isOrderValueListener(this.paymentGateway)) {
      this.paymentGateway.onOrderAmountChanged(order.id, order.total);
    }
  }

  private isOrderValueListener(
    gateway: PaymentGateway
  ): gateway is PaymentGateway & PaymentGatewayOrderValueListener {
    return 'onOrderAmountChanged' in gateway;
  }

  async payOrder(order: TravelOrder): Promise<ExternalPaymentResult> {
    if (order.total <= 0) {
      throw new Error('Não é possível processar pagamento com valor inválido.');
    }

    return this.paymentGateway.confirmPayment({
      orderId: order.id,
      amount: order.total,
      currency: 'BRL',
    });
  }
}
