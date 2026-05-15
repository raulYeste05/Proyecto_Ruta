import { test, expect } from '@playwright/test';

test('Ciclo completo usuario', async ({ page }) => {

  await page.goto('https://proyecto-ruta.vercel.app/landing');

  // =====================================================
  // LOGIN ADMIN
  // =====================================================

  await page.getByRole('link', { name: 'LOGIN' }).click();

  await page.getByPlaceholder('Correo electrónico')
    .fill('ruta123@gmail.com');

  await page.getByPlaceholder('Contraseña')
    .fill('ruta123');

  await page.getByRole('button', {
    name: 'Acceder'
  }).click();

  // =====================================================
  // ELIMINAR USUARIO
  // =====================================================

  await expect(
    page.getByText('prueba1@gmail.com')
  ).toBeVisible({ timeout: 10000 });

  const filaUsuario = page.locator('.tabla-fila').filter({
    hasText: 'prueba1@gmail.com'
  });

  await expect(filaUsuario).toHaveCount(1);

  await filaUsuario.locator('ion-button').click({
    force: true
  });

  await page.waitForTimeout(2000);

  await expect(
    page.getByText('prueba1@gmail.com')
  ).not.toBeVisible();

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================

  await page.getByText('CERRAR SESIÓN').click({
    force: true
  });

 // =====================================================
// IR A REGISTRO
// =====================================================

    // Ya estás en login
    await expect(page).toHaveURL(/login/);

    // Ir a registro
    await page.getByRole('link', {
    name: 'Regístrate'
    }).click();

  // =====================================================
  // RELLENAR FORMULARIO
  // =====================================================

  const registro = page.locator('app-registro');

    await registro.getByPlaceholder('Correo electrónico')
    .fill('prueba1@gmail.com');

    await registro.getByPlaceholder('Contraseña')
    .fill('prueba1');

    await registro.getByPlaceholder('DNI')
    .fill('26516439S');

    await registro.getByPlaceholder('Nombre')
    .fill('Usuario');

    await registro.getByPlaceholder('Primer apellido')
    .fill('Prueba');

    await registro.getByPlaceholder('Segundo apellido')
    .fill('Test');

    await registro.getByPlaceholder('Teléfono')
    .fill('123456789');

  // =====================================================
  // SELECTS
  // =====================================================

  const selects = registro.locator('select');

  // Provincia
  await selects.nth(0).selectOption('05');

  // Esperar municipios
  await page.waitForTimeout(2000);

  // Localidad
  await selects.nth(1).selectOption({
    label: 'AVELLANEDA'
  });

  // =====================================================
  // REGISTRAR
  // =====================================================

  const botonRegistro = registro.getByRole('button', {
  name: 'Empezar ahora'
});

// Esperar validaciones Angular
await expect(botonRegistro).toBeEnabled({
  timeout: 10000
});

// Manejar alerta JS
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept();
});

await botonRegistro.click();

// Ir manualmente a login
await page.getByRole('link', {
  name: 'Inicia sesión'
}).click();

// Verificar login
await expect(page).toHaveURL(/login/);

  // =====================================================
  // VERIFICACIÓN FINAL
  // =====================================================

  await expect(page).toHaveURL(/login|landing/);

});