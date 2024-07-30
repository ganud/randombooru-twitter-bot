import playwright from "playwright";
require("dotenv").config();

// Login into twitter and post tweet
export async function postTweet(text: string) {
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

  // This delay and if statement checks if login is obstructed by prompt asking for email/phone
  await page.waitForTimeout(3000);
  if (
    await page.isVisible(
      "span:text('Enter your phone number or email address')"
    )
  ) {
    (await page.waitForSelector("[inputmode=text]")).fill(
      process.env.twitter_email!
    );
    console.log("Login is obstructed: Entering email");
    await page.click("span:text('Next')");
    // await page.waitForTimeout(3000); May need this timeout, but I haven't tested this yet.
  }

  // Fill password
  (await page.waitForSelector('[autocomplete="current-password"]')).fill(
    process.env.twitter_password!
  );

  // Press the login button
  await page.click("span:text('Log in')");
  console.log("Logging in...");

  // Select the tweet text input
  (await page.waitForSelector('[aria-label="Post text"]')).click();
  console.log("Logged in, entering text");
  // Delay needed here, else the text field won't register
  await page.waitForTimeout(1000);
  // Type tweet text
  await page.keyboard.type(text);

  // Upload file
  console.log("Uploading image...");
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    await page.locator('[aria-label="Add photos or video"]').click(),
  ]);
  await fileChooser.setFiles("./savedimage.jpg");
  await page.waitForTimeout(3000);

  // Post tweet
  await page.locator('[data-testid="tweetButtonInline"]').click();
  await page.waitForTimeout(3000);
  console.log("Tweet has been posted!");

  await browser.close();
}
