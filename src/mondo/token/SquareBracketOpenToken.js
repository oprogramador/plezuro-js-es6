import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken.js';

export default class SquareBracketOpenToken extends BracketToken {
  isOpeningToken() {
    return true;
  }
}
