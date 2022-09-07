import { load } from 'cheerio';
import fetch from 'node-fetch';

const response = await fetch(
  'https://memegen-link-examples-upleveled.netlify.app/',
);

const body = await response.text();

const $ = load(body);

const imgSrcs = [];

for (let i = 0; i < 10; i++) {
  imgSrcs.push($('section > div > a > img')[i].attribs.src);
}
