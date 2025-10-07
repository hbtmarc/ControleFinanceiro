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
1) Install dependencies (one-time):

   npm init -y; npm install firebase-admin

2) Place your service account file next to the project or at a safe path. Example: `C:\keys\serviceAccountKey.json`

3) Prepare your JSON payload. Use `scripts/sample-import.json` as a template or edit it.

4) Run the import (replace paths as needed):

   node .\scripts\import-to-firebase.js --serviceAccount C:\keys\serviceAccountKey.json --input .\scripts\sample-import.json --yes

Notes and safety
- The script by default performs a `set()` which replaces the whole `financeAppDB_v10` payload. If you want to merge instead, pass `--merge` and the script will call `update()`.
- Always keep your service account JSON private. Do not commit it to version control.
- Validate the JSON payload structure matches the shape the app expects (see `scripts/sample-import.json`). Missing fields are fine; the app merges with defaults when loading.

If you want, I can also:
- Add a small script that converts CSV exports (e.g., bank statements) into the app's JSON format before import.
- Create a form inside the app to upload a JSON file and import client-side (but this requires the user's Firebase credentials to be present in the UI, less secure).

Super fácil — para quem não é programador
----------------------------------------
Se quiser a maneira mais simples (pode ser feita por qualquer pessoa que use Excel):

1) Abra o Excel e cole (ou digite) as transações usando este modelo. Há um arquivo pronto: `scripts/import-template.csv`.

   Cabeçalho obrigatório (tab-delimited):
   Data \t Descrição \t Valor \t FormaPagamento \t Categoria \t Pago

   Exemplo (cada coluna separada por tab):
   2025-08-15\tSupermercado Silva\t-350,00\tDinheiro\tMercado\tSim

2) Salve a planilha como .xlsx (por exemplo `meu-extrato.xlsx`) ou como CSV (se preferir).

3) Na pasta do projeto, instale a dependência do conversor (uma vez):

```powershell
npm install xlsx
```

4) Execute o comando simples para converter e gerar o JSON pronto (substitua o nome do arquivo e o mês/ano se necessário):

```powershell
# Converte a planilha para um JSON que o projeto entende
node .\scripts\xlsx-to-json.js --input .\meu-extrato.xlsx --sheet "Sheet1" --year 2025 --month 8 --type expenses --out .\payload.json

# Em seguida, importe para o Firebase (use seu arquivo de service account)
node .\scripts\import-to-firebase.js --serviceAccount C:\keys\serviceAccountKey.json --input .\payload.json --yes
```

Dicas rápidas:
- Use o arquivo `scripts/import-template.csv` como ponto de partida — abra no Excel, edite as linhas, salve como `.xlsx` e rode o comando acima.
- Se quiser testar sem tocar no banco real, altere `--year 2099 --month 1` para importar os dados num mês futuro para visualizar no app sem sobrescrever dados reais.

XLSX / Excel import (new)
------------------------
I added a helper script `scripts/xlsx-to-json.js` that reads a single-sheet `.xlsx` and emits a JSON payload compatible with the importer. It's a command-line tool you run locally and then import the generated JSON with the importer.

Example (PowerShell):

   npm install xlsx
   node .\scripts\xlsx-to-json.js --input .\bank.xlsx --sheet "Sheet1" --year 2025 --month 8 --type expenses --out .\payload.json
   node .\scripts\import-to-firebase.js --serviceAccount C:\keys\serviceAccountKey.json --input .\payload.json --yes

Default column names the converter looks for: `Date`, `Description`, `Amount`, `Payment`, `Category`, `Paid`.
You can override columns with flags like `--dateCol Data --descCol Historico --amountCol Valor`.

Notes:
- The converter uses the `xlsx` npm package. Install it locally in the project folder: `npm install xlsx`.
- The script makes best-effort guesses for amounts (supports commas or dots as decimal separators, strips currency symbols).
- By default the converter writes imported rows into the chosen year/month under either `incomes` or `expenses` (use `--type incomes` if needed).


