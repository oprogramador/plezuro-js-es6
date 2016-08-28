import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

const COMMENT_SYMBOL_LENGTH = 2;

export default class CommentToken extends Token {
  isBlank() {
    return true;
  }

  getRegexString() {
    return '\\/\\/.*';
  }

  doConvert() {
    this.setText(`/*${this.originalText.substring(COMMENT_SYMBOL_LENGTH)}*/`);
  }
}
