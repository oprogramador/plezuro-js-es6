import BracketCloseToken from 'plezuro-js-es6/src/mondo/token/BracketCloseToken';
import BracketOpenToken from 'plezuro-js-es6/src/mondo/token/BracketOpenToken';
import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken';
import OperatorToken from 'plezuro-js-es6/src/mondo/token/OperatorToken';

export default class TokenHelper {
  constructor() {
    this.functions = {
      'BracketToken.getOperatorBracketClose': () => new BracketCloseToken().setText(')'),
      'BracketToken.getOperatorBracketOpen': () => new BracketOpenToken().setText('('),
      'BracketToken.matchFunctionEnd': BracketToken.matchFunctionEnd,
      'OperatorToken.getOperatorDot': () => new OperatorToken().setText('.'),
      'OperatorToken.getOperatorSemicolon': () => new OperatorToken().setText(';'),
    };
  }

  getFunction(name) {
    return this.functions[name];
  }
}
