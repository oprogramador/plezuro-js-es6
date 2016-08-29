import BracketStackException from
  'plezuro-js-es6/src/mondo/invalidToken/BracketStackException.js';
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
      if (
        this.tokenFactory.is(token, 'BiOperatorToken') &&
        this.tokenFactory.is(next, 'BiOperatorToken')
      ) {
        if (!token.isArithmetic() || !next.isAllowedAtBegin()) {
          throw InvalidTokenException.create({
            aClass: OperatorAfterOperatorException,
            filename: next.getFullFilename(),
            lineNr: next.getLineNr(),
            position: next.getBegX(),
            tokenFactory: this.tokenFactory,
          });
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
        throw InvalidTokenException.create({
          aClass: ValueAfterValueException,
          filename: next.getFullFilename(),
          lineNr: next.getLineNr(),
          position: next.getBegX(),
          tokenFactory: this.tokenFactory,
        });
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
        throw InvalidTokenException.create({
          aClass: OperatorAfterBracketOpenException,
          filename: next.getFullFilename(),
          lineNr: next.getLineNr(),
          position: next.getBegX(),
          tokenFactory: this.tokenFactory,
        });
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
        throw InvalidTokenException.create({
          aClass: OperatorBeforeBracketCloseException,
          filename: next.getFullFilename(),
          lineNr: next.getLineNr(),
          position: next.getBegX(),
          tokenFactory: this.tokenFactory,
        });
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
        throw InvalidTokenException.create({
          aClass: OperatorAfterBracketCloseException,
          filename: next.getFullFilename(),
          lineNr: next.getLineNr(),
          position: next.getBegX(),
          tokenFactory: this.tokenFactory,
        });
      }
      token = next;
    }
  }

  [checkBracketStack]() {
    const stack = [];
    for (
      let token = this.tokenizer.hardReset();
      token !== null;
      token = this.tokenizer.getNextNotBlank()
    ) {
      if (token.isOpeningToken()) {
        stack.push(token);
      } else if (token.isClosingToken()) {
        try {
          const pop = stack.pop();
          if (token.getOpenClass() !== pop.getClass()) {
            throw InvalidTokenException.create({
              aClass: BracketStackException,
              extraMessage: `unexpected ${token.getOriginalText()}`,
              filename: token.getFullFilename(),
              lineNr: token.getLineNr(),
              position: token.getBegX(),
              tokenFactory: this.tokenFactory,
            });
          }
        } catch (e) {
          throw InvalidTokenException.create({
            aClass: BracketStackException,
            extraMessage: `empty bracket stack - unexpected ${token.getOriginalText()}`,
            filename: token.getFullFilename(),
            lineNr: token.getLineNr(),
            position: token.getBegX(),
            tokenFactory: this.tokenFactory,
          });
        }
      }
    }
    if (stack.length) {
      const token = this.tokenizer.getPrevious();
      throw InvalidTokenException.create({
        aClass: BracketStackException,
        extraMessage: 'not empty bracket stack at the end',
        filename: token.getFullFilename(),
        lineNr: token.getLineNr(),
        position: token.getBegX(),
        tokenFactory: this.tokenFactory,
      });
    }
  }

  constructor(tokenizer, tokenFactory) {
    this.tokenizer = tokenizer;
    this.tokenFactory = tokenFactory;
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
