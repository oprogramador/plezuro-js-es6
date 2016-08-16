import InvalidTokenException from
  'plezuro-js-es6/src/mondo/invalidToken/InvalidTokenException.js';
import OperatorAfterBracketCloseException from
  'plezuro-js-es6/src/mondo/invalidToken/OperatorAfterBracketCloseException.js';
import OperatorAfterBracketOpenException from
  'plezuro-js-es6/src/mondo/invalidToken/OperatorAfterBracketOpenException.js';
import OperatorAfterOperatorException from
  'plezuro-js-es6/src/mondo/invalidToken/OperatorAfterOperatorException.js';
import OperatorBeforeBracketCloseException from
  'plezuro-js-es6/src/mondo/invalidToken/OperatorBeforeBracketCloseException.js';
import ValueAfterValueException from
  'plezuro-js-es6/src/mondo/invalidToken/ValueAfterValueException.js';

const checkForOperatorAfterOperator = Symbol();
const checkValueAfterValue = Symbol();
const checkAfterBracketOpen = Symbol();
const checkBeforeBracketClose = Symbol();
const checkAfterBracketClose = Symbol();
const checkBracketStack = Symbol();

export default class Validator {
  [checkForOperatorAfterOperator]() {
    for (let token = this.tokenizer.hardReset(); token !== null;) {
      const next = this.tokenizer.getNextNotBlank();
      if (next === null) {
        return;
      }
      if (token.isBiOperatorToken() && next.isBiOperatorToken()) {
        if (!token.isArithmetic() || !next.isAllowedAtBegin()) {
          throw InvalidTokenException.create(
            OperatorAfterOperatorException,
            next.getFullFilename(),
            next.getLineNr(),
            next.getBegX()
          );
        }
      }
      token = next;
    }
  }

  [checkValueAfterValue]() {
    for (let token = this.tokenizer.hardReset(); token !== null;) {
      const next = this.tokenizer.getNextNotBlank();
      if (next === null) {
        return;
      }
      if (token.isEntity() && next.isEntity()) {
        throw InvalidTokenException.create(
          ValueAfterValueException,
          next.getFullFilename(),
          next.getLineNr(),
          next.getBegX()
        );
      }
      token = next;
    }
  }

  [checkAfterBracketOpen]() {
    for (let token = this.tokenizer.hardReset(); token !== null;) {
      const next = this.tokenizer.getNextNotBlank();
      if (next === null) {
        return;
      }
      if (
        token.isOpeningToken() &&
        next.isBiOperatorToken() &&
          !next.isAllowedAtBegin()
      ) {
        throw InvalidTokenException.create(
          OperatorAfterBracketOpenException,
          next.getFullFilename(),
          next.getLineNr(),
          next.getBegX()
        );
      }
      token = next;
    }
  }

  [checkBeforeBracketClose]() {
    for (let token = this.tokenizer.hardReset(); token !== null;) {
      const next = this.tokenizer.getNextNotBlank();
      if (next === null) {
        return;
      }
      if (
        token.isBiOperatorToken() &&
        !token.isDelimiter() &&
        next.isClosingToken()
      ) {
        throw InvalidTokenException.create(
          OperatorBeforeBracketCloseException,
          next.getFullFilename(),
          next.getLineNr(),
          next.getBegX()
        );
      }
      token = next;
    }
  }

  [checkAfterBracketClose]() {
    for (let token = this.tokenizer.hardReset(); token !== null;) {
      const next = this.tokenizer.getNextNotBlank();
      if (next === null) {
        return;
      }
      if (token.isClosingToken() && next.isEntity()) {
        throw InvalidTokenException.create(
          OperatorAfterBracketCloseException,
          next.getFullFilename(),
          next.getLineNr(),
          next.getBegX()
        );
      }
      token = next;
    }
  }

  [checkBracketStack]() {

  }

  constructor(tokenizer) {
    this.tokenizer = tokenizer;
  }

  process() {
    this[checkForOperatorAfterOperator]();
    this[checkValueAfterValue]();
    this[checkBracketStack]();
    this[checkAfterBracketOpen]();
    this[checkBeforeBracketClose]();
    this[checkAfterBracketClose]();
  }
}
