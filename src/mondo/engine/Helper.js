import SymbolToken from 'plezuro-js-es6/src/mondo/token/SymbolToken.js';

const addNullBetweenSemicolonAndBracketClose = Symbol();
const removeComaBeforeBracketClose = Symbol();
const addZeroBeforeMinus = Symbol();

export default class Helper {
  constructor(tokenizer) {
    this.tokenizer = tokenizer;
  }

  [addNullBetweenSemicolonAndBracketClose]() {
    for (
      let token = this.tokenizer.hardReset();
      token !== null;
      token = this.tokenizer.hardNext()
    ) {
      if (token.getOriginalText() === ';') {
        const next = this.tokenizer.getNextNotBlank();
        if (next === null || next.isClosingToken()) {
          this.tokenizer.resetToThis();
          this.tokenizer.insertAfter(new SymbolToken().setOriginalText('null'));
        }
      }
    }
  }

  [removeComaBeforeBracketClose]() {

  }

  [addZeroBeforeMinus]() {

  }

  process() {
    this[addZeroBeforeMinus]();
    this[addNullBetweenSemicolonAndBracketClose]();
    this[removeComaBeforeBracketClose]();
  }
}
