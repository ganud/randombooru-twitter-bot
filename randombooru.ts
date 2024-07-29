import axios from "axios";
import * as cheerio from "cheerio";
import { sample } from "lodash-es";
require("dotenv").config();

const headers = {
  "User-Agent": process.env.danbooru_id,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9",
};

export default async function getRandomPostfromTag(
  tags: Array<string>,
  ratings: Array<string>
) {
  const pages = await getPages(tags, ratings);
  if (Number.isNaN(pages)) {
    throw new Error("Tag entered is invalid");
  }
  const pagelink = await generateRandomPageLink(pages, tags, ratings);
  return await getRandomLinkFromPage(pagelink);
}

// Extract image link from post
export async function getPostDetails(url: string) {
  const response = await axios.get(url, {
    headers,
  });
  const $ = cheerio.load(response.data);
  return {
    artist: $("a.search-tag").first().text(),
    imageurl: $("#image").attr("src"),
  };
}

// Get number of pages from a tag
async function getPages(tags: Array<string>, ratings: Array<string>) {
  const tagString = tags.join("+");
  const ratingString = ratings.join(",");
  const response = await axios.get(
    `https://danbooru.donmai.us/posts?&tags=${tagString}+rating:${ratingString}`,
    {
      headers,
    }
  );
  const $ = cheerio.load(response.data);
  return parseInt($(".paginator-page").last().text());
}

// Given a tag and number of pages, generate a link to a random page of that tag
async function generateRandomPageLink(
  pages: number,
  tags: Array<string>,
  ratings: Array<string>
) {
  const page = getRandomInt(1, pages);
  const tagString = tags.join("+");
  const ratingString = ratings.join(",");
  return `https://danbooru.donmai.us/posts?page=${page}&tags=${tagString}+rating:${ratingString}`;
}

// Get the post links from a page
async function getRandomLinkFromPage(pageLink: string) {
  const response = await axios.get(pageLink, {
    headers,
  });
  // Load string html
  const $ = cheerio.load(response.data);
  const links = $("a.post-preview-link");
  const formattedlinks: Array<String> = [];
  // Remove search metadata from posts
  links.each((i, link) => {
    formattedlinks.push(`${$(link).attr("href")?.split("?")[0]!}`);
  });
  // Return the full post link
  return "https://danbooru.donmai.us" + `${sample(formattedlinks)}`;
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { getPages, getRandomPostfromTag };
