# 🚀 Real-Time Cashback Engine

Microserviço de alta performance para cálculo e concessão de cashback em tempo real. Desenvolvido com **TypeScript**, seguindo os princípios de **Domain-Driven Design (DDD)** e **Programação Funcional (FP)**.

## 🏗️ Arquitetura e Padrões

* **Domain-Driven Design:** Camadas de domínio puras, sem dependências externas.
* **Functional Programming:** Uso de funções puras, imutabilidade (`const` apenas) e **Result Pattern** para tratamento de erros sem exceções.
* **Event-Driven:** Processamento assíncrono via Kafka (KRaft Mode).
* **Infrastructure:** MongoDB para persistência atômica e resiliência (Failover Pattern).

## 🛠️ Pré-requisitos

* **Node.js** v20 ou superior.
* **Docker** & **Docker Compose**.
* **NPM** ou **PNPM**.

## 🚀 Setup Inicial

### 1. Clonar e Instalar
```bash
git clone <repository-url>
cd cashback-engine
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```text
MONGO_URI=mongodb://127.0.0.1:27017
KAFKA_BROKERS=127.0.0.1:9092
PORT=3000
KAFKAJS_NO_PARTITIONER_WARNING=1
```

### 3. Subir Infraestrutura

Inicia o MongoDB e o Kafka (sem Zookeeper):

```bash
npm run infra:up
```

### 4. Preparar o Ambiente

Crie os tópicos necessários e popule o banco com usuários de teste:

```bash
npm run infra:setup-topics
npm run db:seed
```

## 💻 Execução

### Modo Desenvolvimento

Executa o serviço com `tsx` e hot-reload:

```bash
npm run dev
```

### Simular um Evento de Compra

Dispara um evento `Confirmed` no Kafka para validar o processamento:

```bash
npm run test:event
```

## 🔌 API Endpoints

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/v1/wallets/:userId` | Retorna saldo e nível (Tier) do usuário. |
| `GET` | `/v1/reports/monthly` | Agregado de cashback emitido vs estornado. |

## 🧪 Testes

Garantimos integridade financeira com 100% de cobertura na lógica de cálculo e na **Zero-Balance Floor Rule** (regra que impede saldo negativo em estornos).

```bash
# Rodar todos os testes
npm test

# Modo Watch
npm run test:watch

```

## 📜 Scripts Disponíveis

* `npm run dev`: Inicia o app em modo watch.
* `npm run build`: Compila o código para JS.
* `npm run infra:up`: Sobe Docker Compose.
* `npm run infra:down`: Para Docker Compose.
* `npm run db:seed`: Cria usuários iniciais.
* `npm run test:event`: Simula entrada de dados via Kafka.
