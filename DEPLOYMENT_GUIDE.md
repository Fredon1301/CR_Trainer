# Guia de Deploy para Render

Este guia explica como implantar sua aplicação Clash Royale Trainer no Render.

## Pré-requisitos

1. Conta no [Render](https://render.com)
2. Conta no [Clash Royale API](https://developer.clashroyale.com) para obter a chave API
3. Repositório Git (GitHub, GitLab, ou Bitbucket)

## Passo a Passo para Deploy

### 1. Preparar o Repositório

Certifique-se de que seu código está em um repositório Git público ou privado.

### 2. Configurar Variáveis de Ambiente

Você precisará configurar as seguintes variáveis de ambiente no Render:

- `DATABASE_URL`: URL de conexão com o PostgreSQL (será gerada automaticamente pelo Render)
- `CLASH_ROYALE_API_KEY`: Sua chave API do Clash Royale
- `SESSION_SECRET`: Segredo para sessões (pode ser gerado automaticamente)
- `NODE_ENV`: production
- `PORT`: 5000

### 3. Obter Chave API do Clash Royale

1. Acesse: https://developer.clashroyale.com
2. Faça login com sua conta Supercell
3. Crie um novo projeto
4. Copie a chave API gerada

### 4. Deploy no Render

#### Opção A: Usando render.yaml (Recomendado)

1. Faça push do arquivo `render.yaml` para seu repositório
2. Acesse o [Dashboard do Render](https://dashboard.render.com)
3. Clique em "New +" → "Blueprint"
4. Conecte seu repositório Git
5. O Render detectará automaticamente o arquivo render.yaml e configurará tudo

#### Opção B: Configuração Manual

1. Acesse o [Dashboard do Render](https://dashboard.render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório Git
4. Configure o serviço:
   - **Name**: clash-royale-trainer
   - **Environment**: Node
   - **Region**: Escolha a mais próxima (ex: US East)
   - **Branch**: main (ou sua branch principal)
   - **Root Directory**: . (raiz do projeto)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. Adicione as variáveis de ambiente:
   - `NODE_ENV`: production
   - `PORT`: 5000
   - `SESSION_SECRET`: (gere um valor seguro)
   - `CLASH_ROYALE_API_KEY`: (sua chave API)

6. Clique em "Create Web Service"

### 5. Configurar Banco de Dados

1. No Dashboard do Render, clique em "New +" → "PostgreSQL"
2. Configure o banco:
   - **Name**: clashroyaledb
   - **Database Name**: clashroyaledb
   - **User**: clashroyaleuser
   - **Plan**: Free
   - **Region**: Mesma região do web service

3. Após criar o banco, vá para as configurações do seu web service
4. Adicione a variável `DATABASE_URL` com a connection string fornecida pelo Render

### 6. Executar Migrações do Banco

Após o deploy, você precisa executar as migrações do banco:

1. Acesse o terminal do Render (Shell) para seu web service
2. Execute: `npm run db:push`

### 7. Testar a Aplicação

Após o deploy completo, acesse a URL fornecida pelo Render para testar sua aplicação.

## Troubleshooting

### Erros Comuns

1. **Build falha**: Verifique se todas as dependências estão no package.json
2. **Database connection error**: Confirme se a DATABASE_URL está correta
3. **API key errors**: Verifique se a CLASH_ROYALE_API_KEY está configurada

### Logs

Acesse os logs no Dashboard do Render para debugging:
- Web Service → Logs
- Database → Logs

## Custos

O plano Free do Render oferece:
- Web Service: 750 horas gratuitas por mês
- PostgreSQL: 1GB de armazenamento gratuito
- Bandwidth: 100GB gratuitos por mês

Isso é suficiente para aplicações pequenas/médias.

## Monitoramento

O Render fornece monitoramento básico:
- Uptime monitoring
- Logs em tempo real
- Métricas de performance

## Atualizações

Para atualizar sua aplicação:
1. Faça push das mudanças para seu repositório Git
2. O Render fará deploy automático (se configurado)
3. Ou inicie um deploy manual pelo Dashboard

## Suporte

- [Documentação Render](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Email Support](https://render.com/contact)
