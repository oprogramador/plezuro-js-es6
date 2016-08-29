import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

export default class NewLineToken extends Token {
  isBlank() {
    return true;
  }

  setParams(lineNr, x) {
    this.lineNr = lineNr;
    this.begX = x;
    this.endX = x;
    this.originalText = '\n';
    this.text = '\n';

    return this;
  }
}
