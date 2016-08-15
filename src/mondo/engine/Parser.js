import Helper from 'plezuro-js-es6/src/mondo/engine/Helper.js';
import LineByLineReader from 'n-readlines';
import Tokenizer from 'plezuro-js-es6/src/mondo/engine/Tokenizer.js';
import Validator from 'plezuro-js-es6/src/mondo/engine/Validator.js';
import fs from 'fs';

const readFromFile = Symbol();
const eventuallyChangeTokenType = Symbol();
const preConvert = Symbol();
const convert = Symbol();
const writeToFile = Symbol();

export default class Parser {
  constructor(filename, outFilename) {
    this.lines = [];
    this.filename = filename;
    this.outFilename = outFilename;
  }

  [readFromFile]() {
    const reader = new LineByLineReader(this.filename);
    let line = null;
    do {
      line = reader.next();
      this.lines.push(line.toString());
    } while (line);
  }

  [eventuallyChangeTokenType]() {
    this.tokenizer.hardReset();
    const tokens = this.tokenizer.getTokens();
    for (let i = 0; i < tokens.length; i++) {
      tokens[i] = tokens[i].eventuallyChangeType(this.tokenizer);
      this.tokenizer.hardNext();
    }
  }

  [preConvert]() {
    for (
      let token = this.tokenizer.hardReset();
      token !== null;
      token = this.tokenizer.hardNext()
    ) {
      token.preConvert(this.tokenizer);
    }
  }

  [convert]() {
    for (
      let token = this.tokenizer.hardReset();
      token !== null;
      token = this.tokenizer.hardNext()
    ) {
      token.convert(this.tokenizer);
    }
  }

  [writeToFile](tokens) {
    const newTokens = tokens || this.tokenizer.getTokens();
    const file = fs.createWriteStream(this.getOutputFilename());
    newTokens.forEach((token) => file.write(token.getText()));
    file.end();
  }

  getTokenizer() {
    return this.tokenizer;
  }

  getOutputFilename() {
    return this.outFilename || `${this.filename}.js`;
  }

  process() {
    try {
      this[readFromFile]();
      this.tokenizer = new Tokenizer(this.filename, this.lines);
      this.tokenizer.process();
      this[eventuallyChangeTokenType]();
      const validator = new Validator(this.tokenizer);
      validator.process();
      const helper = new Helper(this.tokenizer);
      helper.process();
      this[preConvert]();
      this[convert]();
      this[writeToFile]();
    } catch (error) {
      this[writeToFile](error.getTokens());
    }
  }
}
