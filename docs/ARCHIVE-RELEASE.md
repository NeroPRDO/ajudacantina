# Expansão do catálogo — 2 de novembro de 2026

## Origem e cobertura

191 URLs únicos observados na grelha autenticada de `@comidasdoipb`, igual à contagem indicada no perfil: 189 publicações fotográficas e 2 reels. Os 189 nomes e capas foram incorporados em `data/dishes.json` e `assets/archive/`. Fontes individuais e créditos preservados; legendas completas e URLs temporários não publicados. Os reels e imagens internas dos carrosséis não estão no catálogo.

Datas históricas desconhecidas são `null`; `collectedOn` identifica a recolha. Registros repetidos do mesmo prato permanecem separados para preservar as fotografias de origem. Nomes seguem as legendas, sem dedução de receitas. Ingredientes, alergénios e origem de água doce/salgada não são confirmados por fotografia.

## Movimento

Consulta ao Google Maps em 02/11/2026 identificou “Cantina UPB”, Bragança, mas apresentou a mensagem de visualização limitada e não expôs a série semanal de horas populares. Restaurant Guru fornece informações gerais, não uma série verificável de contagens por dia. A captura de segunda-feira fornecida pelo utilizador serve somente como referência qualitativa: almoço mais movimentado que jantar.

O modelo publicado usa os picos indicados pelo utilizador (12:20–13:45 e 20:00–20:30), com índices ilustrativos. A revisão semanal usa os perfis distintos das capturas de segunda a sábado. Não há médias atribuídas ao Google, pessoas, capacidade, espera ou medições ao vivo. A média exibida é ponderada pelo tempo; domingo não tem série. A interface contém metodologia, limites e links para consulta.

## Validação

- 11 testes de lógica, incluindo cobertura de 189 fontes históricas únicas, filtros encadeados, avaliações pessoais, datas desconhecidas, horários e modelo semanal.
- Validação de sintaxe dos módulos, referências HTML, manifesto, imagens JPEG e exclusão de arquivos locais no artefato.
- Navegador: catálogo com registos do arquivo histórico; filtros Vegetariano → Tofu retornam 10 registros; filtro de avaliação mínima combina corretamente com uma avaliação pessoal de teste; carregamento adicional aumenta de 24 para 48.
- Ficha histórica apresenta data não confirmada, link original, crédito, avaliação pessoal e aviso de avaliação coletiva em desenvolvimento. Não apresenta receita inventada.
- Troca para inglês traduz as novas categorias. Menus nativos usam texto `#21182f` sobre fundo branco, incluindo as opções do seletor de idioma.
- Gráficos: sábado apresenta almoço e jantar; domingo mostra encerramento; médias do modelo 72/100 e 38/100. Tabelas alternativas disponíveis por teclado.
- Verificação de viewport móvel a 390 px e 320 px com texto ampliado: sem transbordamento horizontal da página.

O workflow testa em Node 22 e 24 antes de publicar e verifica o commit, a contagem e arquivos essenciais no endereço publicado. As versões anteriores de validação em `VALIDATION.md` descrevem o estado inicial e não substituem este registro.
