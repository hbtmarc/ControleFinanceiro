Firebase Realtime DB import - instructions

This project persists its data under a single Realtime DB key: `financeAppDB_v10`.

You can import bulk data (settings + data) using a Node.js script (below) which uses the Firebase Admin SDK and a service account key.

Files added:
- `scripts/import-to-firebase.js` - Node.js importer script
- `scripts/sample-import.json` - sample payload matching app structure

Prerequisites
- Node.js (14+ recommended)
- npm
- A Firebase project service account JSON file (Admin SDK key). Create one in Firebase Console > Project Settings > Service accounts > Generate new private key. Save it as `serviceAccountKey.json` locally (keep it secret).

How the app stores data
- The app writes to Realtime Database path: `financeAppDB_v10` (root-level key)
- The Firebase DB URL in the app (for reference) is: https://fluxofinanceiro-marc35-default-rtdb.firebaseio.com

Quick import steps (PowerShell)
```markdown
Importação para Firebase Realtime DB — instruções (PT-BR)

Este projeto persiste todos os seus dados sob uma única chave na Realtime Database: `financeAppDB_v10`.

Você pode importar dados em massa (settings + data) usando um script Node.js que utiliza o Firebase Admin SDK e uma chave de conta de serviço (service account).

Arquivos relacionados (no repositório):
- `scripts/import-to-firebase.js` — script Node.js para importar para o Firebase
- `scripts/sample-import.json` — exemplo de payload com a estrutura esperada pelo app

Pré-requisitos
- Node.js (recomendado 14+)
- npm
- Uma chave de conta de serviço do Firebase (arquivo JSON). Gere-a em Firebase Console → Project Settings → Service accounts → Generate new private key. Salve o arquivo localmente (por exemplo `serviceAccountKey.json`) e mantenha-o em local seguro — NÃO comite esse arquivo no repositório.

Como o app armazena os dados
- A aplicação grava tudo em: chave raiz `financeAppDB_v10` da Realtime Database
- URL do banco usado pelo app (referência): https://fluxofinanceiro-marc35-default-rtdb.firebaseio.com

Passos rápidos para importar (PowerShell)
1) Instalar dependências (uma vez):

   npm init -y; npm install firebase-admin

2) Coloque o arquivo da conta de serviço (`serviceAccountKey.json`) em um local seguro no seu disco (ex.: `C:\keys\serviceAccountKey.json`).

3) Prepare o arquivo JSON com os dados que você quer importar. Use `scripts/sample-import.json` como modelo.

4) Execute o import (substitua caminhos conforme necessário):

   node .\scripts\import-to-firebase.js --serviceAccount C:\keys\serviceAccountKey.json --input .\scripts\sample-import.json --yes

Detalhes e segurança
- Por padrão o script realiza um `set()` na chave `financeAppDB_v10`, ou seja: ele substitui o conteúdo existente dessa chave pelo payload enviado. Se você quer mesclar (merge) os dados em vez de substituir, execute com a flag `--merge` e o script usará uma operação `update()` mais segura.
- Sempre mantenha o arquivo da conta de serviço em local privado. Não envie para o Git, Dropbox público, ou cole em chats públicos.
- Valide a estrutura do JSON antes de importar. Use `scripts/sample-import.json` como referência. Campos ausentes não quebram o app — ele mescla com valores padrão quando carrega os dados — ainda assim é importante confirmar que os arrays `data`/`settings` estejam no formato correto.

Opções que eu posso ajudar a adicionar
- Um conversor adicional que transforma exports CSV (extratos bancários) para o formato JSON do app.
- Uma opção cliente (no próprio site) para carregar um JSON e importar localmente — observe que isso depende do `firebaseConfig` presente no `index.html` e tem implicações de segurança.

Modo "Super fácil" (para quem não é programador)
------------------------------------------------
Se você prefere evitar scripts e Node, pode seguir esta rota simples:

1) Abra o arquivo modelo `scripts/import-template.csv` no Excel (ou Google Sheets) e preencha suas transações mantendo o cabeçalho (colunas separadas por tab).

   Cabeçalho obrigatório (tab-delimited):
   Data \t Descrição \t Valor \t FormaPagamento \t Categoria \t Pago

   Exemplo de linha (cada valor em sua coluna):
   2025-08-15\tSupermercado Silva\t-350,00\tDinheiro\tMercado\tSim

2) Salve o arquivo como `.xlsx` (recomendado) ou `.csv` (UTF-8 se possível).

3) Na pasta do projeto, instale a dependência do conversor (uma vez):

```powershell
npm install xlsx
```

4) Converta a planilha para o JSON que o projeto entende e, em seguida, importe para o Firebase (substitua nomes/paths conforme seu caso):

```powershell
# Converte a planilha para um JSON que o projeto entende
node .\scripts\xlsx-to-json.js --input .\meu-extrato.xlsx --sheet "Sheet1" --year 2025 --month 8 --type expenses --out .\payload.json

