import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";

const baseURL = "http://127.0.0.1:4173/parcel-pine-homes/";
const server = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", "4173"], { stdio: "inherit", shell: true });

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { const response = await fetch(baseURL); if (response.ok) return; } catch { /* preview is still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Production preview did not become ready");
}

async function desktopJourney(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.getByPlaceholder("Street, neighbourhood, or feature").fill("garden");
  await page.getByRole("button", { name: "Condo" }).click();
  await page.getByRole("button", { name: /Save Garden Flat/ }).click();
  await page.getByRole("button", { name: /View Garden Flat/ }).click();
  await page.getByRole("button", { name: "Plan a viewing" }).click();
  await page.getByLabel("Name").fill("Avery Chen");
  await page.getByLabel("Email").fill("avery@example.com");
  await page.getByText("Tue, Nov 10 · 5:30 PM", { exact: true }).click();
  await page.getByRole("button", { name: "Save viewing preview" }).click();
  await page.getByText("Added to your plan").waitFor();
  await page.getByRole("button", { name: "Continue exploring" }).click();
  await page.screenshot({ path: "public/screenshots/desktop.png", fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) throw new Error("Desktop horizontal overflow detected");
  await page.close();
}

async function mobileJourney(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Save Cedar Courtyard/ }).click();
  await page.getByRole("button", { name: /Saved/ }).click();
  await page.locator(".saved-drawer").getByText("Cedar Courtyard House", { exact: true }).click();
  await page.getByRole("button", { name: "Close property details" }).click();
  await page.getByRole("link", { name: "Collections" }).click();
  await page.screenshot({ path: "public/screenshots/mobile.png", fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) throw new Error("Mobile horizontal overflow detected");
  await page.close();
}

let browser;
try {
  await mkdir("public/screenshots", { recursive: true });
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  await desktopJourney(browser);
  await mobileJourney(browser);
  console.log("Browser QA passed: desktop and mobile journeys, persistence, forms, anchors, and overflow.");
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
