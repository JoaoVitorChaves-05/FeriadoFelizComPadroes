import { useMemo, useState } from 'react';
import {
  applyManagerDiscount,
  calculateSubtotal,
  createOrder,
  extraServicesCatalog,
  getPackageByType,
  packageCatalog,
  PackageType,
  TravelOrder,
} from './domain/travel';
import { ExternalPartnerPaymentGateway } from './payment/ExternalPartnerPaymentGateway';
import { PaymentFacade } from './payment/PaymentFacade';
import { PaymentProxy } from './payment/PaymentProxy';
import { OrderValueSubject } from './observers/OrderValueSubject';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function App() {
  const [selectedPackageType, setSelectedPackageType] = useState<PackageType>('premium');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [orders, setOrders] = useState<TravelOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [discountInput, setDiscountInput] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [loadingOrderId, setLoadingOrderId] = useState<string>('');

  const paymentFacade = useMemo(() => {
    const externalGateway = new ExternalPartnerPaymentGateway();
    const paymentProxy = new PaymentProxy(externalGateway, 'app-feriado-feliz-token');
    return new PaymentFacade(paymentProxy);
  }, []);

  const orderValueSubject = useMemo(() => {
    const subject = new OrderValueSubject();
    subject.attach(paymentFacade);
    return subject;
  }, [paymentFacade]);

  const selectedPackage = getPackageByType(selectedPackageType);

  const previewTotal = calculateSubtotal(selectedPackageType, selectedExtras);

  function toggleExtra(serviceId: string): void {
    setSelectedExtras((current) =>
      current.includes(serviceId)
        ? current.filter((item) => item !== serviceId)
        : [...current, serviceId]
    );
  }

  function handleCreateOrder(): void {
    const order = createOrder(selectedPackageType, selectedExtras);

    setOrders((current) => [order, ...current]);
    setSelectedOrderId(order.id);
    setDiscountInput('');
    setFeedback(`Pedido ${order.id} criado com sucesso.`);
  }

  function handleApplyDiscount(): void {
    if (!selectedOrderId) {
      setFeedback('Selecione um pedido para aplicar desconto.');
      return;
    }

    const discount = Number(discountInput.replace(',', '.'));
    if (!Number.isFinite(discount) || discount < 0) {
      setFeedback('Informe um valor de desconto válido.');
      return;
    }

    const selectedOrder = orders.find((order) => order.id === selectedOrderId);
    if (!selectedOrder) {
      setFeedback('Pedido selecionado não foi encontrado.');
      return;
    }

    const updatedOrder = applyManagerDiscount(selectedOrder, discount);

    setOrders((current) =>
      current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );

    orderValueSubject.notify(updatedOrder);

    setFeedback(
      `Desconto aplicado no pedido ${updatedOrder.id}. Sistema de pagamento notificado do novo valor.`
    );
  }

  async function handlePayOrder(orderId: string): Promise<void> {
    const targetOrder = orders.find((order) => order.id === orderId);

    if (!targetOrder) {
      setFeedback('Pedido não encontrado para pagamento.');
      return;
    }

    try {
      setLoadingOrderId(orderId);
      const paymentResult = await paymentFacade.payOrder(targetOrder);

      setOrders((current) =>
        current.map((order) => {
          if (order.id !== orderId) {
            return order;
          }

          return {
            ...order,
            paymentStatus: paymentResult.approved ? 'aprovado' : 'falhou',
            paymentInfo: {
              transactionId: paymentResult.transactionId,
              providerStatus: paymentResult.providerStatus,
              source: paymentResult.source,
              elapsedMs: paymentResult.elapsedMs,
              message: paymentResult.message,
            },
          };
        })
      );

      setFeedback(paymentResult.message);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Erro ao processar pagamento.');
    } finally {
      setLoadingOrderId('');
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Feriado Feliz</p>
        <h1>Monte sua viagem e aproveite com segurança</h1>
        <p>
          Escolha o pacote com Factories, adicione serviços através de Decorators e finalize usando fachada + proxy para o gateway externo de pagamento ou aplique desconto de gerente para um pedido existente com Observers.
        </p>
      </header>

      <main className="layout">
        <section className="card flow-card">
          <h2>1. Selecione o pacote</h2>
          <div className="package-grid">
            {packageCatalog.map((item) => (
              <button
                key={item.type}
                type="button"
                className={`package-item ${selectedPackageType === item.type ? 'active' : ''}`}
                onClick={() => setSelectedPackageType(item.type)}
              >
                <strong>{item.title}</strong>
                <span>{item.description}</span>
                <b>{formatCurrency(item.basePrice)}</b>
              </button>
            ))}
          </div>

          <h2>2. Escolha serviços extras</h2>
          <div className="extras-list">
            {extraServicesCatalog.map((service) => (
              <label key={service.id} className="extra-item">
                <input
                  type="checkbox"
                  checked={selectedExtras.includes(service.id)}
                  onChange={() => toggleExtra(service.id)}
                />
                <span>{service.title}</span>
                <b>{formatCurrency(service.price)}</b>
              </label>
            ))}
          </div>

          <div className="summary">
            <p>Pacote selecionado: <b>{selectedPackage.title}</b></p>
            <p>Total prévia: <b>{formatCurrency(previewTotal)}</b></p>
          </div>

          <button type="button" className="primary" onClick={handleCreateOrder}>
            Criar pedido
          </button>
        </section>

        <section className="card manager-card">
          <h2>Painel do gerente</h2>
          <p>Aplique desconto em um pedido já criado.</p>

          <label className="field">
            Pedido
            <select
              value={selectedOrderId}
              onChange={(event) => setSelectedOrderId(event.target.value)}
            >
              <option value="">Selecione...</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} - {formatCurrency(order.total)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Desconto (R$)
            <input
              type="text"
              placeholder="Ex.: 150"
              value={discountInput}
              onChange={(event) => setDiscountInput(event.target.value)}
            />
          </label>

          <button type="button" className="secondary" onClick={handleApplyDiscount}>
            Aplicar desconto
          </button>

          <p className="hint">Se o pedido já estava aprovado, ele volta para pendente para revalidação do pagamento.</p>
        </section>

        <section className="card orders-card">
          <h2>Pedidos</h2>
          {orders.length === 0 ? <p>Nenhum pedido criado ainda.</p> : null}

          {orders.map((order) => (
            <article key={order.id} className="order-item">
              <header>
                <strong>{order.id}</strong>
                <span className={`status ${order.paymentStatus}`}>{order.paymentStatus}</span>
              </header>

              <p>
                <b>Pacote:</b> {getPackageByType(order.packageType).title}
              </p>
              <p>
                <b>Extras:</b>{' '}
                {order.extraServiceIds.length === 0
                  ? 'Nenhum'
                  : order.extraServiceIds
                      .map((id) => extraServicesCatalog.find((extra) => extra.id === id)?.title || id)
                      .join(', ')}
              </p>
              <p>
                <b>Subtotal:</b> {formatCurrency(order.subtotal)} | <b>Desconto:</b> {formatCurrency(order.discount)}
              </p>
              <p>
                <b>Total:</b> {formatCurrency(order.total)}
              </p>

              {order.paymentInfo ? (
                <div className="payment-meta">
                  <p><b>Transação:</b> {order.paymentInfo.transactionId}</p>
                  <p><b>Status parceiro:</b> {order.paymentInfo.providerStatus}</p>
                  <p><b>Origem:</b> {order.paymentInfo.source}</p>
                  <p><b>Tempo:</b> {order.paymentInfo.elapsedMs} ms</p>
                </div>
              ) : null}

              <button
                type="button"
                className="primary"
                onClick={() => handlePayOrder(order.id)}
                disabled={loadingOrderId === order.id}
              >
                {loadingOrderId === order.id ? 'Processando...' : 'Pagar pedido'}
              </button>
            </article>
          ))}
        </section>
      </main>

      <footer className="feedback" aria-live="polite">{feedback}</footer>
    </div>
  );
}
