# Desafio: Feriado Feliz com Padroes de Projeto - Projeto Orientado à Objetos - UNIFESP 2026

Aluno: João Vitor Mâncio Chaves
RA: 176.534

[Deploy (hosted)]: https://feriado-feliz-com-padroes.vercel.app/

## Contexto
Uma agencia de viagens chamada **Feriado Feliz** quer vender pacotes promocionais para feriados.
O sistema precisa permitir que clientes montem pacotes com servicos extras, acompanhem atualizacoes de preco e status, e recebam confirmacoes de parceiros externos.

---

## Problema Proposto
Implemente um sistema de montagem e compra de pacotes de viagem para feriados com as seguintes regras:

1. O cliente escolhe um tipo de pacote base:
	 - `Economico`
	 - `Premium`
	 - `Luxo`
2. Cada pacote base possui descricao e preco inicial.
3. O cliente pode adicionar extras ao pacote:
	 - Seguro viagem
	 - Passeio turistico
	 - Transfer aeroporto
	 - Quarto com vista
4. O sistema deve notificar interessados quando:
	 - preco do pacote for alterado
	 - status do pacote mudar (PENDENTE, CONFIRMADO)
5. A confirmacao de pagamento e reserva vem de um sistema de parceiro externo com interface diferente da sua.
6. Deve existir controle central de logs/configuracao global da aplicacao.
7. O acesso ao servico de confirmacao externa deve passar por uma camada que:
	 - controla permissao/autorizacao
	 - registra tempo de chamada
	 - evita chamadas desnecessarias (cache simples opcional)

---

**Arquitetura (visão geral)**

O projeto segue uma arquitetura simples em camadas com foco em separação de responsabilidades entre domínio, padrões de projeto e integração com serviços externos:

- Camada de Domínio: contém modelos de pacote, regras de composição e funções de negócio (criação de pedido, cálculo de subtotal, aplicação de descontos).
- Camada de Composição: implementa a montagem dos pacotes usando a `Factory` para criar o pacote base e `Decorators` para adicionar serviços extras.
- Camada de Observabilidade/Notificação: implementa um `Subject`/`Observer` para notificar interessados sobre mudanças no valor do pedido ou status (ex.: atualização de preço, aplicação de desconto pelo gerente).
- Camada de Pagamento/Integração: encapsula a integração com provedores externos através de um `Facade` que usa internamente um `Proxy` para controlar autorização, logging e cache.
- UI (React + Vite): interface simples para montar pacotes, aplicar descontos e acionar pagamento.

**Padrões de Projeto Aplicados**

- Factory: criação dos pacotes base (`Economico`, `Premium`, `Luxo`). (veja [src/factories/PackageFatory.ts](src/factories/PackageFatory.ts#L1))
- Decorator: composição de extras sobre uma instância de pacote base (ex.: seguro, transfer, passeio). (veja [src/decorators/ExtraServices.ts](src/decorators/ExtraServices.ts#L1))
- Observer: notificação de atualização de preço/valor do pedido e status. Implementado via `OrderValueSubject` (veja [src/observers/OrderValueSubject.ts](src/observers/OrderValueSubject.ts#L1))
- Facade: `PaymentFacade` expõe uma API simples para processar pagamentos delegando detalhes ao gateway/Proxy. (veja [src/payment/PaymentFacade.ts](src/payment/PaymentFacade.ts#L1))
- Proxy: `PaymentProxy` cerca o gateway externo para adicionar autorização, logging e um cache simples das confirmações; também expõe um listener para invalidar cache quando o valor do pedido mudar. (veja [src/payment/PaymentProxy.ts](src/payment/PaymentProxy.ts#L1))

**Principais arquivos e onde procurar**

- Domínio e composição de pacotes: [src/domain/travel.ts](src/domain/travel.ts#L1) e [src/domain/packageBasePrices.ts](src/domain/packageBasePrices.ts#L1)
- Factory: [src/factories/PackageFatory.ts](src/factories/PackageFatory.ts#L1)
- Decorators (serviços extras): [src/decorators/ExtraServices.ts](src/decorators/ExtraServices.ts#L1)
- Observers: [src/observers/OrderValueSubject.ts](src/observers/OrderValueSubject.ts#L1) e [src/observers/OrderValueObserver.ts](src/observers/OrderValueObserver.ts#L1)
- Pagamento / Integração: [src/payment/ExternalPartnerPaymentGateway.ts](src/payment/ExternalPartnerPaymentGateway.ts#L1), [src/payment/PaymentProxy.ts](src/payment/PaymentProxy.ts#L1), [src/payment/PaymentFacade.ts](src/payment/PaymentFacade.ts#L1)
- UI (React): [src/main.tsx](src/main.tsx#L1) e [src/App.tsx](src/App.tsx#L1)

**Como Executar o Projeto (passos rápidos)**

1. Instale dependências:

	npm install

2. Rodar em modo de desenvolvimento (Vite):

	npm run dev

	- Abre a aplicação em `http://localhost:5173` por padrão.

3. Build para produção:

	npm run build

4. Visualizar build gerado (preview):

	npm run preview

5. Testes (se aplicável):

	npm run test

**Notas sobre comportamento e integração**

- Quando o gerente aplica um desconto sobre um pedido existente, o sistema notifica os observadores de valor de pedido — o `PaymentFacade` está inscrito para receber essa notificação e encaminha a mudança ao `PaymentProxy`, que invalida entradas de cache relacionadas a esse pedido. Isso garante que chamadas subsequentes ao provedor externo reflitam o novo valor.
- A composição de pacotes no fluxo principal do app é feita explicitamente usando `PackageFactory` + `Decorator` conforme enunciado do exercício.
