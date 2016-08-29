import UnsupportedOperationException from
  'plezuro-js-es6/src/mondo/exception/UnsupportedOperationException.js';
import _ from 'lodash';
import path from 'path';

let staticFilename = null;
const CHAR_OFFSET = 1;

export default class Token {
  constructor(args) {
    this.factory = args.factory;
    this.helper = args.helper;
  }

  getRegex() {
    return new RegExp(this.getRegexString());
  }

  isPossibleAfterPrevious() {
    return true;
  }

  isOpeningToken() {
    return false;
  }

  isClosingToken() {
    return false;
  }

  find(args) {
    if (!this.isPossibleAfterPrevious(args.previousToken)) {
      return null;
    }
    try {
      return this.findFromRegex(args.lines, args.lineNr, args.index);
    } catch (e) {
      return this.findFromList(args.lines, args.lineNr, args.index);
    }
  }

  findFromList(lines, lineNr, index) {
    let result = null;
    this.getPossibleTokens().forEach((tokenText) => {
      if (
        result === null ||
        tokenText.length > result.getOriginalText().length &&
        lines[lineNr].indexOf(tokenText, index) === index
      ) {
        result = this.getObjectOfSuitableSubclass(tokenText)
          .setBegX(index)
          .setEndX(index + tokenText.length - CHAR_OFFSET)
          .setOriginalText(tokenText)
          .setLineNr(lineNr);
      }
    });

    return result;
  }

  findFromRegex(lines, lineNr, index) {
    const line = lines[lineNr];
    const match = this.getRegex().exec(line.substr(index));
    if (match) {
      return this.getObjectOfSuitableSubclass(match[0])
        .setBegX(match.index)
        .setEndX(match.index + match[0].length - CHAR_OFFSET)
        .setOriginalText(match[0])
        .setLineNr(lineNr);
    }

    return null;
  }

  getObjectOfSuitableSubclass() {
    return _.clone(this);
  }

  getLineNr() {
    return this.lineNr;
  }

  getEndLineNr() {
    return this.getLineNr();
  }

  setLineNr(value) {
    this.lineNr = value;

    return this;
  }

  convert(tokenizer) {
    if (tokenizer.isFinished()) {
      return;
    }
    if (this.getText() === this.getOriginalText()) {
      this.doConvert(tokenizer);
    }
    tokenizer.resetToThis();
    if (tokenizer.getNext() === null) {
      tokenizer.resetToThis();
      tokenizer.insertAfter(
        this.factory.create('FunctionEndToken')
        .setText(
          `})[typeof module !== 'undefined' ? 'exports' : 'call']
          (typeof module !== 'undefined' ? module : null)`
        ));
      tokenizer.reset();
      tokenizer.insertBefore(
        this.factory.create('FunctionToken')
          .setText('(function() {')
      );
      tokenizer.resetToThis();
      this.helper.getFunction('BracketToken.matchFunctionEnd')(tokenizer);
      tokenizer.finish();
    }
  }

  doConvert() {

  }

  eventuallyChangeType() {
    return this;
  }

  preConvert() {

  }

  getFullFilename() {
    return this.filename || staticFilename;
  }

  getFilename() {
    return path.basename(this.filename);
  }

  getDirName() {
    return path.dirname(this.filename);
  }

  setFactory(factory) {
    this.factory = factory;

    return this;
  }

  setHelper(helper) {
    this.helper = helper;

    return this;
  }

  setFilename(value) {
    this.filename = value;

    return this;
  }

  static setStaticFilename(value) {
    staticFilename = value;
  }

  getBegX() {
    return this.begX;
  }

  setBegX(value) {
    this.begX = value;

    return this;
  }

  getEndX() {
    return this.endX;
  }

  setEndX(value) {
    this.endX = value;

    return this;
  }

  getOriginalText() {
    return this.originalText;
  }

  setOriginalText(value) {
    this.originalText = value;
    this.text = value;

    return this;
  }

  getText() {
    return this.text;
  }

  setText(value) {
    this.text = value;

    return this;
  }

  isEntity() {
    if (this.isBlank()) {
      return false;
    }
    throw new UnsupportedOperationException();
  }

  isDelimiter() {
    return false;
  }

  getRegexString() {
    throw new UnsupportedOperationException();
  }

  getPossibleTokens() {
    throw new UnsupportedOperationException();
  }

  copyAll(token) {
    this.setBegX(token.getBegX())
      .setEndX(token.getEndX())
      .setLineNr(token.getLineNr())
      .setOriginalText(token.getOriginalText())
      .setText(token.getText())
      .setFilename(token.getFilename());

    return this;
  }
}
