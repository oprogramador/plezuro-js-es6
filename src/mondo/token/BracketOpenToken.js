import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken.js';
import OperatorToken from 'plezuro-js-es6/src/mondo/token/OperatorToken.js';
import SymbolToken from 'plezuro-js-es6/src/mondo/token/SymbolToken.js';

const insertFunctionCallEventually = Symbol();

export default class BracketOpenToken extends BracketToken {
  isOpeningToken() {
    return true;
  }

  [insertFunctionCallEventually](tokenizer) {
    tokenizer.resetToThis();
    const previous = tokenizer.getPreviousNotBlank();
    if (
      previous === null ||
      previous.isOpeningToken() ||
      previous instanceof OperatorToken
    ) {
      return false;
    }
    const preprevious = tokenizer.getPreviousNotBlank();
    if (
      preprevious !== null &&
      preprevious.getText() === '.'
    ) {
      return false;
    }

    tokenizer.resetToThis();
    tokenizer.insertBefore(new SymbolToken().setText('.call'));

    return true;
  }

  doConvert(tokenizer) {
    super.doConvert(tokenizer);
    tokenizer.resetToThis();
    insertFunctionCallEventually(tokenizer);
  }
}
