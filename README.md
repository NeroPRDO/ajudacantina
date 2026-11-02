<div align="center">

# Ajuda Cantina

### Da comunidade, para a tua bandeja.

Um guia independente para descobrir refeições, guardar favoritos e planear a vida na cantina.

[**Abrir a aplicação**](https://neroprdo.github.io/ajudacantina/) · [**Como contribuir**](#contribuir) · [**Fontes e agradecimentos**](#fontes-e-agradecimentos)

[![Validação e publicação](https://github.com/NeroPRDO/ajudacantina/actions/workflows/pages.yml/badge.svg)](https://github.com/NeroPRDO/ajudacantina/actions/workflows/pages.yml)
![Projeto comunitário](https://img.shields.io/badge/projeto-comunit%C3%A1rio-b49aff)
![Orçamento zero](https://img.shields.io/badge/or%C3%A7amento-%E2%82%AC0-b6e9c5)

</div>

> **Independente e feito para a comunidade.** A Ajuda Cantina não representa o IPB nem os Serviços de Ação Social (SAS). Não substitui as ementas, reservas, preços ou orientações dos serviços oficiais.

## Navegação

[O projeto](#o-projeto) · [Funcionalidades](#funcionalidades) · [Instalar](#instalar-a-aplicação) · [Preços](#preços-e-reservas) · [Privacidade](#privacidade) · [Desenvolvimento](#desenvolvimento) · [Publicação](#publicação) · [Contribuir](#contribuir)

## O projeto

A Ajuda Cantina aproxima informação que costuma estar dispersa: fotografias de refeições, horários, favoritos pessoais e planeamento de despesas. O catálogo cresce com as contribuições e preserva a origem de cada registro.

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

Abra a aplicação e escolha **Instalar aplicação**, disponível no destaque inicial e na secção de instalação. Quando o navegador suporta instalação direta, aparece o diálogo do sistema. Nos restantes casos, a aplicação apresenta instruções.

- **Android ou computador:** procurar a opção de instalar no navegador compatível.
- **iPhone/iPad:** no Safari, usar **Partilhar → Adicionar ao ecrã principal**.
- **Offline:** a primeira visita precisa de internet. Interface e dados ficam em cache; fotos históricas são guardadas quando consultadas. Imagens ainda não vistas podem não estar disponíveis offline.
- **Atualizações:** quando surgir o aviso de nova versão, escolher **Atualizar**. Favoritos e preferências permanecem no navegador.

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

O arquivo visual assenta sobretudo no trabalho de **projetos terceiros**. Agradecemos especialmente a [@comidas.ipb](https://www.instagram.com/comidas.ipb/) e [@comidasdoipb](https://www.instagram.com/comidasdoipb/), e a todas as pessoas que dedicaram tempo a fotografar e partilhar as refeições.

A Ajuda Cantina organiza essas contribuições para facilitar a consulta; **não reivindica a autoria das fotografias**. Cada ficha mantém o crédito e a publicação de origem. Datas, ingredientes, receitas ou alergénios desconhecidos permanecem sem confirmação. Categorias editoriais ajudam a pesquisar, mas não substituem informação alimentar oficial.

Os direitos sobre imagens e textos pertencem aos respetivos titulares. Os créditos não substituem eventuais autorizações de reutilização. Para pedir correção ou remoção, envie a publicação e o pedido para **ajuda.cantina.unipb@gmail.com**. Obrigado por nos ajudar a respeitar e valorizar as fontes.

## Privacidade

- Não há conta de utilizador, sincronização de preferências, análise de audiência ou rastreadores adicionados pelo projeto.
- Favoritos, avaliações, idioma, acessibilidade e planeamento ficam no `localStorage` deste navegador.
- O aviso de apoio usa `sessionStorage` para não repetir a abertura na mesma aba.
- O service worker guarda arquivos públicos e imagens consultadas para uso offline.
- O botão da página de privacidade apaga as preferências. Para remover também cache e marcador de sessão, limpar os dados do site nas definições do navegador.
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
