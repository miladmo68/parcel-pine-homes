import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";

const baseURL = "http://127.0.0.1:4173/parcel-pine-homes/";
const server = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", "4173"], { stdio: "inherit", shell: true });
const expect = (condition, message) => { if (!condition) throw new Error(message); };

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { const response = await fetch(baseURL); if (response.ok) return; } catch { /* cloud preview is still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Production preview did not become ready");
}

async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(!overflow, `${label} horizontal overflow detected`);
}

async function waitForImages(page) {
  await page.evaluate(async () => Promise.all([...document.images].map((image) => image.complete ? undefined : new Promise((resolve) => { image.addEventListener("load", resolve, { once: true }); image.addEventListener("error", resolve, { once: true }); }))));
}

async function desktopJourney(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  expect(await page.locator(".property-card").count() === 6, "Expected six curated homes");

  await page.getByRole("button", { name: "List view" }).click();
  expect(await page.locator(".view-list").count() === 1, "List view did not activate");
  await page.getByRole("button", { name: "Map view" }).click();
  expect(await page.locator(".view-map").count() === 1, "Map view did not activate");
  await page.getByRole("button", { name: "Return to split view" }).click();

  await page.getByRole("button", { name: /Save Cedar Courtyard/ }).click();
  await page.getByRole("button", { name: /Save Gallery Loft/ }).click();
  const cards = page.locator(".property-card");
  await cards.nth(0).getByRole("button", { name: "Compare", exact: true }).click();
  await cards.nth(1).getByRole("button", { name: "Compare", exact: true }).click();
  await page.getByRole("button", { name: "Compare homes" }).click();
  expect(await page.locator(".comparison-grid article").count() === 2, "Comparison did not include two homes");
  await page.getByRole("button", { name: "Close comparison" }).click();

  await page.getByPlaceholder("Street, neighbourhood, or feature").fill("garden");
  await page.getByRole("button", { name: "Condo", exact: true }).click();
  await page.getByRole("button", { name: /Save search/ }).click();
  await page.getByRole("button", { name: /Clear all/ }).click();
  await page.getByRole("button", { name: /Restore saved/ }).click();
  expect(await page.locator(".property-card").count() === 1, "Saved search did not restore the filtered result");
  await page.getByRole("button", { name: /Share search/ }).click();
  expect(page.url().includes("q=garden"), "Shareable filter state was not reflected in the URL");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export shortlist/ }).click();
  expect((await downloadPromise).suggestedFilename() === "parcel-pine-shortlist.csv", "Shortlist export filename was incorrect");

  await page.getByRole("button", { name: /View Garden Flat/ }).click();
  await page.getByRole("button", { name: "Plan a viewing" }).click();
  await page.getByRole("button", { name: "Save viewing preview" }).click();
  await page.getByText("Enter your name.").waitFor();
  await page.getByLabel("Name").fill("Avery Chen");
  await page.getByLabel("Email").fill("avery@example.com");
  await page.getByText("Tue, Nov 10 · 5:30 PM", { exact: true }).click();
  await page.getByRole("button", { name: "Save viewing preview" }).click();
  await page.getByText("Added to your plan").waitFor();
  await page.getByRole("button", { name: "Continue exploring" }).click();
  await page.getByRole("button", { name: /Plan/ }).click();
  await page.getByText("Garden Flat on Roxton", { exact: true }).waitFor();
  await page.keyboard.press("Escape");

  await page.getByPlaceholder("Street, neighbourhood, or feature").fill("no-such-home-999");
  await page.getByText("No homes match that exact brief.").waitFor();
  await page.getByRole("button", { name: "Reset the search" }).click();
  await page.getByRole("link", { name: "Collections" }).click();
  expect(await page.getByRole("heading", { name: /Search by the life/ }).isVisible(), "Collections anchor did not work");
  await page.getByRole("link", { name: /Parcel and Pine home/ }).click();
  await waitForImages(page);
  await assertNoOverflow(page, "Desktop");
  await page.screenshot({ path: "public/screenshots/desktop.png", fullPage: true });
  await context.close();
}

async function mobileJourney(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Save Cedar Courtyard/ }).click();
  await page.getByRole("button", { name: /Saved/ }).click();
  await page.locator(".saved-drawer").getByText("Cedar Courtyard House", { exact: true }).click();
  await page.getByRole("button", { name: "Close property details" }).click();
  await page.getByRole("button", { name: /Saved/ }).click();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  expect(await page.locator(".saved-drawer").count() === 0, "Escape did not close the mobile saved drawer");
  await page.getByRole("link", { name: "Collections" }).click();
  await waitForImages(page);
  await assertNoOverflow(page, "Mobile");
  await page.screenshot({ path: "public/screenshots/mobile.png", fullPage: true });
  await context.close();
}

let browser;
try {
  await mkdir("public/screenshots", { recursive: true });
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  await desktopJourney(browser);
  await mobileJourney(browser);
  console.log("Browser QA passed: desktop/mobile discovery, view modes, filters, saved search, sharing, export, comparison, detail, validation, viewing plan, persistence, keyboard dialogs, anchors, empty state, images, and overflow.");
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
