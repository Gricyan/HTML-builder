const { stdin, stdout } = process;

const path = require('path');
const fs = require('fs');
const info = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const readline = require('readline');
const rl = readline.createInterface(stdin, stdout);

rl.write('Write some text please\n');
rl.on('line', (text) => {
  if (text === 'exit') {
    stdout.write('See you soon!\n');
    process.exit();
  }

  info.write(`${text}\n`);
});

rl.on('close', () => {
  stdout.write('See you soon!\n');
  process.exit();
});