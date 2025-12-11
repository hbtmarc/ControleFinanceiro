# 💰 Fluxo Financeiro

Sistema de controle financeiro pessoal com Firebase e interface moderna.

## 📁 Estrutura do Projeto

```
ControleFinanceiro/
├── index.html           # Versão de PRODUÇÃO (otimizada)
├── index.dev.html       # Versão de DESENVOLVIMENTO
├── README.md           # Esta documentação
│
├── src/                # Código fonte (desenvolvimento)
│   ├── css/
│   │   └── style.css   # CSS não-minificado
│   └── js/
│       ├── app.js      # JavaScript principal
│       └── modules.js  # Módulos ES6 reutilizáveis
│
├── dist/               # Arquivos de produção (minificados)
│   ├── style.min.css   # CSS minificado
│   └── app.min.js      # JavaScript minificado
│
└── backup/             # Backups e versões antigas
    ├── index_backup.html
    └── ...
```

## 🚀 Como Usar

### Desenvolvimento
1. Abra `index.dev.html` no navegador
2. Edite os arquivos em `src/`
3. Recarregue a página para ver mudanças

### Produção
1. Use `index.html` (aponta para `dist/`)
2. Deploy: envie `index.html` + pasta `dist/`

## 🛠️ Tecnologias

- **Firebase v10** - Auth + Database
- **Tailwind CSS** - Framework via CDN
- **Chart.js** - Gráficos
- **Vanilla JavaScript** - ES6+ modular

## 📊 Otimizações

- Original: 806.7 KB → Otimizado: 483.1 KB
- **Redução: 40.1%**

✅ Separação modular  
✅ Minificação  
✅ Lazy loading  
✅ CSS crítico inline  

## 🔧 Configuração Firebase

Edite `src/js/modules.js`:

```javascript
const firebaseConfig = {
    apiKey: 'sua-chave',
    authDomain: 'projeto.firebaseapp.com',
    databaseURL: 'https://projeto.firebaseio.com',
    projectId: 'projeto'
};
```

## 📝 Re-minificar (após edições)

**CSS:**
```powershell
$css = Get-Content src\css\style.css -Raw; $css = $css -replace '\s*\{\s*','{' -replace '\s*\}\s*','}' -replace '\s*;\s*',';' -replace '\n\s*',''; $css | Out-File dist\style.min.css -Encoding UTF8 -NoNewline
```

**JS:**
```powershell
$js = Get-Content src\js\app.js -Raw; $js = $js -replace '(?m)^\s+','' -replace '\s+', ' ' -replace '\s*\{\s*','{'; $js | Out-File dist\app.min.js -Encoding UTF8 -NoNewline
```

## 🌐 Deploy

- **GitHub Pages**: Commit + ativar nas settings
- **Netlify/Vercel**: Conectar repo + deploy automático

---

Desenvolvido com ❤️ e otimização extrema
