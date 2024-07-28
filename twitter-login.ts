import playwright from "playwright";
require("dotenv").config();

(async () => {
  const browser = await playwright["chromium"].launch();
  const context = await browser;
  const page = await context.newPage();
  await page.goto("https://twitter.com/i/flow/login");
  // Fill username
  (await page.waitForSelector("[autocomplete=username]")).fill(
    process.env.twitter_user!
  );
  // Press the Next button
  await page.click("span:text('Next')");
  // Fill password
  (await page.waitForSelector('[autocomplete="current-password"]')).fill(
    process.env.twitter_password!
  );

  await page.screenshot({
    path: `nodejs_${"chromium"}.png`,
    fullPage: true,
  });
  await browser.close();
})();
