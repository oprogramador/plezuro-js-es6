import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken.js';
import OperatorToken from 'plezuro-js-es6/src/mondo/token/OperatorToken.js';
import SquareBracketOpenToken from 'plezuro-js-es6/src/mondo/token/SquareBracketOpenToken.js';
import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

const functionMap = {
  args: () => '([this].concat(Array.prototype.slice.call(arguments)))',
  first: () => 'arguments[0]',
  null: () => 'new Null()',
  rand: () => 'Math.random()',
  second: () => 'arguments[1]',
  third: () => 'arguments[2]',
  this: () => 'this',
};

const tokenFunctionMap = {
  __dir__: (t) => `'${t.getDirName()}'`,
  __file__: (t) => `'${t.getFilename()}'`,
  __line__: (t) => `(${t.getLineNr()})`,
  __pos__: (t) => `(${t.getBegX()})`,
};

const insertBracketAfterEventually = Symbol();

export default class SymbolToken extends Token {
  isBlank() {
    return false;
  }

  isEntity() {
    return true;
  }

  getRegexString() {
    return '[A-Za-z_]+[A-Za-z_0-9]*';
  }

  [insertBracketAfterEventually](tokenizer) {
    tokenizer.resetToThis();
    const previous = tokenizer.getPreviousNotBlank();
    if (
      previous === null ||
      previous.getText() !== OperatorToken.getOperatorDot().getText()
    ) {
      return false;
    }

    tokenizer.resetToThis();
    const next = tokenizer.getNextNotBlank();
    if (
      next !== null &&
      !(
        next instanceof OperatorToken ||
        next.isClosingToken() ||
        next instanceof SquareBracketOpenToken
      )
    ) {
      return false;
    }

    tokenizer.resetToThis();
    tokenizer.insertAfter(BracketToken.getOperatorBracketOpen());
    tokenizer.insertAfter(BracketToken.getOperatorBracketClose());

    return true;
  }

  doConvert(tokenizer) {
    this[insertBracketAfterEventually](tokenizer);
    tokenizer.resetToThis();
    const previous = tokenizer.getPreviousNotBlank();
    if (previous !== null && previous.getOriginalText() === '.') {
      return;
    }
    let func = functionMap[this.originalText];
    if (func) {
      this.text = func.call(this.originalText);
    } else {
      func = tokenFunctionMap[this.originalText];
      if (func) {
        this.text = func.call(this);
      }
    }
  }
}
