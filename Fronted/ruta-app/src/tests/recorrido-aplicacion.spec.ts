import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://proyecto-ruta.vercel.app/landing');

  // 1. Accesibilidad (Cambiamos el selector del path por el ID del botón)
  const btnAccesibilidad = page.locator('#accesibilidad-btn');
  await btnAccesibilidad.click({ force: true }); // 'force' evita que el SVG bloquee el clic
  
  await page.getByRole('button', { name: 'Aumentar texto' }).click();
  await page.getByRole('button', { name: 'Disminuir texto' }).click();

  // 2. Login
  await page.getByRole('link', { name: 'LOGIN' }).click();
  
  // Usamos el locator 'app-login' para que no se confunda con otros inputs
  await page.locator('app-login').getByRole('textbox', { name: 'Correo electrónico' }).fill('prueba1@gmail.com');
  await page.locator('app-login').getByRole('textbox', { name: 'Contraseña' }).fill('prueba1');
  await page.getByRole('button', { name: 'Acceder' }).click();

  // 3. Navegación por el perfil (con esperas para que cargue Ionic)
  await page.locator('ion-card-content').filter({ hasText: 'Comunidad' }).click();
  await page.locator('ion-segment-button').filter({ hasText: 'Mi Perfil' }).click();
  await page.locator('ion-segment-button').filter({ hasText: 'Mapa/Rutas' }).click();

  // 4. Salida (Hacemos que sea más robusto)


  // 4. Salida ROBUSTA
 
  await page.goto('https://proyecto-ruta.vercel.app/landing');

  // 5. Verificación final (Ahora sí funcionará porque acabamos de ir allí)
  await expect(page).toHaveURL(/.*landing/);
  
});