# Interface e verificação

## Organização

O código de navegador está em `src/`. `app.js` gere rotas e conteúdo, `core.mjs` regras independentes do DOM, `selects.mjs` os menus escuros, `crowd.mjs` o modelo semanal, `i18n.js` traduções e `styles.css` apresentação. O build conserva os caminhos públicos dos módulos na raiz de `dist/`, apesar da reorganização das fontes.

## Menus e teclado

As categorias são botões com estado `aria-pressed`. Os restantes seletores são melhorados progressivamente: o `select` mantém o valor e os eventos, mas fica oculto quando o menu visual é criado. A interface utiliza `details` e `summary`, com botões de opção e indicação da seleção.

Tab percorre os controles; Enter ou Espaço abre e seleciona. Setas percorrem opções e Escape fecha o menu, devolvendo foco ao resumo. Apenas um menu permanece aberto. O fechamento por clique exterior não seleciona opções. O contraste escuro é controlado pela aplicação, sem depender do tema dos menus nativos do sistema operativo.

## Apoio, instalação e privacidade

A informação de orçamento zero fica apenas no rodapé; não há popup de apoio.

Os controles de instalação usam o evento de instalação do navegador quando disponível e apresentam instruções nos restantes casos. O botão de topo aparece após deslocação suficiente, respeita movimento reduzido e devolve foco à marca da página.

As rotas `#about` e `#privacy` são separadas. O botão de apagar dados elimina as preferências da aplicação; o texto explica que cache offline podem ser removidos nas definições do navegador.

## Validações da revisão

- Testes automatizados de regras de negócio, traduções e estimativas semanais passaram.
- Menu escuro: Peixe → Pescada filtrou o catálogo; a seleção traduziu para “Hake” ao mudar para inglês.
- Os seis dias de serviço apresentaram perfis distintos; domingo sem gráfico.
- Setas, Enter e Escape funcionaram nos menus; Escape fechou sem deixar o painel aberto.
- O aviso de apoio foi substituído por informação permanente no rodapé.
- Planeador mostrou o aviso de antecedência e preçários distintos; privacidade abriu na rota própria.
- Viewports de 390 px e 320 px, incluindo texto ampliado, sem transbordamento horizontal da página.
- Voltar ao topo levou a deslocação a zero e devolveu foco à marca.
- Nenhum erro de consola observado durante esses percursos.
