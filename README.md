# Desafio: Feriado Feliz com Padroes de Projeto

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
	 - status do pacote mudar (CRIADO, EM_ANALISE, CONFIRMADO, CANCELADO)
5. A confirmacao de pagamento e reserva vem de um sistema de parceiro externo com interface diferente da sua.
6. Deve existir controle central de logs/configuracao global da aplicacao.
7. O acesso ao servico de confirmacao externa deve passar por uma camada que:
	 - controla permissao/autorizacao
	 - registra tempo de chamada
	 - evita chamadas desnecessarias (cache simples opcional)
