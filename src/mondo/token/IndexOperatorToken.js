import SquareBracketOpenToken from 'plezuro-js-es6/src/mondo/token/SquareBracketOpenToken.js';

const NULL_INDEX = 0;
const INITIAL_INDEX = 1;

export default class IndexOperatorToken extends SquareBracketOpenToken {
  getMatchingCloseBracket(tokenizer) {
    let counter = INITIAL_INDEX;
    for (
      let token = tokenizer.getNext();
      token !== null;
      token = tokenizer.getNext()
    ) {
      if (token.getOriginalText() === '[') {
        counter++;
      }
      if (token.getOriginalText() === ']') {
        counter--;
      }
      if (counter === NULL_INDEX) {
        return token;
      }
    }

    return null;
  }

  matchOperatorMethod() {
  }
}
