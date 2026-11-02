# Ajuda Cantina

Guia comunitário da cantina do IPB, independente do IPB/SAS. Interface escura e roxa, mobile-first, sem conta e sem dependências de execução externas. Preparado para **https://neroprdo.github.io/Cantina-MENU/**.

## Executar

Requer Node.js 22 ou superior. Não precisa de `npm install`.

```sh
npm run dev
```

Abrir **http://127.0.0.1:4173/Cantina-MENU/**. O servidor também aceita `/`, para testar uma hospedagem na raiz. Para alterações no código, executar `npm run build` novamente e aceitar a atualização da aplicação no navegador. Durante desenvolvimento, pode desregistar o service worker pelas DevTools para evitar uma versão anterior em cache.

```sh
npm test       # regras de negócio, datas, pesquisa e idiomas
npm run check # sintaxe, testes, validação dos dados e build
```

## Funcionalidades

- Catálogo com fotografias reais e publicação de origem em cada ficha.
- Pesquisa sem distinção de acentos, categorias, ordenação e estados vazios.
- Favoritos e avaliações **pessoais**, guardados em `localStorage`.
- Planeador mensal: almoço e/ou jantar por dia, preços distintos, saldo, total, valor a carregar e gráfico da distribuição das refeições.
- Horários das quatro unidades referidas pelos SAS, com estado calculado em `Europe/Lisbon` e ajuste de hora de verão. Não indica ocupação em tempo real.
- Português de Portugal, português do Brasil, inglês, francês e espanhol; preferência persistente.
- Teclado, link para saltar ao conteúdo, foco visível, diálogos nativos, mensagens de estado, opção de texto maior e contraste reforçado, respeito por movimento reduzido.
- Manifesto PWA e service worker: catálogo e fotos disponíveis offline após a primeira instalação do cache; aviso para aplicar uma nova versão.
- Metadados de pesquisa, canonical, sitemap e robots.

## Publicação no GitHub Pages

1. Enviar os ficheiros deste projeto para a branch `main` de `NeroPRDO/Cantina-MENU`.
2. No GitHub, em **Settings → Pages → Build and deployment → Source**, selecionar **GitHub Actions**.
3. O workflow `.github/workflows/pages.yml` valida o projeto e publica apenas `dist/`. Em PRs, executa só validação/build.
4. Acompanhar **Actions → Validate and publish GitHub Pages** e abrir o URL devolvido pelo job `deploy`.

Atualizações de código, dados e fotos na `main` geram um novo build. O hash do conteúdo muda a versão do cache. Quem tiver a aplicação aberta vê um aviso quando a nova versão está pronta; ao atualizar, preferências e favoritos permanecem. A aplicação instalada continua a receber atualizações quando aberta com internet.

Não há funções de servidor, chaves de API, serviços pagos nem formulários a transmitir dados. As quotas gratuitas do GitHub continuam aplicáveis. Um domínio próprio é opcional e normalmente envolve um custo; não é necessário para esta versão.

## Manutenção do catálogo

Editar `data/dishes.json`. Cada prato tem um ID estável — não o alterar após publicação, pois é a referência dos favoritos.

```json
{
  "id": "nome-do-prato",
  "name": "Nome tal como consta na fonte",
  "translations": {"en": "English name", "fr": "Nom français", "es": "Nombre español"},
  "categories": ["meat"],
  "tags": ["sinónimo", "termo de pesquisa"],
  "description": {"pt": "Descrição verificável", "en": "Description", "fr": "Description", "es": "Descripción"},
  "image": "assets/nome-do-prato.jpg",
  "imagePosition": "center",
  "date": "2026-11-02",
  "source": "https://exemplo.com/publicacao-original",
  "credit": "Nome do autor/perfil",
  "ingredients": null,
  "preparation": null,
  "allergens": null,
  "verifiedRecipe": false
}
```

Categorias: `meat`, `fish`, `vegetarian`, `pasta`, `soup`, `dessert`. Várias categorias são permitidas; a primeira é o rótulo do cartão. `ingredients` é uma lista quando há fonte verificada; `preparation` é texto ou `null`. Não inferir alergénios ou segurança alimentar a partir de fotos. Descrições traduzidas não substituem uma ficha técnica.

Usar imagens locais com nomes estáveis, dimensionadas para web. Evitar URLs temporários do Instagram. Manter a foto original, respetivo crédito e referência; confirmar as condições de reutilização com o responsável pelo acervo para a expansão do catálogo. O projeto não recebe direitos sobre as fotografias por incluí-las.

O build verifica IDs duplicados, caminhos, categorias, traduções e fontes. Após editar, executar `npm run check`.

## Dados oficiais e limitações conhecidas

Ver [docs/RESEARCH.md](docs/RESEARCH.md) para fontes e decisões.

- **4 pratos reais importados**, todos do perfil `@comidas.ipb`, de 29–30/10/2026. O arquivo de 150–200 registros estimado no briefing **não foi importado integralmente**. O acesso público do Instagram permitiu miniaturas, mas bloqueou leitura detalhada e navegação completa com pedido de login. O perfil histórico mostra fotos sem nomes legíveis nas miniaturas; não inventámos identificações.
- Horários consultados em 02/11/2026. Atualizar `data/site.json`, incluindo `verifiedOn` e eventuais datas de encerramento em `closures`.
- **Preço atual não confirmado**: a página dos SAS consultada não tinha uma tabela vigente legível. Cada pessoa informa o que paga; não usamos preços históricos como atuais.
- Não há ementa diária sincronizada, receita confirmada, média coletiva ou medição de lotação.
- Os registos do catálogo não provam disponibilidade no dia. O botão de ementas/reservas abre o serviço oficial.
- O planeador usa os dias habituais da Sala Grande de Bragança. Feriados não são considerados encerramentos automaticamente; alimentar `closures` apenas com confirmação.
- Favoritos e avaliações não sincronizam entre dispositivos. Limpar o armazenamento do navegador apaga-os. Não há backup remoto.
- Instalação depende do navegador. Em iOS, usar Safari → Partilhar → Adicionar ao ecrã principal.
- Traduções são editoriais; os nomes originais dos pratos e das salas são preservados para permitir identificação no local.

## Estrutura

- `app.js`: interface e eventos.
- `core.mjs`: cálculos em cêntimos, calendário, horários, pesquisa e normalização de preferências.
- `i18n.js`: traduções.
- `styles.css`: tema, responsividade e acessibilidade.
- `data/`: catálogo e informações das unidades.
- `assets/`: fotos originais e ícones próprios.
- `scripts/build.mjs`: validação, cópia do site, geração do service worker e metadados.
- `tests/`: testes com o runner nativo do Node.js.

## Privacidade

Uma chave local, `ajuda-cantina-v1`, guarda favoritos, avaliações, idioma, opções de acessibilidade, preços informados, saldo e calendário. Esses valores não são enviados pelo projeto. Não há cookies de rastreio ou bibliotecas de análise. O GitHub pode manter os registos técnicos inerentes à hospedagem. Consultar políticas dos sites externos ao abrir os respetivos links.

## Próximo conteúdo necessário

Para completar o arquivo, fornecer as fotos e nomes numa exportação/pasta do acervo, com publicação de origem ou identificação suficiente. Para receitas, alergénios, preços e exceções de horário, usar informação confirmada pelos SAS. O código e o formato de dados já suportam a expansão por PR.
