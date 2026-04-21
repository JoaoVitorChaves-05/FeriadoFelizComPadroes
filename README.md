# Feriado Feliz com React + Padroes de Projeto

Aplicacao web para montar e comprar pacotes de viagem com painel de gerente para aplicar desconto.

## O que foi implementado

1. Fluxo de cliente em React para:
   - selecionar pacote base (`Economico`, `Premium`, `Luxo`)
   - escolher servicos extras
   - criar pedido
2. Painel do gerente para aplicar desconto em pedidos ja criados.
3. Camada de pagamento com:
   - `PaymentFacade`: simplifica o uso para a interface
   - `PaymentProxy`: controla autorizacao, mede tempo de chamada e aplica cache
   - `ExternalPartnerPaymentGateway`: simulacao do sistema externo de pagamento

## Arquitetura principal

- `src/App.tsx`: interface React com fluxo de criacao de pedido, pagamento e desconto
- `src/domain/travel.ts`: catalogos, tipos de pedido e regras de desconto
- `src/payment/PaymentFacade.ts`: fachada para pagamento
- `src/payment/PaymentProxy.ts`: proxy com autorizacao, cache e monitoramento
- `src/payment/ExternalPartnerPaymentGateway.ts`: adaptacao/simulacao de parceiro externo

## Executar o projeto

```bash
npm install
npm run dev
```

## Scripts disponiveis

- `npm run dev`: inicia aplicacao React com Vite
- `npm run build`: valida TypeScript e gera build de producao
- `npm run preview`: executa preview da build
- `npm test`: executa testes Jest existentes
