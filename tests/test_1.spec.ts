import { expect, Page } from "@playwright/test";
import test from "../lambdatest-setup";

/**
 * Click a docs sidebar link by href. Falls back to direct navigation if the
 * link is collapsed / not visible in the current sidebar section.
 */
async function openDocsPage(page: Page, href: string, expectedPath: string) {
  const sidebarLink = page.locator(`a.menu__link[href="${href}"]`).first();
  if (await sidebarLink.isVisible().catch(() => false)) {
    await sidebarLink.click();
  } else {
    await page.goto(`https://playwright.dev${href}`);
  }
  await expect(page).toHaveURL(new RegExp(expectedPath.replace(/\//g, "\\/")));
}

async function runDocsWalkthrough(page: Page) {
  await page.goto("https://playwright.dev/");
  await expect(page).toHaveTitle(/Playwright/);

  // Prefer the navbar Docs link; fall back to Get started / direct navigation.
  const docsNav = page.locator('a.navbar__link[href="/docs/intro"]');
  if (await docsNav.isVisible().catch(() => false)) {
    await docsNav.click();
  } else {
    const getStarted = page.getByRole("link", { name: "Get started" }).first();
    if (await getStarted.isVisible().catch(() => false)) {
      await getStarted.click();
    } else {
      await page.goto("https://playwright.dev/docs/intro");
    }
  }
  await expect(page).toHaveURL(/.*docs\/intro/);

  // await page.getByRole("link", { name: "Writing Tests" }).click();
  // await expect(page).toHaveURL("https://playwright.dev/docs/writing-tests");

  await openDocsPage(page, "/docs/running-tests", "/docs/running-tests");
  await openDocsPage(page, "/docs/codegen-intro", "/docs/codegen-intro");
  await openDocsPage(page, "/docs/trace-viewer-intro", "/docs/trace-viewer-intro");
  await openDocsPage(page, "/docs/ci-intro", "/docs/ci-intro");
  await openDocsPage(page, "/docs/test-annotations", "/docs/test-annotations");
  // docs moved: /docs/test-api-testing -> /docs/api-testing
  await openDocsPage(page, "/docs/api-testing", "/docs/api-testing");
  await openDocsPage(page, "/docs/test-assertions", "/docs/test-assertions");
  await openDocsPage(page, "/docs/test-cli", "/docs/test-cli");
  await openDocsPage(page, "/docs/test-configuration", "/docs/test-configuration");
  await openDocsPage(page, "/docs/test-parallel", "/docs/test-parallel");
  await openDocsPage(page, "/docs/test-parameterize", "/docs/test-parameterize");
  await openDocsPage(page, "/docs/test-reporters", "/docs/test-reporters");
  await openDocsPage(page, "/docs/test-retries", "/docs/test-retries");
  await openDocsPage(page, "/docs/test-timeouts", "/docs/test-timeouts");
  await openDocsPage(page, "/docs/test-typescript", "/docs/test-typescript");
  await openDocsPage(page, "/docs/test-snapshots", "/docs/test-snapshots");
  // docs moved: /docs/test-advanced -> /docs/best-practices
  await openDocsPage(page, "/docs/best-practices", "/docs/best-practices");
  await openDocsPage(page, "/docs/test-fixtures", "/docs/test-fixtures");
  await openDocsPage(page, "/docs/test-components", "/docs/test-components");
  await openDocsPage(page, "/docs/library", "/docs/library");
  await openDocsPage(page, "/docs/accessibility-testing", "/docs/accessibility-testing");
  await openDocsPage(page, "/docs/input", "/docs/input");
  await openDocsPage(page, "/docs/auth", "/docs/auth");
  await openDocsPage(page, "/docs/actionability", "/docs/actionability");
  await openDocsPage(page, "/docs/browsers", "/docs/browsers");
  await openDocsPage(page, "/docs/chrome-extensions", "/docs/chrome-extensions");
  // docs moved: /docs/cli -> /docs/getting-started-cli
  await openDocsPage(page, "/docs/getting-started-cli", "/docs/getting-started-cli");
  await openDocsPage(page, "/docs/debug", "/docs/debug");
  await openDocsPage(page, "/docs/dialogs", "/docs/dialogs");
  await openDocsPage(page, "/docs/downloads", "/docs/downloads");
  await openDocsPage(page, "/docs/emulation", "/docs/emulation");
  await openDocsPage(page, "/docs/evaluating", "/docs/evaluating");
}

test("test", async ({ page }) => {
  await runDocsWalkthrough(page);
});
