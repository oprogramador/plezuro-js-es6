import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken.js';

export default class SquareBracketCloseToken extends BracketToken {
  isClosingToken() {
    return true;
  }
}
