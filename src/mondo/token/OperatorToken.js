import BiOperatorToken from 'plezuro-js-es6/src/mondo/token/BiOperatorToken.js';
import Token from 'plezuro-js-es6/src/mondo/token/Token.js';
import UniOperatorToken from 'plezuro-js-es6/src/mondo/token/UniOperatorToken.js';
import _ from 'lodash';

const activeSubtypes = [
  new BiOperatorToken(),
  new UniOperatorToken(),
];

let possibleTokens = null;
const init = () => {
  possibleTokens = [];
  activeSubtypes.forEach((token) => {
    possibleTokens = possibleTokens.concat(token.getOnlyPossibleTokens());
  });
};
init();

export default class OperatorToken extends Token {
  isBlank() {
    return false;
  }

  isEntity() {
    return false;
  }

  static getOperatorDot() {
    return new OperatorToken().setText('.');
  }

  static getOperatorSemicolon() {
    return new OperatorToken().setText(';');
  }

  getPossibleTokens() {
    return possibleTokens;
  }

  getOnlyPossibleTokens() {
    return [];
  }

  getFunctionMap() {
    return {};
  }

  matchOperatorMethod() {
  }

  doConvert(tokenizer) {
    try {
      this.text = this.getFunctionMap()[this.originalText].call(this.originalText);
    } catch (e) {
      this.matchOperatorMethod(tokenizer);
    }
  }

  getObjectOfSuitableSubclass(tokenText) {
    let result = null;
    activeSubtypes.some((token) => {
      if (_.includes(token.getOnlyPossibleTokens(), tokenText)) {
        result = _.clone(token);

        return true;
      }

      return false;
    });

    return result || new OperatorToken();
  }
}
