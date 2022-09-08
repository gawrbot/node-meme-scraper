import fs from 'node:fs';
import { load } from 'cheerio';
import fetch from 'node-fetch';

const response = await fetch(
  'https://memegen-link-examples-upleveled.netlify.app/',
);

const body = await response.text();

const $ = load(body);

const imgUrls = [];

const downloadImage = async (url, path) => {
  const response2 = await fetch(url);
  const arrayBuffer = await response2.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(path, buffer, () => {});
};

for (let i = 0; i < 10; i++) {
  imgUrls.push($('section > div > a > img')[i].attribs.src);
  await downloadImage(imgUrls[i], `./memes/0${i + 1}.jpg`);
}
