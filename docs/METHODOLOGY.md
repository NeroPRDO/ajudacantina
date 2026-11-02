# Metodologia do movimento semanal

## Referências e interpretação

O modelo atual utiliza seis capturas de “Horas populares” do Google, fornecidas pelo responsável pelo projeto: segunda a sábado. Não houve exportação de uma série numérica ou medição própria. Não há data de observação verificável nas capturas.

As alturas foram aproximadas visualmente relativamente à área do gráfico. Os índices abaixo são uma transcrição editorial, não percentagens fornecidas pelo Google. As escalas das capturas podem diferir, pelo que a comparação exata de ocupação entre dias não é válida.

| Dia | Barras do almoço (12h, 13h, 14h) | Barras do jantar (19h, 20h, 21h) |
| --- | --- | --- |
| Segunda | 70, 68, 42 | 37, 43, 37 |
| Terça | 77, 81, 53 | 42, 47, 35 |
| Quarta | 86, 95, 62 | 48, 59, 48 |
| Quinta | 63, 67, 42 | 39, 48, 42 |
| Sexta | 49, 52, 34 | 35, 42, 35 |
| Sábado | 20, 28, 29 | 30, 38, 34 |

## Interpolação

Os picos de referência comunicados são 12:20–13:45 e 20:00–20:30. O início e fim do modelo respeitam o horário habitual da Sala Grande: 12:00–14:30 e 19:30–21:30. A barra das 19h é usada como aproximação para 19:30, não como indicação de serviço aberto às 19h.

Pontos intermediários são interpolados; a abertura do almoço e o final dos serviços recebem transições estimadas. Sábado conserva a subida do almoço observada na referência, sem forçar um perfil idêntico ao dos dias úteis. Domingo não tem série porque não faz parte do funcionamento habitual.

A média apresentada é a área trapezoidal entre pontos dividida pela duração do serviço. Trata-se da média do **modelo ilustrativo**, não da média de clientes ou de ocupação real. As tabelas acessíveis exibem os mesmos valores dos gráficos.

## Limites e atualização

Não utilizar o modelo para prometer tempo de espera, disponibilidade, segurança ou lugares livres. Feriados e alterações de serviço podem invalidar o padrão. Ao atualizar `src/crowd.mjs`, registar a origem, a data conhecida, as aproximações e o que foi realmente medido. Não converter estimativas em dados “ao vivo” apenas pela apresentação visual.

Os documentos `ARCHIVE-RELEASE.md`, `RESEARCH.md` e `VALIDATION.md` registram etapas históricas; a descrição do modelo atual é este documento.
