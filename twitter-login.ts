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
  // This delay and if statement checks if login is obstructed by prompt asking for email
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
  }

  // Fill password
  (await page.waitForSelector('[autocomplete="current-password"]')).fill(
    process.env.twitter_password!
  );
  // Press the login button
  await page.click("span:text('Log in')");
  console.log("Logging in...");
  // Select the tweet text input(why is it a div...)
  (await page.waitForSelector("div.public-DraftEditorPlaceholder-inner")).click(
    { force: true }
  );
  console.log("Logged in, entering text");
  // Delay needed here, else the keys won't register
  await page.waitForTimeout(300);
  // Type tweet text
  await page.keyboard.type(text);

  console.log("Uploading image...");
  // Upload file
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    await page
      .locator('[aria-label="Add photos or video"]')
      .click({ force: true }),
  ]);
  await fileChooser.setFiles("./savedimage.jpg");
  await page.waitForTimeout(3000);

  // Post tweet
  await page.locator('[data-testid="tweetButtonInline"]').click();
  await page.waitForTimeout(3000);
  console.log("Tweet has been posted!");

  await browser.close();
}
