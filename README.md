# Randombooru Twitter Bot

## About

This projects aims to to automate twitter posting using tagged images from [danbooru](https://danbooru.donmai.us/posts?tags=peter_griffin+rating%3Ag&z=5) through use of web scrapers such as Playwright and Cheerio. Each tweet replies with the original source provided from danbooru.

<div align="center">
    <img src="https://i.imgur.com/vEqyyGd.png"></img>
</div>

## Installation & Usage

Note: Running playwright for this script seems to require at least 768mb of RAM. Anything lower seems to error.

1.  Clone this repo
2.  Install NPM packages

```
npm install
```

3.  Install playwright dependencies when prompted
4.  Add your credentials in .env
    <img src="https://i.imgur.com/4CmHqlN.png"></img>
5.  In index.ts, replace arguments inside downloadRandomImagefromTag and postTweet with tags and tweet text of your choosing
6.  Set up database table for unique posts using SQL

```
CREATE TABLE posts (
id SERIAL PRIMARY KEY,
post VARCHAR (255) UNIQUE,
);
```

7.  Run the script

```sh
npx tsx index.ts
```

This project is essentially 2 standalone scripts joined into a cron function to post the contents of the tweet through index.ts

1. twitter-login.ts, containing the twitter login and post logic
2. randoombooru.ts, containing getRandomPostfromTag to supply the link to download an image from to save and provide for twitter-login.ts

## Future ideas

- ✅ Getting the script to recognize whether a post has already been used (Uniques only). As of now I've mitigated this by comparing existing posts against a postgres database. getRandomUniquePostfromTag retries a set number of times until a unique post is returned, but this number is user-determined instead of a conditional. Danbooru doesn't give the number of posts when multiple tags are searched at the same time, so I can't be sure whether a particular tag combination is exhausted.
- Improving twitter-login.ts
  - The script sometimes throws an error when restricted by an email/phone prompt on deployment. This might be a delay issue, as the login is successful on the second attempt, implying the email was entered but couldn't find the password selector on the first attempt.
    - TLDR: Don't use a VPN, hosting this on a VPS/PAAS may error the first time due to IP shenanigans.
- Video support
  - The fault lies with downloadImage.ts supporting only well, images. Video posts on danbooru are rare, and it just downloads the HTML page instead. The tweet script can't use that, so it errors before the tweet is posted.
