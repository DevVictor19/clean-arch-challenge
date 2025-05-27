# API de Clientes

Esse projeto foi desenvolvido durante um teste técnico para uma vaga de Desenvolvedor Nodejs Pleno/Senior.

O objetivo é construir uma api de clientes com as seguintes funcionalidades:

- Cadastrar um cliente.
- Atualizar dados de um cliente.
- Consultar detalhes de um cliente por ID.
- Listar todos os clientes.

E fazer isso utilizando NodeJS, ExpressJS, mensageria, cache e conceitos de Arquitetura Limpa e SOLID.

## Arquitetura da aplicação

Todo o código se concentra da pasta **src** dessa pasta possui mais duas **infra** e **domain**.

### Domain:

Nesse diretório você vai encontrar tudo aquilo que é relacionado com as regras de negócio de domínio e aplicação: **Entidades**, **Services**, **Controllers**.

Se você perceber todas as regras de negócio da aplicação ficam isoladas no diretório do domínio, facilitando possíveis mudanças dos detalhes externos de infraestrutura.

O domínio não tem conhecimento do mundo externo, portanto ele não depende de nada que não está dentro dele (MongoDB, redis, rabbitMQ, etc).

### Infra:

Aqui você vai encontrar implementações de baixo nível e específicas de frameworks e bibliotecas.

As implementações da camada de infraestrutura devem se adequar as interfaces que o domínio exigem.

Dessa forma, sendo necessário mudanças de tecnologias, é preciso apenas implementar o novo código seguindo as interfaces que o domínio exigem para trabalhar.

**O objetivo dessa arquitetura é isolar as regras de negócio de dependências externas como: mongoDB, redis, rabbitMQ, ExpressJS, etc**

## Subindo a aplicação

Essa aplicação está totalmente 'Dockerizada', então para subir todos os serviços, você precisa:

### 1. Criar um .env com base no .env.example

Copie os valores do .env.example e cole em um novo .env na raíz do projeto.

```
SERVER_PORT=3000
MONGO_URL=mongodb://admin:admin@mongo:27017
MONGO_DATABASE=clients-api
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672
```

### 2. Rodar o comando para subir a aplicação

Entre na raíz do projeto e execute esse comando para subir todos os serviços. A aplicação vai ficar disponível em http://localhost:3000

```
docker compose up -d
```

## Executar testes

A aplicação possui testes unitários, para executá-los rode o seguinte comando:

1. Baixar dependências

```
pnpm install
```

2. Rodar testes

```
pnpm run test
```

3. Ou para rodar testes de corbetura

```
pnpm run test:cov
```

**Eu optei pelo pnpm como gerenciador de pacotes, mas você pode fazer tudo usando o npm, é só substituir pnpm por npm quando for rodar os comandos**

**Se optar por seguir com o pnpm é so instalar rodando:**

```
npm install -g pnpm@latest-10
```

## Endpoints da aplicação

- GET **/v1/clients?limit=10&page=1**
- GET **/v1/clients/:id**
- DELETE **/v1/clients/:id**
- POST **/v1/clients**
- PUT **/v1/clients/:id**

### Payload de criação/edição

```
{
  "name": "João da Silva",
  "email": "joao.silva1233@example.com",
  "phone": "5511912345679"
}

```

### Payload de busca por id

```
{
    "_id": "8a3e3b2e-75da-4714-8067-d7c5dee4d54c",
    "updated_at": "2025-05-27T14:38:27.040Z",
    "created_at": "2025-05-27T14:38:27.040Z",
    "name": "João da Silva",
    "email": "joao.silva1233@example.com",
    "phone": "5511912345679"
}
```

### Payload de paginação

```
{
    "page": 1,
    "limit": 10,
    "total": 1,
    "results": 1,
    "data": [
        {
            "_id": "8a3e3b2e-75da-4714-8067-d7c5dee4d54c",
            "updated_at": "2025-05-27T14:38:27.040Z",
            "created_at": "2025-05-27T14:38:27.040Z",
            "name": "João da Silva",
            "email": "joao.silva1233@example.com",
            "phone": "5511912345679"
        }
    ]
}
```
