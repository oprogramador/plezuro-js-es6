import NumberToken from 'plezuro-js-es6/src/mondo/token/NumberToken.js';
import SymbolToken from 'plezuro-js-es6/src/mondo/token/SymbolToken.js';
import WhiteSpaceToken from 'plezuro-js-es6/src/mondo/token/WhiteSpaceToken.js';

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
    for (
      let token = this.tokenizer.hardReset();
      token !== null;
      token = this.tokenizer.hardNext()
    ) {
      if (token.getOriginalText() === ',') {
        const next = this.tokenizer.getNextNotBlank();
        if (next === null || next.isClosingToken()) {
          this.tokenizer.resetToThis();
          this.tokenizer.replaceToken(
            new WhiteSpaceToken().setOriginalText('')
          );
        }
      }
    }
  }

  [addZeroBeforeMinus]() {
    for (
      let token = this.tokenizer.hardReset();
      token !== null;
      token = this.tokenizer.hardNext()
    ) {
      if (token.getOriginalText() === '-') {
        const previous = this.tokenizer.getPreviousNotBlank();
        if (
          previous === null ||
          previous.isOpeningToken() ||
          previous.isDelimiter()
        ) {
          this.tokenizer.insertAfter(new NumberToken().setText('0'));
        }
      }
    }
  }

  process() {
    this[addZeroBeforeMinus]();
    this[addNullBetweenSemicolonAndBracketClose]();
    this[removeComaBeforeBracketClose]();
  }
}
