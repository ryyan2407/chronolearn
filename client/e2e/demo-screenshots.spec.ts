import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

import { createDemoPdfBuffer } from "./support/demoPdf";

const screenshotsDir = join(process.cwd(), "..", "docs", "screenshots");

const save = async (page: Parameters<typeof test>[1]["page"], name: string) => {
  mkdirSync(screenshotsDir, { recursive: true });
  await page.screenshot({
    path: join(screenshotsDir, name),
    fullPage: true
  });
};

test("capture demo screenshots", async ({ page }) => {
  test.setTimeout(180_000);

  const uniqueId = Date.now();
  const email = `screenshots.${uniqueId}@example.com`;
  const password = "supersecure123";
  const quizTitle = "ChronoLearn Demo Quiz";
  const main = page.getByRole("main");
  const sidebar = page.locator("aside");

  await page.goto("/");
  await save(page, "home.png");

  await page.goto("/register");
  await main.getByPlaceholder("Name").fill("ChronoLearn Demo");
  await main.getByPlaceholder("Email").fill(email);
  await main.getByPlaceholder("Password").fill(password);
  await main.getByRole("button", { name: "Register" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await sidebar.getByRole("link", { name: "Upload" }).click();
  await expect(page).toHaveURL(/\/upload$/);
  await save(page, "upload.png");

  await main.getByPlaceholder("Material title").fill("French Revolution Notes");
  await main.getByPlaceholder("Historical topic or period").fill("French Revolution");
  await main
    .getByPlaceholder("Paste study notes, source context, or a summary of the topic...")
    .fill(
      "The French Revolution grew out of debt, taxation, food pressure, and social inequality. The Third Estate faced heavy burdens while political legitimacy weakened across the monarchy."
    );
  await main.getByRole("button", { name: "Save topic material" }).click();
  await expect(main.getByText('Saved "French Revolution Notes". You can generate a quiz now.')).toBeVisible();

  await main.getByPlaceholder("Material title").fill("French Revolution PDF");
  await main.locator('input[type="file"]').setInputFiles({
    name: "chronolearn-demo.pdf",
    mimeType: "application/pdf",
    buffer: createDemoPdfBuffer()
  });
  await main.getByRole("button", { name: "Upload and save PDF" }).click();
  await expect(main.getByText(/Uploaded "French Revolution PDF"/)).toBeVisible();

  await main.getByPlaceholder("Quiz title, for example French Revolution Review").fill(quizTitle);
  await main.getByRole("button", { name: "Generate quiz" }).click();

  await expect(page).toHaveURL(/\/quiz\//);
  await expect(main.getByRole("heading", { name: quizTitle })).toBeVisible();
  await save(page, "quiz.png");

  for (let index = 0; index < 5; index += 1) {
    const shortAnswer = main.getByPlaceholder("Write a concise explanation using causes, chronology, or significance.");
    const isShortAnswer = await shortAnswer.isVisible();

    if (isShortAnswer) {
      await shortAnswer.fill(
        `Screenshot answer ${index + 1}: economic strain, taxation, inequality, and political crisis all contributed to unrest.`
      );
    } else {
      await main.locator("button.w-full").first().click();
    }

    if (index < 4) {
      await main.getByRole("button", { name: "Next question" }).click();
    }
  }

  page.once("dialog", (dialog) => dialog.accept());
  await main.getByRole("button", { name: "Finish quiz" }).click();

  await expect(page).toHaveURL(/\/results\//);
  await expect(main.getByRole("heading", { name: "Overall result" })).toBeVisible();
  await save(page, "results.png");

  await main.getByRole("button", { name: "Back to history" }).click();
  await expect(page).toHaveURL(/\/history$/);
  await save(page, "history.png");

  await sidebar.getByRole("link", { name: "Dashboard" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(main.getByText("Recent attempts")).toBeVisible();
  await save(page, "dashboard.png");
});
