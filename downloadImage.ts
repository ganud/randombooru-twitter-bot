import fs = require("fs");
import axios from "axios";
import {
  getRandomUniquePostfromTag,
  getPostDetails,
  getRandomPostfromTag,
} from "./randombooru";
import { some } from "lodash-es";

export async function downloadRandomImagefromTag(
  tags: Array<string>,
  ratings: Array<string>
) {
  // Get the post link
  let posturl = "";
  // Try getting a unique post, but if that fails just select one anyway
  try {
    posturl = await getRandomUniquePostfromTag(tags, ratings, 10);
  } catch {
    console.log(
      "Retrying for unique post unsuccessful, using normal random selection instead"
    );
    posturl = await getRandomPostfromTag(tags, ratings);
  }
  // Extract image link from post
  const postdetails = await getPostDetails(posturl);
  // Download from that image link
  downloadImage(postdetails.imageurl!, "./savedimage.jpg");
  // Return the artist name to be credited
  return {
    artist: postdetails.artist,
    source: postdetails.source,
  };
}

// downloadImage provided by https://scrapingant.com/blog/download-image-javascript
export async function downloadImage(url: string, filepath: string) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on("error", reject)
      .once("close", () => resolve(filepath));
  });
}
