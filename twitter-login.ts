import playwright from "playwright";
require("dotenv").config();

// Login into twitter and post tweet
export async function postTweet(text: string, source: string) {
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

  // Go to the profile page to find the recently posted tweet
  await page.goto(`https://twitter.com/${process.env.twitter_user}`);
  // Click on the first tweet (which should be the one just posted)
  await page
    .locator('[data-testid="tweetText"]')
    .first()
    // Set position parameters to avoid clicking on hashtags which redirect elsewhere
    .click({ position: { x: 0, y: 0 } });
  // Post reply
  try {
    await page.fill('[aria-label="Post text"]', source);
  } catch {
    // By this point, the tweet is already posted
    // Rather not have my PaaS restart from an error and post another tweet due to missing the reply
    console.log("Error posting source");
    await browser.close();
    return;
  }
  await page.locator('[data-testid="tweetButtonInline"]').click();
  await page.waitForTimeout(3000);
  console.log("Source has been posted!");
  await browser.close();
}
