
IMPORTAR VIA SITE — Guia passo-a-passo (pt-BR)
=============================================

Objetivo
--------
Este guia mostra, passo a passo, como preparar uma planilha simples e importá-la diretamente pelo navegador usando o próprio site (sem instalar Node, sem linha de comando). A importação é feita no cliente (navegador): o site lê o arquivo, mostra uma pré-visualização, permite baixar um backup do mês alvo e, só então, salva os dados no Firebase.

Visão geral do fluxo (resumido)
- Prepare sua planilha (use o arquivo modelo se quiser)
- Abra o site (`index.html`) no navegador
- Abra o modal de importação e carregue o arquivo (.xlsx ou .csv)
- Veja a pré-visualização, clique em "Importar" e confirme no resumo
- Baixe um backup do mês, confirme e conclua a importação

Requisito mínimo
- Navegador moderno (Chrome, Edge, Firefox, Safari)
- O arquivo `index.html` do projeto (já contém a lógica do importador)
- Opcional: Excel / LibreOffice / Google Sheets para editar a planilha

Arquivo de modelo (recomendado)
--------------------------------
Há um arquivo modelo em `scripts/import-template.csv`. Ele tem o cabeçalho e alguns exemplos. Você pode:

- Abrir esse arquivo no Excel e editar as linhas.
- Ou criar uma planilha nova com as colunas abaixo e salvar como `.xlsx` ou `.csv`.

Cabeçalho recomendado (colunas):

Data	Descrição	Valor	FormaPagamento	Categoria	Pago

Observação: o importador é tolerante e tenta detectar variações de nomes de colunas (ex.: "Data", "data", "Date"). Ainda assim, usar esse cabeçalho facilita e reduz riscos.

Explicando cada coluna (exemplos práticos)
- Data — Data da transação. Formatos aceitos (preferência):
	- ISO: 2025-08-15 (recomendado)
	- BR: 15/08/2025 (também costuma funcionar)

- Descrição — Texto livre para identificar a conta (ex: Supermercado Silva)

- Valor — Número com ponto ou vírgula como separador decimal:
	- Despesa: use sinal negativo (ex: -350,00 ou -350.00)
	- Entrada: valor positivo (ex: 3500,00)

- FormaPagamento — Texto indicando o meio (ex: Dinheiro, PIX, Nubank, Transferência, VR, VT, Boleto)
	- Use exatamente os nomes de seus meios configurados no app para melhores ícones, mas não é obrigatório.

- Categoria — Texto livre (ex: Mercado, Transporte, Assinaturas). Para consistência, prefira categorias já existentes nas configurações do app.

- Pago — Indica se a transação já foi paga:
	- Valores aceitos: Sim / Não, S / N, 1 / 0, true / false (case-insensitive)

Exemplo de conteúdo (CSV ou colunas no Excel)

Data	Descrição	Valor	FormaPagamento	Categoria	Pago
2025-08-15	Supermercado Silva	-350,00	Dinheiro	Mercado	Sim
2025-08-20	Salário Agosto	3500,00	PIX	Salário	Sim
2025-08-22	Assinatura Streaming	-29,90	Nubank	Assinaturas	Não

Passo-a-passo detalhado (faça no mínimo o Passo 1 e 2 antes de prosseguir)
-----------------------------------------------------------------------
1) Preparar a planilha
- Abra `scripts/import-template.csv` no Excel (ou crie uma nova planilha) e cole suas transações mantendo o cabeçalho.
- Dicas de formatação:
	- Coluna Data: prefira o formato ISO `YYYY-MM-DD` (ex: 2025-08-15). Se usar `DD/MM/YYYY`, confirme na pré-visualização.
	- Coluna Valor: use vírgula ou ponto para decimais; inclua sinal negativo para despesas.
	- Não use fórmulas na planilha (use valores simples). O importador lê valores, não fórmulas.

2) Salvar o arquivo
- No Excel: Salvar como "Pasta de trabalho do Excel (*.xlsx)" é a escolha mais segura.
- Se preferir CSV, salve como CSV UTF-8 (comma separated) ou CSV (padrão); o importador lê .csv e .xlsx.

3) Abrir o site (duas opções)
- Opção A — Abrir localmente (mais simples): dê um duplo-clique em `index.html` no Explorador de Arquivos e ele abrirá no navegador padrão.
- Opção B — Servir via servidor estático (recomendado para evitar limitações de leitura de arquivo em alguns navegadores):
	- Se tiver Python instalado, abra um PowerShell na pasta do projeto e execute:

```powershell
python -m http.server 8000
```

	- Em seguida abra no navegador: http://localhost:8000/index.html
	- Para abrir automaticamente no navegador via PowerShell:

```powershell
Start-Process "http://localhost:8000/index.html"
```

4) Abrir o modal de importação
- No cabeçalho do site, clique no ícone de upload/Importar (botão com título "Importar dados"). Isso abrirá a janela de importação preparada.

5) Selecionar o arquivo
- Clique em "Escolher arquivo" e selecione seu `.xlsx` ou `.csv` salvo.
- O importador faz automaticamente:
	- leitura do arquivo (.xlsx ou .csv)
	- tentativa de mapear colunas (Data, Descrição, Valor, FormaPagamento, Categoria, Pago)
	- conversão dos valores de número (vírgulas/pontos tratados)

