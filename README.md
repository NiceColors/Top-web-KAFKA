# Top Web Kafka

Um projeto de integração do Kafka com uma API do Google Search, rodando em contêineres Docker.

## Índice

- [Descrição](#descrição)
- [Instalação](#instalação)
- [Uso](#uso)


## Descrição

Este projeto configura um ambiente Kafka usando Docker, incluindo um produtor e consumidor Kafka para enviar e receber mensagens. Ele também integra a API do Google Search para obter dados e enviar essas informações como mensagens no Kafka. O projeto inclui o Kafka UI para facilitar a visualização e gerenciamento do Kafka.

## Instalação

### Pré-requisitos

- Docker e Docker Compose instalados na sua máquina.

### Passos para Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/top-web-kafka.git
   cd top-web-kafka

2. Rode o Docker Compose:

   ```bash
    docker-compose up -d
