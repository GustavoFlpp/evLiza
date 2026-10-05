# evLiza

> Este é um protótipo conceitual independente desenvolvido a partir de um desafio de inovação. Não representa um produto, oferta, condição comercial ou política oficial da Localiza&Co.

## Problema

Interesse em elétricos não elimina dúvidas sobre autonomia, recarga, viagens, hábitos e custo percebido. Um compromisso de longo prazo pode vir cedo demais para quem ainda não viveu essa rotina.

## Contexto

Conceito desenvolvido no hackathon Ruptura 2026. A experiência ocorre **antes** da assinatura e utiliza uma locação paga. O veículo definitivo segue outro processo, com aprovação e condições normais.

## Insight

Conteúdo ajuda, mas uma experiência real permite avaliar a mobilidade elétrica na própria rotina. O aluguel pode gerar receita e ser um canal potencial de aquisição para assinatura.

## Nova solução

**Seu primeiro elétrico começa pela experiência.** Alugue para conhecer. Assine quando tiver certeza. Todos os preços, quantidades, referências e condições exibidos são dados simulados ou parâmetros de piloto, sem vínculo com ofertas oficiais.

## Como funciona

1. Consulta por cidade, agência e grupo elétrico disponível.
2. Cotação e reserva simuladas de uma locação paga.
3. Retirada, experiência e devolução representadas localmente.
4. Conclusão visual → sentimento → motivo quando necessário → resumo da experiência.
5. Se quiser continuar: benefício potencial em destaque → referências de assinatura → proposta.
6. Aprovação simulada aplica benefício comercial uma única vez; o definitivo segue o processo normal.

Sem conversão, a locação termina normalmente, sem crédito ou devolução automática do valor. A resposta “talvez” abre explicações curtas. Só uma escolha explícita de continuar registra intenção de assinatura; encerrar preserva dúvidas sem proposta ou benefício.

## Por que Localiza Aluguel

A experimentação aproveita conceitualmente capacidade disponível na operação participante, por grupo e categoria. O mock bloqueia reserva em grupos indisponíveis. Não pressupõe uma frota dedicada nem garante modelo específico.

## Por que não utilizar Seminovos como frota de experimentação

Seminovos aparece após a desmobilização. Ciclo proposto: aquisição → Localiza Aluguel → locações → evLiza quando elegível → outras locações → desmobilização → Localiza Seminovos. Não há retirada de ativos destinados à venda para experimentação.

## Modelo econômico

A locação é paga. Caso ocorra uma assinatura EV elegível, parte da base pode originar benefício comercial condicionado à campanha. Não há pagamento ou contrato real no protótipo.

## Benefício de conversão

Regras centralizadas em `src/config/evProgramRules.ts`. Parâmetros ilustrativos atuais: 2–7 dias, janela de 30 dias após devolução, taxa de 50%, teto de R$ 500 e um benefício por cliente. Aprovação obrigatória e benefícios não cumulativos.

- Base elegível = soma apenas de itens `RENTAL_BASE`.
- Calculado = base × taxa; final = mínimo entre calculado e teto.
- Sem escolha positiva, fora da janela, modelo inelegível, uso prévio ou campanha incompatível: benefício final zero.
- Proteções, multas, danos, energia/combustível adicional, pedágio, estacionamento, hora adicional, taxas, serviços e demais extras são excluídos por padrão.
- Exemplo fictício: base de R$ 630 + extras de R$ 120 = locação de R$ 750; benefício potencial de R$ 315. O benefício não é dinheiro sacável.
- A solicitação da proposta reserva a intenção; a aplicação só ocorre após aprovação simulada. A janela inclui seu instante final e é reavaliada na aprovação.

## Unit economics

**DADOS SIMULADOS PARA DEMONSTRAÇÃO DO MODELO.**

Valor por participante = margem simulada da experiência + (probabilidade de conversão × contribuição esperada da assinatura) − benefício esperado − custo operacional − custo de oportunidade − custo incremental de uso do ativo.

Benefício esperado = probabilidade de conversão × benefício por convertido. Essa ponderação evita cobrar o benefício dos participantes que não convertem. A fórmula solicitada usa o benefício esperado da coorte, em vez de misturar custo por convertido com margem por participante.

Controles: participantes, taxa de conversão, benefício médio, margem, contribuição, operação, oportunidade, uso do ativo e controle. Mostra valor individual, total, diferença contra controle e break-even. Para contribuição líquida positiva:

`taxa mínima = (valor do controle − margem + custos) / (contribuição − benefício por convertido)`.

O break-even representa igualdade; superar o controle exige taxa maior. Cenários inviáveis em 0–100% são indicados. Resultado positivo simulado não prova lucro. Custos e contribuições precisam compartilhar horizonte e unidade de análise em produção.

## Hipóteses

