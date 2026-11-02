# Ajuda Cantina

[Abrir o portal](https://neroprdo.github.io/ajudacantina/) · [CI/CD](https://github.com/NeroPRDO/ajudacantina/actions)

Guia visual da cantina do IPB, feito para a comunidade, com fotografias, pesquisa, favoritos, avaliações pessoais, horários e planeamento de refeições. Site estático em HTML, CSS e JavaScript no GitHub Pages, sem conta e sem dependências de execução externas.

> **PORTAL INDEPENDENTE:** este projeto não é um serviço oficial do IPB ou dos Serviços de Ação Social (SAS). Não afirma vínculo, aprovação ou representação institucional. Ementas, reservas, preços e informações oficiais devem ser confirmados diretamente com os SAS.

## Catálogo e fontes

**193 registros fotográficos:** 4 publicações de [@comidas.ipb](https://www.instagram.com/comidas.ipb/) e 189 de [@comidasdoipb](https://www.instagram.com/comidasdoipb/). Cada registro preserva nome, fotografia de capa, crédito e link original. Existem pratos fotografados várias vezes: não são 193 receitas únicas.

A recolha do perfil antigo encontrou 191 publicações. Os dois reels informativos ficaram fora do catálogo. Imagens adicionais dos carrosséis e datas de publicação não foram extraídas. Os registros históricos usam `date: null` e `collectedOn: "2026-11-02"`; a data de recolha não é apresentada como data da refeição.

Categorias e subtipos são classificações editoriais baseadas nos nomes publicados, não fichas de ingredientes ou alergénios. Informação ambígua fica sem classificação específica. A origem de água doce/salgada não é inferida quando desconhecida. Descrições e receitas desconhecidas permanecem vazias. Os nomes sem tradução preservam o português original.

Fontes: [SAS — Alimentação](https://sas.ipb.pt/index.php/sas/servicos/alimentacao), [preços e pratos](https://sas.ipb.pt/index.php/sas/servicos/alimentacao/precos-e-pratos), [ementas e reservas oficiais](https://online.unipb.pt/). Referências complementares: [Google Maps](https://www.google.com/maps/search/Cantina+IPB+Bragan%C3%A7a) e [Restaurant Guru](https://pt.restaurantguru.com/Cantina-IPB-Braganca).

## Funcionalidades

- Pesquisa sem distinção de acentos, contadores e carregamento progressivo de 24 registros.
- Filtros com ícones e dois níveis: categoria e ingrediente/preparação disponível. Carne, peixe, vegetariano, ovos, massas, sopas, sobremesas e outros; subtipos como frango, bovino, porco, tofu, soja, seitan, grão, cogumelos, salmão, pescada, bacalhau, marisco, filetes, grelhados e assados.
- Ordenação por nome, data conhecida ou avaliação pessoal; filtro de avaliação mínima e favoritos locais.
- Avaliação pessoal de 1 a 5 estrelas. **Avaliações coletivas: em breve, funcionalidade em desenvolvimento.** Não existem médias comunitárias fictícias.
- Planeador mensal com almoço/jantar, preços separados, cálculo em cêntimos, saldo, total e carregamento necessário. Não faz reservas ou pagamentos.
- Horários de quatro espaços em `Europe/Lisbon`, com hora de verão e exceções configuráveis.
- Gráficos estimados de movimento por dia, média do modelo e tabelas acessíveis.
- Português de Portugal e do Brasil, inglês, francês e espanhol; preferências persistentes.
- Menus nativos com contraste explícito, navegação por teclado, foco visível, etiquetas, mensagens de estado e diálogos; opções de texto maior e contraste reforçado; respeito por movimento reduzido.
- Layout adaptado a telemóvel e desktop, navegação móvel e imagens sob demanda.
- PWA instalável: interface e dados em cache; fotografias históricas guardadas conforme são consultadas; aviso de atualização. A primeira visita exige internet, e fotos ainda não vistas podem não estar disponíveis offline.
- Canonical, sitemap, robots, página 404 e service worker versionado pelo conteúdo.

## Movimento e filas: metodologia

Picos fornecidos pelo responsável pelo projeto: **12:20–13:45** e **20:00–20:30**, com subida no início do serviço e descida no final. O almoço tem intensidade relativa superior ao jantar, coerente com a captura de segunda-feira fornecida como referência visual.

**Não foi possível verificar médias semanais de horas populares do Google:** o Maps apresentou uma visualização limitada. Portanto, o site não atribui valores inventados ao Google. De segunda a sábado aplica-se o mesmo padrão estimado à Sala Grande de Bragança; domingo aparece encerrado. Não há evidência para diferenciar os dias.

A escala ilustrativa de 0 a 100 não representa percentagem da capacidade, pessoas, minutos de espera ou dados em tempo real. A média de cada refeição é a integral trapezoidal dos pontos do modelo dividida pela duração do serviço. Feriados e alterações de horário podem tornar o padrão inaplicável. O modelo está em `crowd.mjs`; substituir por dados reais apenas com fonte e data verificáveis.

## Executar e validar

Requer Node.js 22 ou superior. Não precisa de `npm install`.

```sh
npm run dev
npm test
npm run check
```

Abrir `http://127.0.0.1:4173/ajudacantina/`. O servidor também aceita `/`. Após editar, reconstruir com `npm run build` e aceitar a atualização da PWA. Durante desenvolvimento, pode remover o service worker pelas ferramentas do navegador.

`npm run check` executa testes, build limpo, verificação de sintaxe e validação dos artefatos. Os testes cobrem orçamento, datas, horários, pesquisa, preferências, idiomas, cobertura do arquivo, filtros combinados e estimativa de movimento.

## CI/CD e publicação

O workflow `.github/workflows/pages.yml` executa em push para `main`, PR para `main` e acionamento manual:

1. Testa e constrói em **Node.js 22 e 24**, com limite de 10 minutos por job.
2. Valida módulos, IDs, categorias, fontes únicas, caminhos, JPEGs, links locais do HTML, manifesto e exclusão de arquivos locais do artefato.
3. Publica somente `dist/`, apenas a partir de `main`, depois de ambas as validações passarem. PRs nunca fazem deploy.
4. Usa leitura no build e leitura, `pages: write` e `id-token: write` no deploy. Credenciais do checkout não ficam persistidas.
5. Serializa publicações sem interromper um deploy em andamento. Validações de PRs desatualizadas podem ser canceladas.
6. Verifica após publicar o commit em `release.json`, a contagem do catálogo e arquivos essenciais, com tentativas limitadas para propagação do CDN. Uma falha deixa o workflow vermelho; não desfaz automaticamente uma publicação já concluída.

O Dependabot propõe atualizações semanais das Actions. Em **Settings → Pages**, manter a origem **GitHub Actions**. Para recuperar uma versão anterior, reverter o commit problemático em `main` e publicar novamente. A proteção de branch pode exigir os jobs antes do merge; as regras da conta não são alteradas por este projeto.

## Manutenção e estrutura

Editar `data/dishes.json`. IDs publicados são estáveis e ligam favoritos e avaliações. Cada registro tem nome, categorias, subtipos, descrição por idioma, imagem local em `assets/`, fonte, crédito e data válida ou `null`. Ingredientes, preparação e alergénios ficam `null` quando desconhecidos. Só ativar `verifiedRecipe` com fonte adequada.

Categorias: `meat`, `fish`, `vegetarian`, `eggs`, `pasta`, `soup`, `dessert`, `other`. Um registro pode ter várias. Novos subtipos devem ser adicionados em `app.js` e nos dicionários de `i18n.js`.

- `index.html`, `app.js`, `styles.css`: interface, navegação, eventos e apresentação.
- `core.mjs`: orçamento, filtros, horários e preferências.
- `crowd.mjs`: modelo de movimento e média ponderada.
- `i18n.js`: traduções e variantes regionais.
- `data/`: catálogo, fontes e horários; `assets/archive/`: 189 capas históricas.
- `scripts/`: servidor, build, importação local, validação e verificação do deploy.
- `tests/`: testes com o runner nativo do Node.js; `.github/`: CI/CD e Dependabot.
- `docs/`: investigação e validação.

`scripts/import-archive.mjs` reproduz a importação a partir de `imports/comidasdoipb/`. O arquivo bruto contém legendas e URLs temporários e **não é enviado ao repositório ou site**. O build depende apenas do catálogo final e das imagens locais. A importação não é necessária para clonar, testar ou publicar o projeto.

## Avisos, direitos e privacidade

> **ARQUIVO COMUNITÁRIO, NÃO EMENTA DIÁRIA:** as fotografias não garantem disponibilidade, ingredientes, preço, apresentação ou qualidade atual. Confirmar restrições alimentares e alergénios diretamente com os SAS. Os preços atuais não estão confirmados: o planeador usa os valores informados pela pessoa.

As fotografias e os textos de origem pertencem aos respetivos titulares. Os créditos e links são preservados; a inclusão não constitui transferência de direitos nem associação oficial aos perfis, IPB ou SAS. Pedidos de correção ou remoção podem ser feitos nas [issues](https://github.com/NeroPRDO/ajudacantina/issues), identificando a publicação sem expor dados pessoais sensíveis. Esta declaração não substitui autorização eventualmente necessária à reutilização de conteúdo.

O portal não exige login, não publica no Instagram, não recolhe avaliações remotas e não usa ferramentas de análise ou cookies de rastreio próprios. A chave `ajuda-cantina-v1` em `localStorage` guarda favoritos, avaliações, idioma, acessibilidade, preços, saldo e calendário apenas no navegador. Limpar dados apaga essas preferências; não há sincronização nem backup remoto.

O service worker guarda arquivos públicos no cache do navegador. O GitHub pode processar dados técnicos inerentes à hospedagem; os serviços externos têm políticas próprias. Não guardar credenciais ou dados pessoais em arquivos públicos. A instalação da PWA depende do navegador e do sistema operativo.