# Em seguida, importe para o Firebase (use seu arquivo de service account)
node .\scripts\import-to-firebase.js --serviceAccount C:\keys\serviceAccountKey.json --input .\payload.json --yes
```

Dicas rápidas
- Use `scripts/import-template.csv` como ponto de partida — abra no Excel, edite, salve como `.xlsx` e rode os comandos de conversão/importe acima.
- Se quiser testar sem tocar nos dados reais, importe para um mês futuro (ex.: `--year 2099 --month 1`) para validar visualmente no app.

Importação XLSX / Excel (detalhes do conversor)
---------------------------------------------
O repositório inclui um conversor (`scripts/xlsx-to-json.js`) que:
- Lê uma planilha `.xlsx` (uma aba apenas, por padrão)
- Converte linhas em objetos no formato esperado pelo app
- Gera um arquivo JSON que pode ser passado para o importador `import-to-firebase.js`

Exemplo (PowerShell):

   npm install xlsx
   node .\scripts\xlsx-to-json.js --input .\bank.xlsx --sheet "Sheet1" --year 2025 --month 8 --type expenses --out .\payload.json
   node .\scripts\import-to-firebase.js --serviceAccount C:\keys\serviceAccountKey.json --input .\payload.json --yes

Colunas padrão que o conversor procura: `Date`, `Description`, `Amount`, `Payment`, `Category`, `Paid`.
Você pode sobrescrever os nomes das colunas ao chamar o conversor, por exemplo: `--dateCol Data --descCol Historico --amountCol Valor`.

Observações técnicas do conversor
- O conversor usa o pacote `xlsx` do npm. Instale-o com `npm install xlsx` no diretório do projeto.
- Ele tenta interpretar valores monetários com vírgula ou ponto como separador decimal e remove símbolos de moeda automaticamente.
- Por padrão o conversor insere as linhas no `year`/`month` escolhidos dentro de `incomes` ou `expenses` (use `--type incomes` para forçar entradas).

Passo-a-passo detalhadíssimo (import seguro)
------------------------------------------
1) Fazer um backup local do estado atual (opcional mas recomendado):
- No app abra a opção de Exportar (Download JSON) para gerar um `import.json` com o estado atual. Guarde esse arquivo.

2) Preparar o payload (opção 1: editar JSON diretamente):
- Use `scripts/sample-import.json` como modelo. Abra em um editor (VS Code, Notepad++) e ajuste `settings` e `data` conforme necessário.
- Valide o JSON (online JSON validator) antes de importar.

3) Preparar o payload (opção 2: converter do Excel):
- Edite `scripts/import-template.csv`, salve como `.xlsx` e execute o comando do conversor mostrado acima.

4) Testar localmente (opcional):
- Antes de `--yes`, rode o script sem essa flag para que ele apenas reporte o que faria (caso o script suporte esse modo). Se não suportar, crie um backup exportado do app e compare antes/depois.

5) Executar o import seguro:
- Comando padrão (substitua caminhos):

   node .\scripts\import-to-firebase.js --serviceAccount C:\keys\serviceAccountKey.json --input .\payload.json --yes

- Para mesclar em vez de substituir (evita sobrescrever):

   node .\scripts\import-to-firebase.js --serviceAccount C:\keys\serviceAccountKey.json --input .\payload.json --merge --yes

6) Verificar no app e restaurar se necessário
- Após o import, abra a aplicação e confira o mês e os lançamentos. Se tiver algo errado, importe novamente o backup que você baixou no passo 1.

Checklist de segurança antes de rodar
- [ ] Possuo backup exportado do estado atual (arquivo JSON)
- [ ] Service account JSON guardado em local seguro e fora do repo
- [ ] Revisei o `payload.json` e validei seu JSON
- [ ] Se possível, testei o import em um mês de teste (ex.: 2099-01)

Perguntas frequentes / problemas comuns
- "Posso reverter?" — Sim, reimporte o JSON de backup que você gerou antes.
- "E se eu quiser apenas adicionar sem mexer no que já existe?" — Use `--merge` para mesclar com `update()` em vez de `set()`.
- "Posso usar a importação pelo site sem service account?" — Sim: há um importador no navegador (modal XLSX/CSV). Isso usa o `firebaseConfig` presente no `index.html` e salva com as credenciais do cliente. Ele é mais simples, mas depende das regras de segurança do seu projeto Firebase.

Se quiser, posso:
- Ajudar a converter uma planilha (cole aqui o cabeçalho + 2–6 linhas) para um `payload.json` pronto.
- Adicionar validações extras no conversor para destacar linhas com datas inválidas ou valores não numéricos.

```


