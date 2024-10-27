import { postTweet } from "./twitter-login";
import { downloadRandomImagefromTag } from "./downloadImage";
let days = require("./days.json");
import fs = require("fs");
import schedule = require("node-schedule");

const rule = new schedule.RecurrenceRule();
// 3PM EDT
rule.hour = 19;
rule.minute = 0;
rule.tz = "Etc/UTC";

// Increment a counter stored locally in JSON
function incrementDays() {
  days.count = days.count + 1;
  fs.writeFileSync("./days.json", JSON.stringify(days));
}

// Prepare image + credit artist and post
async function main() {
  // Replace tags and ratings here
  const artist = await downloadRandomImagefromTag(
    ["miyako_(blue_archive)", "solo"],
    ["g"]
  );
  await postTweet(
    `#${days.count} | Today's Miyako by ${artist.artist} #月雪ミヤコ #ブルアカ`,
    artist.source
  );
  incrementDays();
}

main();
// Post daily at the start of UTC
const job = schedule.scheduleJob(rule, async function () {
  await main();
});