Há clientes que precisam experimentar antes de assinar; capacidade participante pode existir; receita de aluguel e conversão incremental podem compensar custos. **HIPÓTESE NÃO VALIDADA.**

## Riscos

Canibalização de locações e assinaturas existentes, capacidade insuficiente, seleção de clientes, expectativa sobre modelo/entrega, custo de uso do ativo, duplicidade de benefícios, recarga e mensuração de conversão. Uma implementação exigiria validação jurídica, fiscal, financeira, comercial e operacional.

## A/B test

Controle: jornada comercial atual. Tratamento: jornada atual + oferta evLiza. Métrica principal: conversão incremental para assinatura EV. Definir amostra, janela, randomização, elegibilidade e análise por intenção de tratamento antes do piloto. Comparar grupos e intervalos de confiança, com controle de sazonalidade e disponibilidade. Nenhuma melhoria percentual real é afirmada.

## Métricas

Interesse → experiência, conclusão, feedback, experiência → proposta, proposta → assinatura, EV → ICE, receita, benefício médio, custo por assinatura incremental, utilização da frota, satisfação, motivos de não conversão e canibalização. O painel usa uma coorte fictícia fixa, separada do registro local deste navegador.

## Arquitetura

Next.js 16, React 19, TypeScript, CSS com tokens Localiza, Inter local, Lucide, Zod, Vitest e Playwright. Sem backend, API, login ou integrações externas. Serviços de inventário e persistência isolados; motor funcional valida transições e regras; provider fornece estado e tratamento de erros; páginas compõem módulos por responsabilidade.

## Estrutura

- `src/config/evProgramRules.ts`: campanha e limites.
- `src/types/index.ts`: domínio, estados, feedback, proposta e economia.
- `src/services/RentalInventoryService.ts`: disponibilidade mock.
- `src/services/demoStorage.ts`: validação e persistência versionada.
- `src/features/experience/`: reserva, motor, feedback e conversão.
- `src/features/analytics/`: coorte, economia e experimento.
- `src/features/demo/`: reset e roteiro LinkedIn.
- `src/data/`: catálogo, orientações, métricas e premissas simuladas.
- `src/styles/`: tokens, visual existente e novas telas responsivas.
- `tests/`: testes de domínio e navegação.
- `ai/`: contexto atual conciso e instruções de leitura mínima.

## Como executar

Requer Node.js >= 20.19 e npm.

```sh
npm install
npm run dev
```

Abra `http://127.0.0.1:3000`. Para apresentação com build otimizado:

```sh
npm run build
npm run start
```

O servidor local precisa estar rodando. Não precisa de internet após instalar as dependências: fontes, logo, ilustrações e mocks são locais. Não é um PWA com instalação/cache offline.

## Rotas

| Rota                     | Função                                          |
| ------------------------ | ----------------------------------------------- |
| `/`                      | Home                                            |
| `/como-funciona`         | Quatro passos                                   |
| `/experiencia`           | Cidade/agência/grupo, disponibilidade e cotação |
| `/experiencia/reserva`   | Reserva e retirada simuladas                    |
| `/experiencia/ativa`     | Rotina, orientações e devolução                 |
| `/experiencia/feedback`  | Decisão e motivos                               |
| `/experiencia/concluida` | Não conversão/dúvidas                           |
| `/assinatura`            | Referências EV, benefício e proposta            |
| `/assinatura/aguardando` | Próxima etapa sem promessa de entrega           |
| `/programa/regras`       | Regras ilustrativas                             |
| `/demo/analytics`        | Painel e simulador                              |
| `/demo/experimento`      | A/B test conceitual                             |
| `/demo/linkedin`         | Acesso ao mesmo fluxo de experiência            |
| `/demo/reset`            | Limpar estado e voltar à home                   |

Rotas legadas neutras redirecionam para a nova jornada; rotas de troca foram removidas. Acesso direto a uma etapa incompatível mostra o destino correto da jornada.

## Modo demonstração

Dados fictícios, sem identidade real. Reservar não cobra dinheiro. Iniciar/finalizar representa a retirada/devolução. Aprovar representa uma assinatura elegível, sem contratação. Datas usam o relógio local do navegador para a janela de campanha; recomeçar prepara uma experiência atual.

## Jornada única para usar e gravar

Abra `http://127.0.0.1:3000` após `npm run dev` e clique em **Quero experimentar**. Siga os botões das próprias telas:

1. Reservar experiência.
2. Simular retirada e iniciar.
3. Finalizar experiência e simular devolução.
4. Continuar e escolher como você se sente.
5. Conhecer meu benefício.
6. Usar meu benefício.
7. Quero esta proposta.
8. Marcar o aceite e simular assinatura aprovada.
9. Entendi: jornada concluída. O painel interno é opcional.

