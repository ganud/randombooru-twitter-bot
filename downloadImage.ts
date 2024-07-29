const fs = require("fs");
const Axios = require("axios");
import { getRandomPostfromTag, getPostDetails } from "./randombooru";

// downloadImage provided by https://scrapingant.com/blog/download-image-javascript
export default async function downloadImage(url: string, filepath: string) {
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

export async function downloadRandomImagefromTag(
  tags: Array<string>,
  ratings: Array<string>
) {
  // Get the post link
  const posturl = await getRandomPostfromTag(tags, ratings);
  // Extract image link from post
  const postdetails = await getPostDetails(posturl);
  // Download from that image link
  downloadImage(postdetails.imageurl!, "./savedimage.jpg");
  // Return the artist name to be credited
  return postdetails.artist;
}
