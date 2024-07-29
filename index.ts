import { postTweet } from "./twitter-login";
import { downloadRandomImagefromTag } from "./downloadImage";
let days = require("./days.json");
const fs = require("fs");

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

main();
