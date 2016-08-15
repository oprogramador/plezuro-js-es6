import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

export default class Tokenizer {
  constructor() {

  }

  process() {

  }

  getTokens() {
    return [];
  }

  hardNext() {
    const TOKEN_PROBABILITY = 0.5;
    if (Math.random() > TOKEN_PROBABILITY) {
      return new Token();
    }

    return null;
  }

  hardReset() {
    return new Token();
  }
}
