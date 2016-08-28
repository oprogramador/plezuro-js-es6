import OperatorToken from 'plezuro-js-es6/src/mondo/token/OperatorToken.js';
import SymbolToken from 'plezuro-js-es6/src/mondo/token/SymbolToken.js';
import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

const DECLARATION_SYMBOL_LENGTH = 1;

export default class DeclarationToken extends Token {
  isBlank() {
    return false;
  }

  isEntity() {
    return true;
  }

  getRegexString() {
    return '\\$[A-Za-z_]+[A-Za-z_0-9]*';
  }

  doConvert(tokenizer) {
    tokenizer.insertBefore(new SymbolToken().setText(
      `var ${this.originalText.substring(DECLARATION_SYMBOL_LENGTH)}`
    ));
    tokenizer.insertAfter(new OperatorToken().setText(';'));
    this.setText(this.originalText.substring(DECLARATION_SYMBOL_LENGTH));
  }
}
