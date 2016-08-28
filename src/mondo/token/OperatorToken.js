import Token from 'plezuro-js-es6/src/mondo/token/Token.js';
import _ from 'lodash';

const createActiveSubtypes = Symbol();
const createPossibleTokens = Symbol();

export default class OperatorToken extends Token {
  [createActiveSubtypes]() {
    this.activeSubtypes = this.activeSubtypes || [
      this.factory.createFromHash('BiOperatorToken', OperatorToken),
      this.factory.createFromHash('UniOperatorToken', OperatorToken),
    ];

    return this.activeSubtypes;
  }

  [createPossibleTokens]() {
    if (!this.possibleTokens) {
      this.possibleTokens = [];
      this.createActiveSubtypes().forEach((token) => {
        this.possibleTokens =
          this.possibleTokens.concat(token.getOnlyPossibleTokens());
      });
    }

    return this.possibleTokens;
  }

  isBlank() {
    return false;
  }

  isEntity() {
    return false;
  }

  getPossibleTokens() {
    return this.createPossibleTokens();
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
    this.createActiveSubtypes.some((token) => {
      if (_.includes(token.getOnlyPossibleTokens(), tokenText)) {
        result = _.clone(token);

        return true;
      }

      return false;
    });

    return result || new OperatorToken();
  }
}
