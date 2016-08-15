import Helper from 'plezuro-js-es6/src/mondo/engine/Helper.js';
import LineByLineReader from 'n-readlines';
import Tokenizer from 'plezuro-js-es6/src/mondo/engine/Tokenizer.js';
import Validator from 'plezuro-js-es6/src/mondo/engine/Validator.js';

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
    while (line) {
      this.lines.push(line.toString());
      line = reader.next();
    }
  }

  [eventuallyChangeTokenType]() {

  }

  [preConvert]() {

  }

  [convert]() {

  }

  [writeToFile]() {

  }

  getTokenizer() {
    return this.tokenizer;
  }

  getOutputFilename() {
    return this.outFilename || `${this.filename}.js`;
  }

  process() {
    try {
      this[readFromFile](this);
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
      this[writeToFile]({error});
    }
  }
}
