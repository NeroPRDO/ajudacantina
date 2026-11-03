# Pesquisa Google, Search Console e Analytics

## O que é publicado automaticamente

- Título, descrição, canonical e metadados de partilha na página inicial.
- Dados estruturados `WebSite` e `WebPage`, sem inventar avaliações, entidade oficial ou resultados garantidos.
- Guia HTML acessível sem JavaScript: `https://neroprdo.github.io/ajudacantina/guia-cantina-ipb.html`.
- Sitemap: `https://neroprdo.github.io/ajudacantina/sitemap.xml`, com páginas reais e sem fragmentos `#` tratados como páginas separadas.
- Diretivas de indexação no HTML e arquivo `robots.txt`. No GitHub Pages de projeto, o arquivo `/ajudacantina/robots.txt` **não controla o rastreio do domínio**: os robôs procuram `/robots.txt` na raiz do domínio. Enviar o sitemap no Search Console é o procedimento recomendado aqui.

SEO ajuda descoberta e compreensão; não garante indexação, posição ou prazo. Analytics mede utilização, não aumenta posições. Não repetir erros de escrita ou palavras-chave artificialmente: usar “cantina do IPB em Bragança” e “ajuda.cantina” naturalmente, com conteúdo útil, fontes e links de outros projetos quando legítimos.

## Configurar Search Console

1. Abrir o Search Console e adicionar uma propriedade de **prefixo de URL** exatamente `https://neroprdo.github.io/ajudacantina/`. Não usar propriedade de domínio, porque o domínio `github.io` não é nosso.
2. Em verificação, escolher **Tag HTML**. O código terá a forma `<meta name="google-site-verification" content="TOKEN_FORNECIDO_PELO_GOOGLE">`.
3. Copiar apenas o valor de `content` para `searchConsoleVerification` em `data/seo.json`, fazer commit e esperar o workflow. O build insere a tag no HTML publicado. Não editar `dist/`.
4. Voltar ao Search Console e clicar em **Verificar**. O ID `G-SVH473JREE` é do Analytics e não substitui esse token.
5. Em **Sitemaps**, enviar `sitemap.xml` dentro desta propriedade.
6. Em **Inspeção de URL**, testar a página inicial e o guia, verificar a versão publicada e solicitar indexação. Aguardar o processamento; evitar pedidos repetidos.
7. Acompanhar indexação, consultas, impressões e cliques. Atualizar informação útil e corrigir problemas apontados pelo Google.

O token está vazio até o titular fornecer o valor específico do Search Console. Não foi alegada verificação ou indexação automática.

## Analytics e consentimento

ID configurado: `G-SVH473JREE`, em `src/analytics.mjs`. A tag é carregada no `head` somente após aceitação. Sem aceitação não há carregamento do script Google por esta integração. Recusar mantém toda a aplicação disponível.

A escolha fica em `ajuda-cantina-analytics-v1` no armazenamento local e pode ser alterada em **Preferências de estatísticas**. A retirada bloqueia novos eventos e tenta limpar cookies de análise; não apaga dados já recebidos pelo Google. As preferências da aplicação são separadas desta escolha.

O envio de `page_view` é manual para as rotas conhecidas da aplicação, após atualizar o título. `send_page_view` fica desativado na configuração para não enviar uma visita inicial duplicada. No painel GA4, rever **Medição otimizada → Visualizações de página → alterações no histórico do navegador** e desativar a medição automática de histórico se estiver ativa, para que o tracking manual seja o único responsável pelas navegações.

Não são enviados termos pesquisados, favoritos, notas pessoais, saldo ou calendário. Eventos manuais usam apenas rotas conhecidas e removem parâmetros da URL. Sinais de publicidade e personalização ficam desativados. O guia HTML estático não carrega Analytics; a integração cobre a aplicação interativa.

Validar no Google Tag Assistant e no relatório em tempo real, com consentimento aceite. Bloqueadores podem impedir a tag. O código pode ser testado sem acesso à propriedade, mas só o titular confirma a receção dos dados no painel. Não colocar novamente um snippet direto no `index.html`: isso contornaria o consentimento e duplicaria a configuração.

## Manutenção

`scripts/seo.mjs` gera o guia e sitemap no build; `index.html` contém os metadados da entrada; `data/seo.json` recebe a verificação; `src/analytics.mjs` gere estatísticas. Horários do guia devem acompanhar mudanças dos SAS. Nunca publicar disponibilidade diária, preços fixos ou estatísticas inventadas para atrair cliques.

Fontes: [guia de SEO do Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent), [medição de aplicações de página única](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications).
