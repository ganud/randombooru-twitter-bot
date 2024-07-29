import { postTweet } from "./twitter-login";
import { downloadRandomImagefromTag } from "./downloadImage";
let days = require("./days.json");
const fs = require("fs");
const schedule = require("node-schedule");
const rule = new schedule.RecurrenceRule();
rule.hour = 0;
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
    ["don_quixote_(project_moon)", "solo"],
    ["g"]
  );
  postTweet(`Day ${days.count} of Don (Art by ${artist})`);
  incrementDays();
}

// Post daily at the start of UTC
const job = schedule.scheduleJob(rule, function () {
  main();
});
