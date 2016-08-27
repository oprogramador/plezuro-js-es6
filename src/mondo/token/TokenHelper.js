import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken';

export default class TokenHelper {
  constructor() {
    this.functions = {
      'BracketToken.getOperatorBracketClose': BracketToken.getOperatorBracketClose,
      'BracketToken.matchFunctionEnd': BracketToken.matchFunctionEnd,
    };
  }

  getFunction(name) {
    return this.functions[name];
  }
}
