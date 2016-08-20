import BracketOpenToken from 'plezuro-js-es6/src/mondo/token/BracketOpenToken.js';
import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken.js';

export default class BracketCloseToken extends BracketToken {
  isClosingToken() {
    return true;
  }

  getOpenClass() {
    return BracketOpenToken;
  }
}
