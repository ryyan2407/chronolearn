import { expect, test } from "@playwright/test";
import { createDemoPdfBuffer } from "./support/demoPdf";

test("full happy path from register to logout", async ({ page }) => {
  test.setTimeout(180_000);

  const uniqueId = Date.now();
  const email = `playwright.${uniqueId}@example.com`;
  const password = "supersecure123";
  const quizTitle = "Playwright Demo Quiz";

  await page.goto("/register");

  const main = page.getByRole("main");
  const sidebar = page.locator("aside");

  await main.getByPlaceholder("Name").fill("Playwright Demo User");
  await main.getByPlaceholder("Email").fill(email);
  await main.getByPlaceholder("Password").fill(password);
  await main.getByRole("button", { name: "Register" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Track quiz volume, results, and recent study sessions" })).toBeVisible();

  await sidebar.getByRole("link", { name: "Upload" }).click();
  await expect(page).toHaveURL(/\/upload$/);

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
  const pdfInput = main.locator('input[type="file"]');
  await pdfInput.setInputFiles({
    name: "chronolearn-demo.pdf",
    mimeType: "application/pdf",
    buffer: createDemoPdfBuffer()
  });
  await main.getByRole("button", { name: "Upload and save PDF" }).click();
  await expect(main.locator("select")).toContainText("French Revolution PDF");

  await main.getByPlaceholder("Quiz title, for example French Revolution Review").fill(quizTitle);
  await main.getByRole("button", { name: "Generate quiz" }).click();

  await expect(page).toHaveURL(/\/quiz\//);
  await expect(page.getByRole("heading", { name: quizTitle })).toBeVisible();

  for (let index = 0; index < 5; index += 1) {
    const shortAnswer = page.getByPlaceholder("Write a concise explanation using causes, chronology, or significance.");
    const isShortAnswer = await shortAnswer.isVisible();

    if (isShortAnswer) {
      await shortAnswer.fill(
        `Playwright answer ${index + 1}: economic strain, taxation, inequality, and political crisis all contributed to unrest.`
      );
    } else {
      await page.locator("button").filter({ has: page.locator("text=/./") }).nth(0);
      await main.locator("button.w-full").first().click();
    }

    if (index < 4) {
      await main.getByRole("button", { name: "Next question" }).click();
    }
  }

  page.once("dialog", (dialog) => dialog.accept());
  await main.getByRole("button", { name: "Finish quiz" }).click();

  await expect(page).toHaveURL(/\/results\//);
  await expect(page.getByRole("heading", { name: "Overall result" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Written feedback" })).toBeVisible();

  await main.getByRole("button", { name: "Back to history" }).click();
  await expect(page).toHaveURL(/\/history$/);
  await expect(main.getByRole("heading", { name: "Attempt history and recent scores" })).toBeVisible();
  await expect(main.getByText(quizTitle)).toBeVisible();
  await main.getByRole("button", { name: "Open results" }).first().click();

  await expect(page).toHaveURL(/\/results\//);
  await sidebar.getByRole("link", { name: "Dashboard" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(main.getByText("Average score")).toBeVisible();
  await expect(main.getByText("Recent attempts")).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await main.getByPlaceholder("Email").fill(email);
  await main.getByPlaceholder("Password").fill(password);
  await main.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await sidebar.getByRole("link", { name: "History" }).click();
  await expect(main.getByText(quizTitle).first()).toBeVisible();
});
