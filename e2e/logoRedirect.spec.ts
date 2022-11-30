import { test, expect } from '@playwright/test'
import { IssueData, RoadmapApiResponseSuccess } from '../lib/types';
import * as fixture from '../tests/fixtures/issueData/ipfs-roadmap-102.json'

test('clicking the logo should navigate users to the homepage', async ({ page, context }) => {

  await context.route('**/api/roadmap**', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      errors: [],
      data: fixture as unknown as IssueData,
      pendingChildren: [],
    } as RoadmapApiResponseSuccess),
  }));

  await page.goto('http://localhost:3000/roadmap/github.com/ipfs/roadmap/issues/102');

  await page.locator('.chakra-spinner').waitFor({ state: 'hidden', timeout: 1000 });

  await page.click('.js-headerLogo');

  // nextjs-portal appears with error message on error in dev mode
  expect(await page.locator('nextjs-portal')).toHaveCount(0);
  await expect(page).toHaveURL('/');
})
