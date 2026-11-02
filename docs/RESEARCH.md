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

As quatro fotografias foram obtidas das miniaturas publicamente acessíveis do perfil fornecido pelo utilizador. Os nomes estão escritos nas próprias imagens. Originais preservados, sem recortar os ficheiros; o cartão usa `object-fit`, e a ficha mostra a imagem completa.

| Ficheiro | Prato | Publicação |
| --- | --- | --- |
| assets/lasanha.jpg | Lasanha | https://www.instagram.com/comidas.ipb/p/DfIqhXEN9xn/ |
| assets/costeletas.jpg | Costeletas de porco a salsicheito | https://www.instagram.com/comidas.ipb/p/DfFHUIltdtX/ |
| assets/soja.jpg | Soja salteada | https://www.instagram.com/comidas.ipb/p/DfFHQkSN5o-/ |
| assets/almondegas.jpg | Almôndegas estufadas | https://www.instagram.com/comidas.ipb/p/DfFHJ6uNWlL/ |

Crédito: **@comidas.ipb**. As publicações são de 29 e 30/10/2026. O texto “a salsicheito” é preservado da imagem original, mesmo que seja uma grafia incomum. A categoria vegetariana da soja vem do próprio post, não constitui certificação de receita ou ausência de alergénios.

O perfil https://www.instagram.com/comidasdoipb/ mostra um acervo histórico, incluindo publicações de 2023 e 2024. As miniaturas acessíveis não identificam os nomes, e abrir publicações exige login. Não foi realizado login, nem extração de dados privados. Completar o acervo depende de exportação dos responsáveis ou acesso público verificável.

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
