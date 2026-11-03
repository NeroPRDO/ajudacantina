# Pesquisa e decisões — 02/11/2026

## Fontes do IPB

- https://sas.ipb.pt/index.php/sas/servicos/alimentacao
  - Bragança, Sala Grande: segunda–sábado, 12:00–14:30 e 19:30–21:30.
  - Sala Alternativa: segunda–sexta, 12:00–14:30.
  - Snack-bar: segunda–sexta, 11:00–15:00 e 18:00–22:00.
  - Mirandela: segunda–sábado, 12:00–14:00 e 19:30–21:30.
  - Encerramento ao domingo.
- https://sas.ipb.pt/index.php/sas/servicos/alimentacao/precos-e-pratos
  - A página consultada apenas anuncia publicação posterior do despacho com o novo preço. Não há preço atual verificável na resposta.
- https://atlas.ipb.pt/pt/viver/viver-mais/alimentacao-alojamento
  - Fonte institucional que aponta `online.unipb.pt` para aquisição de senhas. O domínio institucional também usa a designação UPB; preservámos IPB por ser a identificação solicitada e usada pelo acervo.
- https://mentoringacademy.unipb.pt/pt-pt/boasvindas
  - Confirma aquisição de senhas nos serviços online.

## Fotografias verificadas

O catálogo apresenta exclusivamente o arquivo histórico de @comidasdoipb, com crédito e ligação por publicação. Ver ARCHIVE-RELEASE.md para o processo de recolha.

## Referências de interface

- https://prefeituralimeira.unicamp.br/restaurantes-universitarios/ — acesso direto a informação de refeições e recursos de acessibilidade.
- https://p4e.ufpr.br/ru/ e https://p4e.ufpr.br/ru/cardapio-ru-centro-politecnico/ — leitura automatizada indisponível durante a consulta (erro/timeout).
- https://github.com/beqramo/Cantina — referência funcional; usa Next.js, Firebase, votos e rotas de servidor. Não copiámos o código nem adicionámos esses serviços, pois o pedido privilegia um site estático gratuito sem contas.

## APIs e arquitetura

A pesquisa não identificou uma API pública documentada dos SAS-IPB para ementas, receitas ou lotação. Isso não prova que não exista uma integração institucional; seria necessário confirmar com os SAS.

Foi consultada a API TheMealDB (https://www.themealdb.com/api.php). É um catálogo genérico de receitas, não uma fonte da cantina. Não foi integrada: associar receitas/fotos genéricas a pratos do IPB criaria informação enganadora, sobretudo em ingredientes e preparação. O site não depende de APIs externas no carregamento.

Referências técnicas oficiais:
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable

## Conteúdo deliberadamente não inventado

Não foram criadas fotografias sintéticas de refeições, preços atuais, avaliações coletivas, medições de lotação, ingredientes, tempos de preparação ou ementas do dia. O gráfico da calculadora deriva exclusivamente das escolhas locais do utilizador.

## Take-away — revisão de 03/11/2026

O Despacho 109/IPB/2020 (https://webdocs.ipb.pt/portal/download?docId=23072), secção III.5, descrevia opção na reserva, custo de embalagem e levantamento do jantar ao almoço. Documento de contexto pandémico de 2020: não confirma regras vigentes. A aplicação orienta confirmar disponibilidade, preço e recolha junto dos SAS e não promete levantamento antecipado nem cita uma taxa atual.
