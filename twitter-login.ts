import playwright from "playwright";
require("dotenv").config();

// Login into twitter and post tweet
export async function postTweet(text: string) {
  const browser = await playwright["chromium"].launch();
  const context = await browser;
  const page = await context.newPage();
  await page.goto("https://twitter.com/i/flow/login");

  // Fill username
  await page.fill("[autocomplete=username]", process.env.twitter_user!);

  // Press the Next button
  await page.click("span:text('Next')");

  // This delay and if statement checks if login is obstructed by prompt asking for email/phone
  await page.waitForTimeout(3000);
  if (
    await page.isVisible(
      "span:text('Enter your phone number or email address')"
    )
  ) {
    await page.fill("[inputmode=text]", process.env.twitter_email!);
    console.log("Login is obstructed: Entering email");
    await page.click("span:text('Next')");
  }

  // Fill password
  await page.fill(
    "[autocomplete=current-password]",
    process.env.twitter_password!
  );

  // Press the login button
  await page.click("span:text('Log in')");
  console.log("Logging in...");

  // Select the tweet text input and fill
  await page.fill('[aria-label="Post text"]', text);
  console.log("Logged in, entering text");

  // Click off into some area, incase the text input is a hashtag which opens a dialogue that blocks the upload button
  await page.locator('[aria-label="Search query"]').click({ force: true });

  // Upload file
  console.log("Starting image upload...");
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    await page.locator('[aria-label="Add photos or video"]').click(),
  ]);
  await fileChooser.setFiles("./savedimage.jpg");
  // This selector only appears when an image is successfully uploaded, so it serves as a confirmation.
  await page.waitForSelector('[aria-label="Tag people"]');
  console.log("Image uploaded.");

  // Post tweet
  await page.locator('[data-testid="tweetButtonInline"]').click();
  // Haven't found a working selector that officially confirms the post, so this delay functionally does the same.
  await page.waitForTimeout(3000);
  console.log("Tweet has been posted!");

  await browser.close();
}
