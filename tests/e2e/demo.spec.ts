import { test, expect, type Page } from '@playwright/test';
async function finish(page: Page) {
  await page.goto('/experiencia');
  await page.getByRole('button', { name: 'Reservar experiência', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Experiência reservada.' })).toBeVisible();
  await page.getByRole('button', { name: 'Simular retirada e iniciar' }).click();
  await expect(
    page.getByRole('heading', { name: 'Você está vivendo sua experiência elétrica.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Finalizar experiência e simular devolução' }).click();
  await expect(page.getByRole('heading', { name: 'Você viveu um elétrico.' })).toBeVisible();
}
test('jornada paga completa, benefício, refresh e analytics', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Seu primeiro elétrico começa pela experiência.' }),
  ).toBeVisible();
  await expect(page).toHaveTitle('evLiza | Localiza Assinatura');
  await expect(page.locator('main')).toContainText('CONCEITO PROPOSTO · evLiza');
  await expect(page.locator('body')).not.toContainText('EV sem Medo');
  await page.screenshot({
    path: 'artifacts/screenshots/home-desktop.png',
    fullPage: true,
    animations: 'disabled',
  });
  await finish(page);
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('button', { name: 'Quero continuar no elétrico', exact: false }).click();
  await page.getByRole('button', { name: 'Rever minha impressão' }).click();
  await page.getByLabel('Quer contar mais alguma coisa?').fill('Gostei da experiência.');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('button', { name: 'Conhecer meu benefício' }).click();
  await expect(
    page.getByRole('heading', { name: 'Gostou de viver um elétrico? Vamos para o próximo passo.' }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText('R$ 315,00', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Usar meu benefício' }).click();
  await page.getByRole('button', { name: 'Quero esta proposta' }).first().click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Simular assinatura aprovada' }).click();
  await expect(
    page.getByRole('heading', { name: 'Agora começa sua próxima etapa.' }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText('Benefício comercial simulado: R$ 315,00')).toBeVisible();
  await page.goto('/demo/analytics');
  await expect(
    page.getByText('DADOS 100% SIMULADOS — DEMONSTRAÇÃO DE COMO O PROGRAMA SERIA MEDIDO.'),
  ).toBeVisible();
  await expect(
    page.getByRole('definition').filter({ hasText: 'Gostei da experiência.' }),
  ).toBeVisible();
  const before = await page.getByTestId('economics-per-person').textContent();
  await page.getByLabel('Taxa de conversão', { exact: true }).fill('0');
  await expect(page.getByTestId('economics-per-person')).not.toHaveText(before!);
  await expect(page.getByTestId('break-even')).toContainText('9.59%');
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.screenshot({
    path: 'artifacts/screenshots/analytics-desktop.png',
    fullPage: true,
    animations: 'disabled',
  });
  expect(errors).toEqual([]);
});
test('indisponibilidade bloqueia reserva; não conversão sem benefício; reset', async ({ page }) => {
  await page.goto('/experiencia');
  await page.getByLabel('Cidade de retirada').selectOption('Curitiba');
  await expect(
    page.getByRole('button', { name: 'Reservar experiência', exact: true }),
  ).toBeDisabled();
  await finish(page);
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('button', { name: 'Não funcionou para minha rotina', exact: false }).click();
  await page.getByRole('button', { name: 'Recarga', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('button', { name: 'Encerrar experiência', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Obrigado por experimentar.' })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Nenhum benefício aplicado', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Conhecer outras opções' }).click();
  await expect(
    page.getByRole('heading', { name: 'Encontre o que combina com você.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Encerrar', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Sua experiência está encerrada');
  await page.goto('/demo/reset');
  await page.getByRole('button', { name: 'Reiniciar demonstração', exact: true }).last().click();
  await expect(
    page.getByRole('heading', { name: 'Seu primeiro elétrico começa pela experiência.' }),
  ).toBeVisible();
  await page.goto('/experiencia');
  await expect(
    page.getByRole('button', { name: 'Reservar experiência', exact: true }),
  ).toBeEnabled();
});
test('jornada linear pelos botões das telas, retomada e recursos locais', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  const errors: string[] = [];
  const brokenRoutes: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (response) => {
    if (response.status() >= 400 && response.request().resourceType() === 'document')
      brokenRoutes.push(response.url());
  });
  await page.route('**/*', (route) =>
    new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort(),
  );
  await page.goto('/demo/linkedin');
  await expect(page).toHaveURL(/\/experiencia$/);
  await page.goto('/');
  await page
    .locator('.hero-copy')
    .getByRole('link', { name: 'Quero experimentar', exact: false })
    .click();
  await expect(page).toHaveURL(/\/experiencia$/);
  await page.getByRole('button', { name: 'Reservar experiência', exact: true }).click();
  await expect(page).toHaveURL(/\/experiencia\/reserva$/);
  await page.goto('/experiencia');
  await expect(page).toHaveURL(/\/experiencia\/reserva$/);
  await page.getByRole('button', { name: 'Simular retirada e iniciar' }).click();
  await expect(page).toHaveURL(/\/experiencia\/ativa$/);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Você está vivendo sua experiência elétrica.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Finalizar experiência e simular devolução' }).click();
  await expect(page.getByRole('heading', { name: 'Você viveu um elétrico.' })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('button', { name: 'Quero continuar no elétrico', exact: false }).click();
  await page.getByRole('button', { name: 'Conhecer meu benefício' }).click();
  await expect(
    page.getByRole('heading', { name: 'Gostou de viver um elétrico? Vamos para o próximo passo.' }),
  ).toBeVisible();
  await page.screenshot({
    path: 'artifacts/screenshots/linear-benefit.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.goto('/experiencia');
  await expect(page).toHaveURL(/\/assinatura$/);
  await page.getByRole('button', { name: 'Usar meu benefício' }).click();
  await page.getByRole('button', { name: 'Quero esta proposta' }).first().click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Simular assinatura aprovada' }).click();
  await expect(
    page.getByRole('heading', { name: 'Agora começa sua próxima etapa.' }),
  ).toBeVisible();
  await page.goto('/minha-assinatura');
  await expect(page).toHaveURL(/\/assinatura\/aguardando$/);
  await expect(page.getByText('Benefício comercial simulado: R$ 315,00')).toBeVisible();
  await page.getByRole('button', { name: 'Entendi', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('jornada de demonstração está concluída');
  expect(errors).toEqual([]);
  expect(brokenRoutes).toEqual([]);
});

test('mobile, rotas públicas e ausência de overflow', async ({ page }) => {
  test.setTimeout(90000);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const path of [
      '/',
      '/como-funciona',
      '/experiencia',
      '/programa/regras',
      '/demo/analytics',
      '/demo/linkedin',
      '/demo/reset',
      '/experiencia/reserva',
      '/experiencia/ativa',
      '/experiencia/feedback',
      '/experiencia/concluida',
      '/assinatura/aguardando',
      '/demo/experimento',
      '/demo/customer',
      '/minha-assinatura',
      '/carros',
      '/carros/dolphin',
      '/assinatura/dolphin',
      '/calcular',
      '/comparativo',
      '/assinatura',
    ]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('main h1').first()).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        path,
      ).toBe(true);
    }
  }
  await page.goto('/');
  await page.screenshot({
    path: 'artifacts/screenshots/home-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('button', { name: 'Abrir menu', exact: true }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Experiência', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Reservar experiência', exact: true }),
  ).toBeVisible();
});

test('dúvidas: explicação, consultor simulado e escolha explícita de seguir', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await finish(page);
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('button', { name: 'Gostei, mas ainda tenho dúvidas', exact: false }).click();
  await expect(page.getByRole('heading', { name: 'É normal ainda ter dúvidas.' })).toBeVisible();
  await page.getByText('Recarga', { exact: true }).click();
  await expect(page.getByText('Pense nos pontos perto de casa', { exact: false })).toBeVisible();
  await page.screenshot({
    path: 'artifacts/screenshots/doubts-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('button', { name: 'Falar com consultor' }).click();
  await expect(page.getByRole('status')).toContainText('nenhum atendimento é iniciado');
  await page.getByRole('button', { name: 'Continuar para assinatura' }).click();
  await page.getByRole('button', { name: 'Recarga', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('button', { name: 'Conhecer meu benefício' }).click();
  await page.getByRole('button', { name: 'Usar meu benefício' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({
    path: 'artifacts/screenshots/subscription-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });
});

test('dúvidas encerradas preservam decisão e não solicitam proposta', async ({ page }) => {
  await finish(page);
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('button', { name: 'Gostei, mas ainda tenho dúvidas', exact: false }).click();
  await page.getByRole('button', { name: 'Encerrar experiência', exact: true }).click();
  await page.getByRole('button', { name: 'Autonomia', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('button', { name: 'Encerrar experiência', exact: true }).click();
  await expect(page).toHaveURL(/\/experiencia\/concluida$/);
  await expect(page.getByRole('heading', { name: 'Obrigado por experimentar.' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Obrigado por experimentar.' })).toBeVisible();
  await page.goto('/demo/analytics');
  await expect(page.getByRole('definition').filter({ hasText: 'UNSURE' })).toBeVisible();
});

test('acesso direto a etapas fora de ordem retoma a jornada sem 404', async ({ page }) => {
  for (const path of [
    '/experiencia/ativa',
    '/experiencia/reserva',
    '/experiencia/feedback',
    '/assinatura',
    '/assinatura/aguardando',
    '/experiencia/concluida',
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page).toHaveURL(/\/experiencia$/);
    await expect(
      page.getByRole('button', { name: 'Reservar experiência', exact: true }),
    ).toBeEnabled();
  }
});
