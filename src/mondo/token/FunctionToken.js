import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

export default class FunctionToken extends Token {
  isOpeningToken() {
    return true;
  }
}
