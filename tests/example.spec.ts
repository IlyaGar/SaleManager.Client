import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => { 
await page.goto('https://playwright.dev/'); 

// Expect a title "to contain" a substring. 
await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => { 
await page.goto('https://playwright.dev/'); 

// Click the get started link. 
await page.getByRole('link', { name: 'Get started' }).click(); 

// Expects page to have a heading with the name of Installation. 
await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('the chart is displayed after loading', async ({ page }) => { 
await page.goto('http://localhost:4200'); 
await page.waitForSelector('canvas', { timeout: 10000 }); 
await expect(page.locator('canvas')).toBeVisible();
});

test('the graph is updated when the filter is changed', async ({ page }) => {
await page.goto('http://localhost:4200');

// Wait for the graph to load - the indicator of the full page load
await page.waitForSelector('canvas', { timeout: 15000 });

// Get the input by label
const startDateInput = page.getByLabel('Start Date');
const endDateInput = page.getByLabel('End Date');
const timePeriodSelect = page.getByLabel('Time Period');

await expect(startDateInput).toBeVisible();
await expect(endDateInput).toBeVisible();
await expect(timePeriodSelect).toBeVisible();

// Enter dates
await startDateInput.fill('2025-01-01');
await endDateInput.fill('2025-05-31');

// Select the interval
await timePeriodSelect.click();
await page.locator('mat-option >> text=Month').click();

// Check that the chart is visible after updating
await expect(page.locator('canvas')).toBeVisible();
});

test('reset zoom button works', async ({ page }) => { 
await page.goto('http://localhost:4200'); 

const resetZoomBtn = page.locator('button:has-text("Reset Zoom")'); 
await expect(resetZoomBtn).toBeVisible(); 
await resetZoomBtn.click(); 

// Check: the chart remains visible 
await expect(page.locator('canvas')).toBeVisible();
});

test('adding sales via dialogue', async ({ page }) => {
await page.goto('http://localhost:4200');

// Opening the dialog
const addSaleButton = page.getByRole('button', { name: 'Add Sale' });
await expect(addSaleButton).toBeVisible();
await addSaleButton.click();

// Checking that the dialog has opened
const dialogTitle = page.getByRole('heading', { name: 'Add Sale' });
await expect(dialogTitle).toBeVisible();

// Filling in the date and price
const dateInput = page.locator('input[matinput]').first();
const priceInput = page.locator('input[type="number"]');

await dateInput.fill('2025-06-01');
await priceInput.fill('777');

// Click the "Add" button
const confirmAddButton = page.getByRole('button', { name: 'Add', exact: true });
await confirmAddButton.click();

// Wait for the dialog to close
await expect(dialogTitle).toHaveCount(0);

// Check that the chart is still visible (or you can add data validation)
await expect(page.locator('canvas')).toBeVisible();
});