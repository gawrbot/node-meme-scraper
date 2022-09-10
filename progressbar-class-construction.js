// source: https://blog.bitsrc.io/build-a-command-line-progress-bar-in-node-js-5702a3525a49

// import process from 'node:process';
// import readline from 'node:readline';

// class LoadingBar {
//   constructor(size) {
//     this.size = size;
//     this.cursor = 0;
//     this.timer = null;
//   }
//   start() {
//     process.stdout.write('\x1B[?25l');
//     process.stdout.write('[');
//     for (let i = 0; i < this.size - 1; i++) {
//       process.stdout.write(':');
//     }
//     process.stdout.write(']');
//     this.cursor = 1;
//     readline.cursorTo(process.stdout, this.cursor, this.cursor - 1);
//     this.timer = setInterval(() => {
//       process.stdout.write('|');
//       this.cursor++;
//       if (this.cursor >= this.size) {
//         clearTimeout(this.timer);
//         process.stdout.write('\x1B[?25h');
//       }
//     }, 100);
//   }
// }

// const ld = new LoadingBar(30);
// ld.start();
