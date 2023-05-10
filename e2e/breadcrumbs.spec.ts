import { test, expect } from '@playwright/test'
import { convertCrumbDataArraysToCrumbDataString, getCrumbDataArrayFromIssueData } from '../lib/breadcrumbs';
import { IssueData, RoadmapApiResponseSuccess } from '../lib/types';
import * as fixture102 from '../tests/fixtures/issueData/ipfs-roadmap-102.json'
import * as fixture98 from '../tests/fixtures/issueData/ipfs-roadmap-98.json'

test('clicking a milestone item should show more breadcrumbs', async ({ page, context }) => {

  const getSpinnerAndBreadcrumbPromise = (spinnerCount: number, breadcrumbCount: number) => Promise.all([
    page.waitForFunction((count: number) => document.querySelectorAll('.chakra-spinner').length === count, spinnerCount, { timeout: 10000 },),
    page.waitForFunction((count: number) => document.querySelectorAll('.js-breadcrumbItem').length === count, breadcrumbCount, { timeout: 10000 }),
  ]);

  await context.route((url) => url.pathname.includes('api/roadmap'), (route) => {
    const requestedUrl = route.request().url()
    let mockedFixture: IssueData;
    if (requestedUrl.includes('owner=ipfs&repo=roadmap&issue_number=102')) {
      mockedFixture = fixture102 as unknown as IssueData;
    } else if (requestedUrl.includes('owner=ipfs&repo=roadmap&issue_number=98')) {
      mockedFixture = fixture98 as unknown as IssueData;
    } else {
      console.error('no mocked fixture found for requested url: ', requestedUrl);
      return route.abort('failed');
    }
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          errors: [],
          data: mockedFixture,
          pendingChildren: [],
        } as RoadmapApiResponseSuccess),
      });
    return;
  });

  await Promise.all([
    page.waitForResponse((response) => response.url().includes('ipfs/roadmap/issues/102')),
    page.goto('http://localhost:3000/roadmap/github.com/ipfs/roadmap/issues/102'),
  ]);

  await getSpinnerAndBreadcrumbPromise(0, 0);
  await page.waitForFunction(() => document.querySelectorAll('.js-milestoneCard').length > 1, { timeout: 10000 });
  expect(await page.locator('.js-milestoneCard-ipfs-roadmap-98')).toHaveCount(1, { timeout: 10000 });

  await Promise.all([
    page.waitForResponse((response) => response.url().includes('ipfs/roadmap/issues/98')),
    page.click('.js-milestoneCard-ipfs-roadmap-98'),
  ]);

  // nextjs-portal appears with error message on error in dev mode
  expect(await page.locator('nextjs-portal')).toHaveCount(0);

  const currentUrlCrumbs = getCrumbDataArrayFromIssueData({
    html_url: fixture102.html_url,
    title: fixture102.title,
  });
  const expectedCrumbs = convertCrumbDataArraysToCrumbDataString([currentUrlCrumbs]);
  const newUrl = new URL(`/roadmap/github.com/ipfs/roadmap/issues/98`, page.url());
  newUrl.searchParams.set('crumbs', expectedCrumbs);
  newUrl.hash = 'view=simple';
  await expect(page).toHaveURL(newUrl.href);

  await getSpinnerAndBreadcrumbPromise(0, 2);

  // click the first breadcrumb item and expect it to take us back to the parent.
  await Promise.all([
    page.waitForResponse((response) => response.url().includes('ipfs/roadmap/issues/102')),
    page.locator('.js-breadcrumbItem-link').nth(0).click(),
  ]);
})
