#! /usr/bin/env node

const { promisify } = require('util');
const fs = require('fs');
const convert = require('heic-convert');
const path = require("path");

async function convertToJpg(heicFilePath) {
  if (!heicFilePath.endsWith('.heic')) {
    throw new Error(`${heicFilePath} is not an HEIC file`);
  }

  const inputBuffer = await promisify(fs.readFile)(heicFilePath);
  const outputBuffer = await convert({
    buffer: inputBuffer, // the HEIC file buffer
    format: 'JPEG'        // output format
  });
  const fileName = path.basename(heicFilePath, '.heic');

  const jpgFileName = `./${fileName}.jpg`;
  await promisify(fs.writeFile)(jpgFileName, outputBuffer);

  return jpgFileName;
}

(async () => {
  if (process.argv.length < 3) {
    console.warn('enter at least 1 HEIC file as argument');
    return process.exit(2);
  }

  for (let j = 2; j < process.argv.length; j++) {
    const heicFilePath = process.argv[j];
    try {
      const jpgFileName = await convertToJpg(heicFilePath);
      console.info(`${heicFilePath} -> ${jpgFileName}`);
    } catch (e) {
      console.error(`failed to convert ${heicFilePath}`);
      console.error(e);
    }
  }
})().catch((e) => {
  console.error(e);
  return process.exit(1);
});