6) Verificar a pré-visualização
- O conteúdo do arquivo aparece em uma tabela de pré-visualização.
- Verifique especialmente:
	- Se as datas foram convertidas corretamente.
	- Se os valores aparecem com o sinal correto (positivo/negativo).
	- Se a coluna Pago foi interpretada (Sim/Não).
- Se algo estiver errado com o mapeamento (coluna incorreta), a correção mais simples é: voltar ao Excel, ajustar o cabeçalho da coluna para um dos nomes esperados (ex.: "Data", "Descrição", "Valor", "FormaPagamento", "Categoria", "Pago"), salvar e reimportar.

7) Preparar a importação (botão "Importar para o mês selecionado")
- Ao clicar, o importador não salvará imediatamente. Em vez disso, ele:
	- Infere o mês/ano alvo a partir da primeira data válida encontrada nas linhas (ou usa o mês atual se não encontrar datas válidas).
	- Decide se os lançamentos devem ir para `incomes` (entradas) ou `expenses` (despesas) com uma heurística simples (mais valores positivos → entradas; mais negativos → despesas).
	- Mostra um resumo com: número de linhas detectadas, direção inferida (incomes/expenses), mês/ano alvo e soma total (considerando sinais).

8) Baixar backup do mês alvo (fortemente recomendado)
- No resumo haverá um botão "Baixar backup do mês atual". Clique nele para baixar um JSON contendo os lançamentos existentes do mês que será alterado.
- Guarde esse backup em um local seguro antes de confirmar a importação (ex: `backup-2025-08.json`).

9) Confirmar a importação
- Após baixar o backup e revisar o resumo, clique em "Confirmar importação". O site então:
	- Gera IDs para cada item importado (prefixo `imp-`)
	- Mescla os lançamentos importados no mês alvo (não sobrescreve o mês por padrão — adiciona ao final da lista)
	- Chama a função de salvamento já existente que persiste os dados no Firebase
	- Ao concluir, o modal fecha e a página recarrega mostrando os dados atualizados

10) Verificar o resultado
- Após o reload, verifique:
	- Na tabela de Entradas/Despesas do mês selecionado, os novos lançamentos aparecem.
	- KPIs (totais) foram atualizados conforme esperado.
	- Se algo estiver incorreto, importe o backup salvo no passo 8 (veja "Como reverter / restaurar" abaixo).

Como reverter / restaurar (se algo deu errado)
- Se algo for importado errado, use o arquivo JSON de backup que você baixou:
	- Abra o menu de exportação do app e faça export (ou substitua o estado atual pelo backup local usando o import JSON da aplicação). O app também tem uma função para importar `import.json` (formato idêntico ao exportado).
	- Alternativa rápida: peça para eu converter 3–6 linhas problemáticas em payload JSON e eu te passo o objeto pronto para restaurar via import automático.

Dicas e boas práticas
- Primeiro teste sempre em um mês seguro: escolha ano 2099 ou qualquer mês futuro para testar a importação sem afetar dados reais.
- Evite re-importar o mesmo arquivo sem antes deduplicá-lo localmente para não gerar itens duplicados (os IDs gerados serão novos a cada import).
- Para valores muito grandes (milhares de linhas), preferir dividir em arquivos menores para reduzir o uso de memória do navegador.

Resolução de problemas comuns
- "Datas aparecem erradas": verifique formato de data no Excel; prefira `YYYY-MM-DD` ou salve como texto no CSV.
- "Valores aparecem vazios ou com 0": verifique se você salvou células com números (sem fórmulas não avaliadas) e se usou ponto ou vírgula corretamente.
- "Colunas não mapeadas": ajuste o cabeçalho conforme a seção 'Cabeçalho recomendado' e tente novamente.
- "Arquivo CSV com caracteres estranhos (acentos)": salve como CSV UTF-8 no Excel/LibreOffice.
- "Importador não abre" ao clicar em Importar: verifique se o `index.html` foi aberto corretamente no navegador; se necessário sirva via `python -m http.server 8000` e abra http://localhost:8000/index.html

Se quiser que eu converta sua planilha para o payload pronto
- Cole aqui (nesta conversa) o cabeçalho seguido de 2–6 linhas de exemplo e eu retorno o JSON pronto para importar (ou instruções para restaurar via `import.json`).

Resumo rápido (checklist)
- [ ] Preparar planilha com o cabeçalho
- [ ] Salvar como .xlsx ou CSV UTF-8
- [ ] Abrir `index.html` no navegador (ou servir via Python)
- [ ] Abrir Importar → escolher arquivo → verificar pré-visualização
- [ ] Clicar em Importar → baixar backup do mês alvo
- [ ] Confirmar importação
- [ ] Verificar resultados no app

Arquivo modelo disponível: `scripts/import-template.csv`

Precisa que eu faça algo automaticamente agora? Se você colar aqui 3–6 linhas (incluindo cabeçalho) eu converto e devolvo o JSON pronto para importação e te explico como restaurar/persistir caso queira usar o importador antigo.
