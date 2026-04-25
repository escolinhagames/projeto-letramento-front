# 🚀 Como Rodar o Frontend

## 📋 Pré-requisitos

- **Node.js 18+**
- **npm** (incluso no Node.js)

## 🔧 Instalação e Execução

### Primeira vez (instalar dependências)

```bash
# 1. Entrar no diretório
cd C:\Users\lucas\projeto-letramento-front

# 2. Instalar dependências
npm install

# 3. Iniciar servidor dev
npm start
```

### Próximas vezes

```bash
cd C:\Users\lucas\projeto-letramento-front
npm start
```

✅ **Frontend rodando em**: `http://localhost:4200`

> Importante: o frontend depende do backend. O backend deve estar rodando separadamente em `http://localhost:8080` para login, cadastro e bingo funcionarem.

---

## 🔌 APIs Disponíveis (Backend)

O frontend comunica com o backend em `http://localhost:8080`:

### Endpoints de Jogos
```
GET  /api/jogos/listar              → Lista os 4 jogos
GET  /api/jogos/{id}                → Detalhes de um jogo
```

### Endpoints de Bingo
```
POST /api/bingo/sala/criar?professor=João         → Criar sala
GET  /api/bingo/sala/{codigo}                      → Info da sala
POST /api/bingo/sala/{codigo}/aluno/entrar        → Aluno entra
POST /api/bingo/sala/{codigo}/aluno/{nome}/marcar → Marcar número
GET  /api/bingo/sala/{codigo}/aluno/{nome}/bingo  → Verificar vitória
POST /api/bingo/sala/{codigo}/sortear              → Professor sorteia
POST /api/bingo/sala/{codigo}/encerrar             → Encerrar sala
```

---

## 🏗️ Estrutura do Projeto Angular

```
src/
├── app/
│   ├── pages/
│   │   ├── login/        → Tela de login
│   │   ├── dashboard/    → Seleção de jogos
│   │   ├── aluno/        → Interface do aluno
│   │   ├── index/        → Página inicial
│   │   └── cadastro/     → Cadastro de professor
│   ├── services/         → Chamadas HTTP para backend
│   └── guards/           → Auth guards
├── index.html
└── styles.scss
```

---

## 🛠️ Scripts Disponíveis

```bash
npm start              # Start dev server (ng serve)
npm run build          # Build para produção (dist/)
npm run watch          # Watch mode para desenvolvimento
npm test               # Rodar testes
```

---

## 💡 Integração com Backend

Para atualizar a API base do backend, edite:
- `src/app/services/` - Configure a URL base do backend

Atualmente, o backend está em: `http://localhost:8080`

> Se o frontend não abrir em `http://localhost:4200`, é porque o servidor Angular não está ativo no terminal do frontend.
> 
> Se o backend não abrir em `http://localhost:8080`, inicie o backend em outro terminal antes de usar login/cadastro.

---

## ⚠️ Troubleshooting

### "npm: comando não encontrado"
- Instale Node.js em: https://nodejs.org/

### Porta 4200 já em uso
```bash
# Use outra porta
ng serve --port 4300
```

### Frontend não abre no navegador
- Confirme que `npm start` está rodando no terminal de `projeto-letramento-front`.
- Verifique se o terminal exibe erros de compilação ou falha no `ng serve`.
- Se o erro continuar, reinicie o terminal e execute novamente `npm start`.

### "Cannot find module"
```bash
# Limpe cache e reinstale
rm -r node_modules package-lock.json
npm install
```

---

## 🔗 Verifique se o Backend está rodando

```bash
# No backend
cd C:\Users\lucas\projeto-letramento
.\mvnw spring-boot:run
```

Se não conseguir conectar, verifique:
- Backend rodando em `http://localhost:8080`
- Métodos HTTP corretos
- CORS configurado (já tá ok)

