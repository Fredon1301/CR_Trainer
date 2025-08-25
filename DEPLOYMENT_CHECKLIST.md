# Checklist de Deploy - Clash Royale Trainer

## ✅ Pré-requisitos
- [ ] Conta no Render criada
- [ ] Conta no Clash Royale API criada
- [ ] Chave API do Clash Royale obtida
- [ ] Repositório Git configurado

## ✅ Configuração do Render
- [ ] Web Service criado no Render
- [ ] Banco de dados PostgreSQL criado
- [ ] Variáveis de ambiente configuradas:
  - [ ] DATABASE_URL (auto-gerada pelo Render)
  - [ ] CLASH_ROYALE_API_KEY
  - [ ] SESSION_SECRET
  - [ ] NODE_ENV=production
  - [ ] PORT=5000

## ✅ Deploy
- [ ] Código enviado para repositório Git
- [ ] Deploy automático/configurado no Render
- [ ] Build executado com sucesso
- [ ] Aplicação iniciada sem erros

## ✅ Banco de Dados
- [ ] Migrações executadas: `npm run db:push`
- [ ] Conexão com banco testada
- [ ] Tabelas criadas corretamente

## ✅ Testes
- [ ] Aplicação acessível pela URL do Render
- [ ] Frontend carregando corretamente
- [ ] API endpoints funcionando
- [ ] Autenticação funcionando
- [ ] Integração com Clash Royale API funcionando

## ✅ Pós-Deploy
- [ ] Domínio customizado configurado (opcional)
- [ ] SSL/HTTPS verificado
- [ ] Monitoramento configurado
- [ ] Backup do banco configurado (opcional)

## 📋 Problemas Comuns e Soluções

### Build falha
- Verificar dependências no package.json
- Checar logs de build no Render

### Erro de conexão com banco
- Confirmar DATABASE_URL correta
- Verificar se o banco está rodando

### Erro de API key
- Confirmar CLASH_ROYALE_API_KEY válida
- Verificar permissões da API key

### Aplicação não sobe
- Checar logs de início no Render
- Verificar se PORT está configurada como 5000

## 🔗 Links Úteis
- [Dashboard Render](https://dashboard.render.com)
- [Clash Royale API](https://developer.clashroyale.com)
- [Documentação Render](https://render.com/docs)
