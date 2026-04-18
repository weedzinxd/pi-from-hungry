# 🤝 Guia de Contribuição - Pi From Hungry

Obrigado pelo seu interesse em contribuir para o **Pi From Hungry**! 🎉

Este documento fornece diretrizes e instruções para contribuir com o projeto.

---

## 📋 Índice

1. [Código de Conduta](#-código-de-conduta)
2. [Como Puedo Ayudar?](#-como-puedo-ayudar)
3. [Configuración del Entorno](#-configuración-del-entorno)
4. [Proceso de Desarrollo](#-proceso-de-desarrollo)
5. [Estándares de Código](#-estándares-de-código)
6. [Commits Semânticos](#-commits-semânticos)
7. [Pull Requests](#-pull-requests)
8. [Reportando Bugs](#-reportando-bugs)
9. [Sugerindo Features](#-sugerindo-features)
10. [Dúvidas?](#-dúvidas)

---

## 📜 Código de Conduta

Este projeto adere ao [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). 
Ao participar, você concorda em manter um ambiente respeitoso para todos.

### Nossos Compromissos:

- ✅ Contribuições devem ser seguras e acolhedoras para todos
- ✅ Respeito por diferentes perspectivas e experiências
- ✅ Feedback construtivo e aceito com graça
- ❌ Assédio,侮辱 ou comportamento inaceitável não será tolerado

---

## 💪 Como Puedo Ayudar?

### 🐛 Bugs e Issues

- Reportar bugs identificados
- Confirmar bugs existentes
- Executar testes e verificar correções

### 💡 Melhorias e Features

- Sugerir novas funcionalidades
- Implementar features solicitadas
- Melhorar documentação

### 📝 Documentação

- Corrigir erros ortográficos
- Adicionar exemplos
- Traduzir para outros idiomas

### 🔧 Código

- Code reviews
- Refatoração
- Otimização de performance
- Testes automatizados

---

## 🛠️ Configuración del Entorno

### Pré-requisitos

```bash
# Node.js 18+
node --version  # >= 18.0.0

# Python 3.10+
python --version  # >= 3.10

# Git 2.0+
git --version
```

### Instalación

```bash
# 1. Fork o repositório
git clone https://github.com/SEU_USUARIO/pi-from-hungry.git
cd pi-from-hungry

# 2. Configure upstream
git remote add upstream https://github.com/weedzinxd/pi-from-hungry.git

# 3. Instale dependências Node
npm install

# 4. (Opcional) Configure Python
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 5. Copie variáveis de ambiente
cp .env.example .env
```

---

## 🔄 Proceso de Desarrollo

### Fluxo de Trabalho

```
1. Sincronize com upstream
   └─→ git fetch upstream

2. Crie sua branch
   └─→ git checkout -b feature/minha-feature

3. Faça suas alterações
   └─→ Edite, teste, verifique

4. Commit suas mudanças
   └─→ git commit -m "tipo(scope): descrição"

5. Push para seu fork
   └─→ git push origin feature/minha-feature

6. Abra Pull Request
   └─→ No GitHub, clique em "New Pull Request"

7. Aguarde review
   └─→ Resolva feedback se necessário
```

### Branches

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Feature | `feature/descricao` | `feature/dashboard-mapa` |
| Bug Fix | `fix/descricao` | `fix/correcao-rpc` |
| Hotfix | `hotfix/descricao` | `hotfix/urgente` |
| Docs | `docs/descricao` | `docs/readme-traducao` |

---

## 📏 Estándares de Código

### TypeScript

```typescript
// ✅ Use interfaces para tipos
interface Hotspot {
  id: string;
  location: string;
  coordinates: [number, number];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// ✅ Nomes descritivos
const criticalHotspots = [];  // ✅
const arr = [];               // ❌

// ✅ Async/await sobre Promises
async function fetchHotspots(): Promise<Hotspot[]> {
  const response = await fetch('/api/hotspots');
  return response.json();
}
```

### Python

```python
# ✅ Type hints
def calculate_fome_score(ndvi: float, precipitation: float) -> float:
    """Calculate famine risk score based on satellite data."""
    return (ndvi * 0.6) + (precipitation * 0.4)

# ✅ Docstrings
def detect_hotspots(data: list[dict]) -> list[Hotspot]:
    """
    Detect famine hotspots from satellite data.
    
    Args:
        data: List of satellite observations
        
    Returns:
        List of detected hotspots with severity scores
    """
    pass

# ✅ Constantes em MAIÚSCULAS
MAX_RETRY_ATTEMPTS = 3
API_TIMEOUT_SECONDS = 30
```

### Smart Contracts (Rust/Soroban)

```rust
// ✅ Visibilidade explícita
fn register_hotspot(location: Vec<u8>, severity: u32) -> Result<(), ContractError> {
    // implementation
}

// ✅ Erros claros
#[error]
pub enum ContractError {
    #[error("Hotspot already registered")]
    AlreadyRegistered,
    #[error("Insufficient funds")]
    InsufficientFunds,
}
```

---

## 📝 Commits Semânticos

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(scope): descrição

[TIPOS]
├── feat:     Nova feature
├── fix:      Correção de bug
├── docs:     Documentação
├── style:    Formatação (sem mudança de código)
├── refactor: Refatoração
├── test:     Adicionar testes
├── chore:    Tarefas de manutenção
└── perf:     Melhoria de performance
```

### Exemplos

```bash
# ✅ Bons commits
git commit -m "feat(dashboard): adiciona mapa de calor global"
git commit -m "fix(rpc): corrige timeout na conexão"
git commit -m "docs(readme): adiciona badges e badges"
git commit -m "refactor(ai): otimiza detector de fome"

# ❌ Maus commits
git commit -m "fix"           # Sem descrição
git commit -m "update stuff"   # Não descritivo
git commit -m "WIP"            # Trabalho em progresso
```

---

## 🔀 Pull Requests

### Template de PR

```markdown
## Descrição
[Breve descrição das mudanças]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Testes adicionados/atualizados
- [ ] Código segue estilo do projeto
- [ ] Documentação atualizada
- [ ] Sem warnings de linter

## Screenshots (se aplicável)
[Adicione screenshots se houver mudanças visuais]
```

### Critérios de Aceitação

| Critério | Descrição |
|----------|-----------|
| ✅ CI Pass | Todos os testes devem passar |
| ✅ Code Review | Pelo menos 1 aprovação |
| ✅ Sem Conflitos | Branch atualizada com main |
| ✅ Documentação | Atualizada se necessário |

---

## 🐛 Reportando Bugs

### Antes de Reportar

1. 🔍 Verifique se já existe issue similar
2. 🔄 Atualize para última versão
3. 📋 Leia a documentação

### Template de Bug Report

```markdown
**Descrição**
[Descrição clara e concisa do bug]

**Passos para Reproduzir**
1. Vá para '...'
2. Execute '...'
3. Veja o erro em '...'

**Comportamento Esperado**
[O que você esperava que acontecesse]

**Comportamento Atual**
[O que acontece atualmente]

**Screenshots/Logs**
[Se aplicável, adicione screenshots ou logs]

**Ambiente**
- OS: [e.g., macOS, Windows, Linux]
- Node: [e.g., 18.0.0]
- Python: [e.g., 3.11.0]

**Contexto Adicional**
[Qualquer outra informação relevante]
```

---

## 💡 Sugerindo Features

### Template de Feature Request

```markdown
**Problema/Contexto**
[Descreva o problema que a feature resolveria]

**Solução Proposta**
[Sua sugestão de solução]

**Alternativas Consideradas**
[Outras soluções que você considerou]

**Contexto Adicional**
[Mockups, exemplos, etc.]
```

---

## ❓ Dúvidas?

| Canal | Uso |
|-------|-----|
| GitHub Issues | Bugs e feature requests |
| GitHub Discussions | Perguntas gerais |
| PR Reviews | Discussão de código |

---

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas 
sob a [MIT License](../LICENSE).

---

**Obrigado por contribuir!** 🙏

*"Nenhum ser humano deve passar fome."*

---

*Última atualização: 1 de Abril de 2026*
