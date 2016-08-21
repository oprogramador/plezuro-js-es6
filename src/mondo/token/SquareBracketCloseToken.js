import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken.js';
import SquareBracketOpenToken from 'plezuro-js-es6/src/mondo/token/SquareBracketOpenToken.js';

export default class SquareBracketCloseToken extends BracketToken {
  isClosingToken() {
    return true;
  }

  getOpenClass() {
    return SquareBracketOpenToken;
  }
}
