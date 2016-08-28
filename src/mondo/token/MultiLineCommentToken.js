import MultiLineToken from 'plezuro-js-es6/src/mondo/token/MultiLineToken.js';

export default class MultiLineCommentToken extends MultiLineToken {
  isBlank() {
    return true;
  }

  getRegexString() {
    return '\\/\\*.*';
  }

  getEndRegex() {
    return '.*\\*\\/';
  }
}