Não há mais roteiro automático, controle de “Próxima etapa” ou decisões preparadas em paralelo. `/demo/linkedin` e `/demo/customer` redirecionam para a mesma jornada. Se você já começou, a aplicação retoma a etapa correspondente ao estado salvo. **Reiniciar demonstração**, no topo, permite começar de novo.

O estado comercial persiste ao atualizar a página. Antes de registrar o feedback, atualizar reinicia apenas as perguntas; antes de solicitar proposta, atualizar retorna ao benefício. Nenhuma etapa adianta a locação ou aplica o benefício automaticamente.

### Desenvolvimento local

Desenvolvimento usa `.next-dev`; produção usa `.next`. Isso mantém os manifests e caches dos dois modos separados. `npm run dev` também prepara permissões da pasta de desenvolvimento no Windows/OneDrive. Após atualizar estes arquivos, encerre o servidor antigo com **Ctrl+C** e execute **npm run dev** novamente. Não é necessário apagar caches ou executar build para usar o protótipo.

```sh
npm run test:e2e:dev
```

Esse comando valida o fluxo contra `npm run dev`, na porta 3000, aproveitando o servidor local já aberto ou iniciando um quando necessário.

## Reset

`/demo/reset` e o controle global removem apenas as chaves do programa. Não limpam outras aplicações ou preferências. A coorte fixa do analytics continua sendo um mock de referência.

## Persistência

`localiza.evliza.demo.v2` contém reserva, experiência, feedback, proposta, benefício e etapa da demo. Zod verifica versão, formato e coerência entre estados; dados antigos ou inválidos voltam ao início. Storage bloqueado mantém a jornada em memória com aviso, sem quebrar a interface. Dados locais podem ser adulterados; não são uma trilha auditável nem registro comercial.

## Testes

```sh
npm run lint
npm run lint:context
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Playwright inicia o build de produção na porta 3100 e utiliza Chrome instalado, em modo headless. A porta deve estar livre. Screenshots em `artifacts/screenshots/`; traces de falha em `artifacts/browser-results/`. Testes verificam disponibilidade, reserva, base, despesas excluídas, teto, janela, feedback, aprovação, uso prévio, não conversão, persistência/reset, analytics e break-even, além da navegação desktop/mobile e do roteiro sem recursos externos.

O contexto usa limites de 300 linhas no brain, 200 nas instruções, 180 no template e 350 linhas úteis nos fontes JS/TS. `lint` inclui o checker; ESLint preserva as regras existentes. Leia `ai/PROJECT_BRAIN.md` e arquivos diretamente relacionados; não releia histórico ou diretórios gerados.

## Limitações

Inventário estático sem concorrência, calendário real ou bloqueio de estoque entre clientes. Uma única jornada por navegador, sem autenticação, cobrança, CRM, contrato ou aprovação real. Feedback e benefícios só existem localmente. Quilometragem simulada sem telemetria. Modelo/grupo não equivale a veículo definitivo. A resposta “talvez” não oferece atendimento real. A economia é um experimento de sensibilidade, sem margens oficiais ou significância estatística.

## Roadmap

Documentado e não implementado: integração real com Localiza Aluguel e disponibilidade; contratos, pagamentos, scoring, CRM, assinatura digital, telemetria, mapas, carregadores, wallbox, IA generativa, pricing, sistemas internos, fiscal e crédito financeiro real. Produção exigiria backend autorizado, inventário transacional, regras aprovadas, antifraude e análise do experimento.

## Roteiro de vídeo · 60–90 segundos

Use a home em 1920×1080, zoom 100%. Reinicie a demonstração pelo topo antes de gravar. Avance pelos botões reais das telas, com uma pequena pausa entre cada ação.

| Tempo  | Tela / ação                                 | Fala sugerida                                                                                                       |
| ------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 0–10s  | Home → Quero experimentar                   | “Seu primeiro elétrico começa pela experiência.”                                                                    |
| 10–25s | Reserva → Reservar experiência              | “Uma locação paga, por grupo disponível, antes do compromisso longo.”                                               |
| 25–35s | Iniciar → Finalizar e devolver              | “Você vive o elétrico no seu dia a dia.”                                                                            |
| 35–50s | Conclusão → Sentimento → Resumo             | “Depois da devolução, a escolha é sua. Agora você decide com experiência.”                                          |
| 50–65s | Conhecer meu benefício → Usar meu benefício | “Sua experiência pode acompanhar o próximo passo. R$ 315 neste exemplo simulado, sujeitos às regras e à aprovação.” |
| 65–80s | Quero esta proposta → Aceite → Aprovar      | “Uma assinatura com processo próprio, sem promessa de entrega imediata.”                                            |
| 80–90s | Conclusão → Painel interno opcional         | “A hipótese precisa ser testada. Todos os dados do painel são simulados.”                                           |

Dúvidas e encerramento são alternativas reais no feedback. Para mostrar esses caminhos, grave uma tomada separada e reinicie a jornada antes da próxima.
