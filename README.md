<div align="center">

# ajuda.cantina

### Da comunidade, para a tua bandeja.

Um guia independente para descobrir refeições, guardar favoritos e planear a vida na cantina.

[**Abrir a aplicação**](https://neroprdo.github.io/ajudacantina/) · [**Como contribuir**](#contribuir) · [**Fontes e agradecimentos**](#fontes-e-agradecimentos)

[![Validação e publicação](https://github.com/NeroPRDO/ajudacantina/actions/workflows/pages.yml/badge.svg)](https://github.com/NeroPRDO/ajudacantina/actions/workflows/pages.yml)
![Projeto comunitário](https://img.shields.io/badge/projeto-comunit%C3%A1rio-b49aff)
![Orçamento zero](https://img.shields.io/badge/or%C3%A7amento-%E2%82%AC0-b6e9c5)

</div>

> **Independente e feito para a comunidade.** A ajuda.cantina não representa o IPB nem os Serviços de Ação Social (SAS). Não substitui as ementas, reservas, preços ou orientações dos serviços oficiais.

## Navegação

[O projeto](#o-projeto) · [Funcionalidades](#funcionalidades) · [Instalar](#instalar-a-aplicação) · [Preços](#preços-e-reservas) · [Privacidade](#privacidade) · [Desenvolvimento](#desenvolvimento) · [Publicação](#publicação) · [Contribuir](#contribuir)

## O projeto

A ajuda.cantina aproxima informação que costuma estar dispersa: fotografias de refeições, horários, favoritos pessoais e planeamento de despesas. O catálogo cresce com as contribuições e preserva a origem de cada registro.

É um **arquivo visual, não a ementa do dia**. O mesmo prato pode aparecer em publicações diferentes, com acompanhamentos ou apresentação diferentes. O contador da aplicação reflete o catálogo disponível; não pretende contar receitas únicas.

A aplicação é gratuita, não exige conta e funciona como um site estático. O projeto é mantido com **orçamento de €0**.

## Funcionalidades

| Para quem usa | O que permite |
| --- | --- |
| Explorar | Pesquisar sem distinção de acentos e consultar fotografias com créditos e links de origem. |
| Filtrar | Escolher uma categoria e refinar por ingrediente ou preparação, mantendo pesquisa, favoritos e avaliação pessoal combinados. |
| Guardar | Marcar favoritos e atribuir avaliações pessoais no próprio dispositivo. |
| Planear | Simular almoços, jantares, saldo e carregamento necessário com os preços informados pela pessoa. |
| Consultar | Ver horários, avisos de preços e estimativas visuais de movimento por dia da semana. |
| Instalar | Adicionar a aplicação ao telemóvel ou computador e consultar conteúdo já guardado sem ligação. |
| Acessibilidade | Usar teclado, foco visível, menus escuros, texto ampliado, contraste reforçado e movimento reduzido. |

A interface suporta português de Portugal e do Brasil, inglês, francês e espanhol. Nomes de pratos sem tradução conservam o original. **Avaliações coletivas estão em desenvolvimento**; as notas existentes são pessoais, não médias da comunidade.

## Instalar a aplicação

Abra a aplicação e escolha **Instalar aplicação**, disponível na secção de instalação e no rodapé. Quando o navegador suporta instalação direta, aparece o diálogo do sistema. Nos restantes casos, a aplicação apresenta instruções.

- **Android ou computador:** procurar a opção de instalar no navegador compatível.
- **iPhone/iPad:** no Safari, usar **Partilhar → Adicionar ao ecrã principal**.
- **Offline:** a primeira visita precisa de internet. Interface e dados ficam em cache; fotos históricas são guardadas quando consultadas. Imagens ainda não vistas podem não estar disponíveis offline.
- **Atualizações:** a aplicação recebe a nova versão quando está online; a página pode recarregar para concluir a atualização. Favoritos e preferências permanecem no navegador.

Não é necessário descarregar executáveis ou criar uma conta.

## Preços e reservas

> **Confirma sempre o preço final no sistema oficial antes de reservar.** O valor pode variar conforme a antecedência e o horário da reserva. A Sala Alternativa tem preçário diferente da Sala Grande.

O planeador é uma simulação: usa os preços introduzidos pela pessoa e não calcula automaticamente suplementos, escalões, atrasos ou alterações de tarifa. Um valor observado numa reserva não deve ser apresentado como preço universal. O projeto não efetua pagamentos ou reservas.

[Consultar os SAS](https://sas.ipb.pt/index.php/sas/servicos/alimentacao) · [Preços e pratos](https://sas.ipb.pt/index.php/sas/servicos/alimentacao/precos-e-pratos) · [Ementas e reservas](https://online.unipb.pt/)

## Movimento e filas

Os gráficos são **estimativas visuais**, construídas a partir de referências fornecidas pela comunidade. Os padrões podem variar por dia, mas não representam contagens de pessoas, percentagens da capacidade, tempos de espera ou dados em tempo real.

A escala é ilustrativa, as alturas das barras são aproximadas e os intervalos são interpolados. Capturas de fontes externas podem ter escalas diferentes; não permitem comparar ocupação exata entre dias. Feriados, interrupções de serviço e alterações de rotina podem tornar a estimativa inaplicável.

Consulte a [metodologia](docs/METHODOLOGY.md) antes de atualizar o modelo ou interpretar as médias. Preferimos explicitar uma limitação a inventar precisão.

## Fontes e agradecimentos

O arquivo visual assenta sobretudo no trabalho de **projetos terceiros**. Agradecemos especialmente a [@comidasdoipb](https://www.instagram.com/comidasdoipb/), e a todas as pessoas que dedicaram tempo a fotografar e partilhar as refeições.

A ajuda.cantina organiza essas contribuições para facilitar a consulta; **não reivindica a autoria das fotografias**. Cada ficha mantém o crédito e a publicação de origem. Datas, ingredientes, receitas ou alergénios desconhecidos permanecem sem confirmação. Categorias editoriais ajudam a pesquisar, mas não substituem informação alimentar oficial.

Os direitos sobre imagens e textos pertencem aos respetivos titulares. Os créditos não substituem eventuais autorizações de reutilização. Para pedir correção ou remoção, envie a publicação e o pedido para **ajuda.cantina.unipb@gmail.com**. Obrigado por nos ajudar a respeitar e valorizar as fontes.

## Privacidade

- Não há conta de utilizador ou sincronização de preferências. Google Analytics é opcional e só é carregado após aceitação; a escolha pode ser alterada no rodapé.
- Favoritos, avaliações, idioma, acessibilidade e planeamento ficam no `localStorage` deste navegador.
- A informação de apoio fica apenas no rodapé. A escolha de estatísticas é guardada separadamente dos favoritos.
- O service worker guarda arquivos públicos e imagens consultadas para uso offline.
- O botão da página de privacidade apaga as preferências. Para remover também cache offline, limpar os dados do site nas definições do navegador.
- Fotos são servidas pelo próprio site. Links externos abrem serviços com políticas próprias; o GitHub Pages pode processar dados técnicos inerentes à hospedagem.
- O contacto por email é opcional. Recebemos apenas o conteúdo enviado para responder à mensagem; não envie credenciais, dados de pagamento ou informação sensível.

[Privacidade na aplicação](https://neroprdo.github.io/ajudacantina/#privacy)

## Desenvolvimento

Requer **Node.js 22 ou superior**. Não existem dependências de execução a instalar.

```sh
npm run dev      # construir e iniciar a prévia local
npm test         # testar as regras de negócio
npm run check    # testes, build limpo e validação dos artefatos
npm run build    # gerar dist/
```

A prévia abre em `http://127.0.0.1:4173/ajudacantina/`. Após alterar código, execute o build e recarregue a página; se houver uma PWA anterior, aceite o aviso de atualização.

### Organização

```text
src/             Interface, estilos, traduções, menus e regras da aplicação
assets/          Fotografias creditadas e ícones
data/           Catálogo, fontes e configuração dos espaços
scripts/         Build, servidor local, importação e validação
tests/          Testes automatizados
docs/           Metodologia e registros técnicos
.github/         CI/CD e atualização de Actions
index.html       Documento de entrada
manifest.webmanifest  Metadados da PWA
dist/            Site gerado; não editar nem versionar
```

As pastas locais `imports/` e `.qa/` são ignoradas pelo Git e não entram na publicação. O código fonte em `src/` é copiado para a raiz de `dist/` no build, preservando os endereços públicos dos módulos e a atualização das instalações existentes.

### Atualizar conteúdo

Editar `data/dishes.json`, preservar IDs já publicados e incluir imagem local, crédito e fonte. Não inventar datas, receitas ou alergénios. Categorias e subtipos devem corresponder à informação disponível; atualizar traduções ao introduzir novos controles. Depois, executar `npm run check`.

Os horários e fontes ficam em `data/site.json`. O modelo semanal fica em `src/crowd.mjs`. A importação de um arquivo local é uma operação de manutenção; não é necessária para clonar, testar ou publicar o projeto.

## Publicação

O GitHub Actions valida o projeto em versões suportadas do Node.js, constrói o site e publica somente `dist/` a partir de `main`. Pull requests executam validações sem publicar. O workflow verifica após o deploy a versão, o catálogo e os arquivos essenciais; uma falha de verificação não desfaz automaticamente uma publicação já realizada.

A configuração usa permissões mínimas, limites de execução e controle de concorrência. O Dependabot propõe atualizações das Actions. Para recuperar uma versão anterior, reverter a alteração problemática e passar novamente pelo workflow.

**Endereço gratuito:** no GitHub Pages, o subdomínio depende do nome da conta ou organização. Um endereço de projeto usa `conta.github.io/repositorio/`; um site principal usa `conta.github.io`. Um nome genérico como `nome-do-projeto.github.io` exige uma conta ou organização com esse nome disponível e um repositório correspondente. Não é possível escolher livremente outro subdomínio mantendo o mesmo proprietário. Um domínio independente exige registo e configuração próprios.

## Contribuir

Ajuda com fotografias autorizadas, correções, acessibilidade, traduções, documentação ou desenvolvimento é muito bem-vinda. Abra uma [issue](https://github.com/NeroPRDO/ajudacantina/issues) ou entre em contacto por **ajuda.cantina.unipb@gmail.com**.

Para apoiar o desenvolvimento ou conversar sobre uma futura migração para servidor com backend e base de dados, use o mesmo email. Toda a colaboração é voluntária; a aplicação continua gratuita. Não existe cobrança, formulário de pagamento ou compromisso automático.

**Obrigado por usar, partilhar e cuidar deste projeto connosco.**

## Descoberta na web

O build gera um guia HTML indexável e um sitemap, com metadados e dados estruturados. A configuração do Search Console, o consentimento do Analytics e as limitações de SEO estão documentados em [docs/SEO.md](docs/SEO.md). Não há promessa de posição nos resultados de pesquisa.

## Mural da comunidade

O mural discreto está acessível no rodapé. Para adicionar uma assinatura autorizada, editar `data/wall.json` com uma lista de objetos `{"name":"Nome autorizado"}`. Não publicar email, contactos privados ou mensagens sem autorização. Não existe formulário público nem banco de dados; cada atualização passa pela revisão e publicação habituais.

## Pesquisa, instalação e horários

A pesquisa tem prioridade na primeira página, permite limpar o texto e fechar o teclado com a tecla de pesquisa. A instalação deixa de ser promovida quando a aplicação está aberta em modo instalado. Os gráficos de movimento usam navegação entre dias, sem menus sobrepostos. O contador de abertura usa o relógio do dispositivo e o fuso de Lisboa; alterações extraordinárias dependem dos serviços oficiais.

O guia de take-away distingue a referência histórica das condições atuais, que devem ser confirmadas nos SAS.
