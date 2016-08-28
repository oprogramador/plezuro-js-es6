import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken.js';
import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

const binToHex = Symbol();
const BIN_BASE = 2;
const DECIMAL_BASE = 10;
const BI_IN_HEX = 4;
const ONE = 1;
const ZERO = 0;
const HEX_SYMBOL_LENGTH = 3;

export default class NumberToken extends Token {
  isBlank() {
    return false;
  }

  isEntity() {
    return true;
  }

  getRegexString() {
    return '(0x[0-9a-f]+)|(0b[01]+)|(0[0-7]+)|([0-9]+(\\.[0-9]+)?(e[\\+\\-]?[0-9]+)?)';
  }

  [binToHex](text) {
    let result = '';
    for (let i = this.text.length - ONE; i >= ZERO; i -= BI_IN_HEX) {
      let digit = this.text.charCodeAt(i) - '0'.charCodeAt();
      for (let k = ONE; k < BI_IN_HEX - ONE; k++) {
        if (i - k >= ZERO) {
          digit += Math.pow(BIN_BASE, k) * (text.charAt(i - k) - '0');
        }
      }
      result = String.fromCharCode(
        digit < DECIMAL_BASE
        ? '0'.charCodeAt() + digit
        : 'a'.charCodeAt() + digit - DECIMAL_BASE
      ) + result;
    }

    return result;
  }

  eventuallyConvertBinary() {
    if (this.getText().length < HEX_SYMBOL_LENGTH || this.getText()[ONE] !== 'b') {
      return;
    }
    this.setText(`0x${this[binToHex](this.getText().substring(BIN_BASE))}`);
  }

  doConvert(tokenizer) {
    this.eventuallyConvertBinary();
    tokenizer.insertBefore(
      BracketToken.getOperatorBracketOpen()
      .setText('(new Number(')
    );
    tokenizer.resetToThis();
    tokenizer.insertAfter(BracketToken.getOperatorBracketClose().setText('))'));
  }
}
