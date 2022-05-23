const fs = require('fs');
const path = require('path');
const {stdout, stdin} = process;


fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  () => {}
);

stdout.write('Welcome. Enter your message \n');
stdin.on('data', data => {
  if(data.toString() === 'exit\r\n') {
    process.exit();
  } 
  fs.appendFile(
    path.join(__dirname, 'text.txt'),
    data,
    () => {}
  );
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => stdout.write('Have a good day \n'));