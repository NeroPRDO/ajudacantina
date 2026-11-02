# Validação da primeira versão

Data: 02/11/2026.

## Automatizada

`npm run check` passou: verificação de sintaxe, oito testes do Node.js e build estático.

Cobertura: valores monetários em cêntimos; preços distintos; saldo insuficiente e excedente; entradas inválidas; hora de verão em Lisboa; limites exatos de abertura/fecho; domingos, datas inválidas e encerramentos cadastrados; busca sem acentos; combinação de filtros/favoritos; normalização de preferências; integridade dos cinco idiomas; fontes do catálogo.

## Navegador

Verificado no navegador integrado, com o mesmo caminho `/Cantina-MENU/` usado pelo GitHub Pages:

- Fotos reais carregadas, pesquisa por `almondegas` encontra `Almôndegas estufadas`.
- Favorito e avaliação pessoal 4/5 preservados após recarregar.
- Seleção de 2 dias, almoço 2,85 €, jantar 3,10 €, saldo 10 €: 4 refeições, total 11,90 €, recarga 1,90 €.
- Domingos desativados no calendário.
- Interface e números verificados em francês e inglês.
- Layout de 390 px e de 320 px com texto ampliado/contraste reforçado. Corrigida a extensão decorativa da imagem principal que causava rolagem horizontal; catálogo, calendário e horários sem excesso de largura após correção.
- Nova versão do service worker detetada, aviso de atualização apresentado e atualização aplicada sem perder preferências.
- Servidor local desligado e página recarregada: catálogo, busca por soja e fotografia continuaram disponíveis no cache.
- Sem erros JavaScript nos fluxos observados.

## Limites da validação

Não foi realizada auditoria formal WCAG, teste em leitor de ecrã real ou instalação num dispositivo Android/iOS físico. A instalação depende do navegador; manifesto e ícones foram incluídos. Não foi testada sincronização de avaliações coletivas porque essa funcionalidade não existe nesta versão estática.
