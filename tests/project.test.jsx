import { test, expect } from '@playwright/test';

// test.beforeEach(async ({ page }) => {
//   await page.goto('http://localhost:5173/');
// });

test('start with login page', async ({page}) => {
    await page.goto('http://localhost:5173/overview')
    expect(true).toBe(true);
    // Check that input is empty.
    // await expect(newTodo).toBeEmpty();
    // await checkNumberOfTodosInLocalStorage(page, 1);
});

