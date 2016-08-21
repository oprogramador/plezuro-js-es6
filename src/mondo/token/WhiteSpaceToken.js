import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

export default class WhiteSpaceToken extends Token {
  isBlank() {
    return true;
  }

  getRegex() {
    return '[ \\\t]+';
  }
}
