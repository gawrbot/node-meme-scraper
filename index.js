// IMPORTS
// module to write in file system
import fs from 'node:fs';
// module to deal with command line arguments
import { argv } from 'node:process';
// module to go to a specific place in the command line/terminal
import readline from 'node:readline';
// Cheerio parses markup and provides an API for traversing/manipulating the resulting data structure. (Github Readme)
import { load } from 'cheerio';
// The Fetch API allows you to asynchronously request for a resource. (Javascripttutorial.net)
import fetch from 'node-fetch';

// PROGRAM

// PROGRESS BAR
// Write progress bar function for later.
// Use process.stdout.write instead of console.log bc. the readline module needs it
// "\x1B[?25l" = ANSI escape code (old but still understandable for machine): "\x1B[" (= esc) introduces a control sequence (=control of the console) and the ctrl sequence "?25l" hides the cursor (without this line, the cursor jumps around irritatingly, when printing the progress bar)
// print Unicode Character 'LIGHT SHADE' as long as the size goes
// tell cursor to go back to the start of the line x=0, y=0
// Set an interval (50ms) and print the Unicode Character 'FULL BLOCK' on top of the starting line step by step
// "?25h" makes the cursor reappear
const progressBar = (size, cursor) => {
  process.stdout.write('\x1B[?25l');
  for (let i = 0; i < size; i++) {
    process.stdout.write('\u2591');
  }
  readline.cursorTo(process.stdout, 0, 0);
  const timer = setInterval(() => {
    process.stdout.write('\u2588');
    cursor++;
    if (cursor >= size) {
      clearTimeout(timer);
      process.stdout.write('\x1B[?25h');
    }
  }, 50);
};

// IF/ELSE STATEMENT: WITH/WITHOUT COMMAND LINE INPUT
// argv[2] = first line of meme, argv[3] = second line of meme, argv[4] = keyword for meme image (e.g. bender or keanu)
if (argv[2] && argv[3] && argv[4]) {
  // function to download the URL that is produced as a string with the help of the input
  // Fetch the Response object from the URL that is passed as an argument
  // Transform the object into an array buffer
  // transform the object into a buffer
  // produce a directory with the name that is passed as an argument
  // produce a file with the buffer inside with the name that is passed as an argument and put it inside of the directory
  const downloadAndSaveCustomMeme = async (url, folder, path) => {
    const imgToGet = await fetch(url);
    const arrayBuffer = await imgToGet.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.mkdir(folder, () => {});
    await fs.writeFile(path, buffer, () => {});
  };
  // Invoke progress bar function
  progressBar(30, 0);

  // Call the function described above
  await downloadAndSaveCustomMeme(
    `https://api.memegen.link/images/${argv[4]}/${argv[2]}/${argv[3]}.png`,
    './custom-memes',
    `./custom-memes/${argv[3]}.png`,
  );
} else {
  // get Response from main URL of meme website
  // get the document text (=html) from the Response object
  // load in the HTML to make it parsable
  // define empty array to put in the URLs, taken out of the parsed elements
  const pageToScrape = await fetch(
    'https://memegen-link-examples-upleveled.netlify.app/',
  );

  const htmlBody = await pageToScrape.text();

  const $ = load(htmlBody);

  const imgUrls = [];

  // define function to actually get the binary image data from the imgUrls
  // create a directory and put the data inside of the memes-directory as new file
  const downloadAndSaveImg = async (url, folder, path) => {
    const imgToGet = await fetch(url);
    const arrayBuffer = await imgToGet.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.mkdir(folder, () => {});
    await fs.writeFile(path, buffer, () => {});
  };

  // invoke progress bar function
  progressBar(30, 0);

  // for 10 times, push the image URL of the specified HTML part into the imgUrls-array
  // take these 10 Urls and invoke the downloadImage-function on them and only on them
  for (let i = 0; i < 10; i++) {
    imgUrls.push($('section > div > a > img')[i].attribs.src);
    if (i < 9) {
      await downloadAndSaveImg(imgUrls[i], './memes', `./memes/0${i + 1}.jpg`);
    } else {
      await downloadAndSaveImg(imgUrls[i], './memes', `./memes/${i + 1}.jpg`);
    }
  }
}

/* NOTES:
Memes erzeugen: https://memecomplete.com/custom/ --> either access to html forms or manipulate local image? input(POST or PUT request? node-fetch and cheerio capable of that?), then save image to file using the downloadImage function?
input field for background image: id="id_key"
...for Line 1: id="id_line_1"
...for Line 2: id="id_line_2"

ajax: https://www.w3schools.com/js/js_ajax_intro.asp (technique to manipulate webpage) and its methods: https://api.jquery.com/category/ajax/

progress bar lib, e.g. https://www.npmjs.com/package/color-progress-bar

ArrayBuffer und Buffer --> difference?
*/
