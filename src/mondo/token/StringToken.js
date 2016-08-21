import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken.js';
import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

export default class StringToken extends Token {
  isBlank() {
    return false;
  }

  isEntity() {
    return true;
  }

  getRegex() {
    return "('')|('.*?([^\\\\]|(\\\\\\\\))')|(\"\")|(\".*?([^\\\\]|(\\\\\\\\))\")";
  }

  doConvert(tokenizer) {
    tokenizer.insertBefore(BracketToken.getOperatorBracketOpen().setText('(new String('));
    tokenizer.resetToThis();
    tokenizer.insertAfter(BracketToken.getOperatorBracketClose().setText('))'));
  }
}
