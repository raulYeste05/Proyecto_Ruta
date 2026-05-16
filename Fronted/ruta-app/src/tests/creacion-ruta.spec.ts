import { test, expect } from '@playwright/test';

// Más tiempo porque Leaflet + Angular + dialogs tardan
test.setTimeout(60000);

test('Crear ruta completa', async ({ browser }) => {

  // =====================================================
  // CONTEXTO CON GEOLOCALIZACIÓN
  // =====================================================

  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 37.7793,
      longitude: -3.7849
    }
  });

  const page = await context.newPage();

  // =====================================================
  // ENTRAR A LA WEB
  // =====================================================

  await page.goto('https://proyecto-ruta.vercel.app/landing');

  // =====================================================
  // LOGIN
  // =====================================================

  await page.getByRole('link', {
    name: 'LOGIN'
  }).click();

  await page.locator('app-login')
    .getByPlaceholder('Correo electrónico')
    .fill('prueba1@gmail.com');

  await page.locator('app-login')
    .getByPlaceholder('Contraseña')
    .fill('prueba1');

  await page.getByRole('button', {
    name: 'Acceder'
  }).click();

  // =====================================================
  // IR A MAPA/RUTAS
  // =====================================================

  await page.locator('ion-segment-button')
    .filter({ hasText: 'MAPA/RUTAS' })
    .click();

  // =====================================================
  // UBICACIÓN ACTUAL
  // =====================================================

  await page.getByRole('button', {
    name: 'MI UBICACIÓN ACTUAL'
  }).click();

  // Esperar geolocalización y mapa
  await page.waitForTimeout(5000);

  // =====================================================
  // CREAR RUTA EN MAPA
  // =====================================================

  const mapa = page.locator('#mapId');

  // Punto origen
  await mapa.click({
    position: {
      x: 300,
      y: 200
    }
  });

  await page.waitForTimeout(2000);

  // Punto destino
  await mapa.click({
    position: {
      x: 700,
      y: 300
    }
  });

  // Esperar generación de ruta
  await page.waitForTimeout(5000);


  // =====================================================
  // BOTÓN FINALIZAR
  // =====================================================

  const botonFinalizar = page.getByRole('button', {
    name: 'FINALIZAR Y VER RESUMEN'
  });

  await botonFinalizar.scrollIntoViewIfNeeded();

  await expect(botonFinalizar).toBeVisible({
    timeout: 10000
  });

 // =====================================================
// MANEJAR DIALOGS
// =====================================================

let contadorDialogs = 0;

page.on('dialog', async dialog => {

  contadorDialogs++;

  console.log('DIALOG:', dialog.message());

  if (contadorDialogs === 1) {
    await dialog.accept();
  }

  else if (contadorDialogs === 2) {
    await dialog.accept('RutaPrueba');
  }

  else if (contadorDialogs === 3) {
    await dialog.accept();
  }

});

  // =====================================================
  // FINALIZAR RUTA
  // =====================================================

  await botonFinalizar.click({
    force: true
  });

  // Esperar guardado
  await page.waitForTimeout(5000);

  // =====================================================
  // IR A PERFIL
  // =====================================================

  await page.locator('ion-segment-button')
    .filter({ hasText: 'MI PERFIL' })
    .click();

  // =====================================================
  // VER HISTORIAL
  // =====================================================

  await page.getByRole('button', {
    name: 'Ver Historial de Rutas'
  }).click();

  // =====================================================
  // VERIFICAR RUTA CREADA
  // =====================================================

  await expect(
    page.getByText('RutaPrueba')
  ).toBeVisible({
    timeout: 10000
  });

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================

  await page.getByText('CERRAR SESIÓN').click();

});