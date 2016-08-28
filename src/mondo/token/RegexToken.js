import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

const REGEX_SYMBOL_BEGIN_LENGTH = 2;
const REGEX_SYMBOL_END_LENGTH = 1;

export default class RegexToken extends Token {
  isBlank() {
    return false;
  }

  isEntity() {
    return true;
  }

  getRegexString() {
    return "r(('([^']|(''))*')|(\"([^\"]|(\"\"))*\"))";
  }

  doConvert() {
    const result = this.getOriginalText().substring(
      REGEX_SYMBOL_BEGIN_LENGTH,
      this.getOriginalText().length - REGEX_SYMBOL_END_LENGTH
    )
    .replace(/\\\\/g, '\\\\\\\\')
    .replace(/('')|'/g, '\\\\\'')
    .replace(/("")|"/g, '\\\\"')
    ;
    this.setText(`new RegExp("${result}")`);
  }
}
