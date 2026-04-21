import {
  ExternalPaymentRequest,
  ExternalPaymentResult,
  PaymentGateway,
  PaymentGatewayOrderValueListener,
} from './types';

interface CacheEntry {
  createdAt: number;
  result: ExternalPaymentResult;
}

export class PaymentProxy implements PaymentGateway, PaymentGatewayOrderValueListener {
  private readonly cache = new Map<string, CacheEntry>();

  constructor(
    private readonly gateway: PaymentGateway,
    private readonly authToken: string,
    private readonly cacheTtlMs: number = 120000
  ) {}

  onOrderAmountChanged(orderId: string, newAmount: number): void {
    const orderKeyPrefix = `${orderId}:`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(orderKeyPrefix)) {
        this.cache.delete(key);
      }
    }

    console.info(
      `[PaymentProxy] Valor do pedido ${orderId} alterado para R$ ${newAmount.toFixed(2)}. Cache invalidado.`
    );
  }

  async confirmPayment(request: ExternalPaymentRequest): Promise<ExternalPaymentResult> {
    if (!this.authToken.startsWith('app-')) {
      throw new Error('Autorização inválida para acessar o gateway de pagamento.');
    }

    const cacheKey = `${request.orderId}:${request.amount}:${request.currency}`;
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.createdAt <= this.cacheTtlMs) {
      return {
        ...cached.result,
        source: 'cache',
        elapsedMs: 0,
      };
    }

    const startedAt = performance.now();
    const liveResult = await this.gateway.confirmPayment(request);
    const elapsedMs = Math.round(performance.now() - startedAt);

    const timedResult: ExternalPaymentResult = {
      ...liveResult,
      source: 'live',
      elapsedMs,
    };

    this.cache.set(cacheKey, {
      createdAt: now,
      result: timedResult,
    });

    return timedResult;
  }
}
