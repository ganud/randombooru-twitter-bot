const fs = require("fs");
const Axios = require("axios");
import {
  getRandomUniquePostfromTag,
  getPostDetails,
  getRandomPostfromTag,
} from "./randombooru";

export async function downloadRandomImagefromTag(
  tags: Array<string>,
  ratings: Array<string>
) {
  // Get the post link
  let posturl = "";
  // Try getting a unique post, but if that fails just select one anyway
  try {
    posturl = await getRandomUniquePostfromTag(tags, ratings, 3);
  } catch {
    console.log(
      "Retrying for unique post unsuccessful, using normal random selecion instead"
    );
    posturl = await getRandomPostfromTag(tags, ratings);
  }
  // Extract image link from post
  const postdetails = await getPostDetails(posturl);
  // Download from that image link
  downloadImage(postdetails.imageurl!, "./savedimage.jpg");
  // Return the artist name to be credited
  return postdetails.artist;
}

// downloadImage provided by https://scrapingant.com/blog/download-image-javascript
export async function downloadImage(url: string, filepath: string) {
  const response = await Axios({
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
