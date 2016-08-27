import Token from 'plezuro-js-es6/src/mondo/token/Token.js';
import _ from 'lodash';

export default class OperatorToken extends Token {
  constructor(args) {
    super(args);

    this.activeSubtypes = [
      this.factory.create('BiOperatorToken'),
      this.factory.create('UniOperatorToken'),
    ];

    this.possibleTokens = [];
    this.activeSubtypes.forEach((token) => {
      this.possibleTokens = this.possibleTokens.concat(token.getOnlyPossibleTokens());
    });
  }

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
    return this.possibleTokens;
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
    this.activeSubtypes.some((token) => {
      if (_.includes(token.getOnlyPossibleTokens(), tokenText)) {
        result = _.clone(token);

        return true;
      }

      return false;
    });

    return result || new OperatorToken();
  }
}
