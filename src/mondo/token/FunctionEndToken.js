import FunctionToken from 'plezuro-js-es6/src/mondo/token/FunctionToken.js';
import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

export default class FunctionEndToken extends Token {
  isClosingToken() {
    return true;
  }

  getOpenClass() {
    return FunctionToken;
  }
}
