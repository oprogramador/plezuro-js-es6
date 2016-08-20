import BracketCloseToken from 'plezuro-js-es6/src/mondo/token/BracketCloseToken.js';
import BracketOpenToken from 'plezuro-js-es6/src/mondo/token/BracketOpenToken.js';
import FunctionEndToken from 'plezuro-js-es6/src/mondo/token/FunctionEndToken.js';
import FunctionToken from 'plezuro-js-es6/src/mondo/token/FunctionToken.js';
import IndexOperatorToken from 'plezuro-js-es6/src/mondo/token/IndexOperatorToken.js';
import NewLineToken from 'plezuro-js-es6/src/mondo/token/NewLineToken.js';
import OperatorToken from 'plezuro-js-es6/src/mondo/token/OperatorToken.js';
import SquareBracketCloseToken from 'plezuro-js-es6/src/mondo/token/SquareBracketCloseToken.js';
import SquareBracketOpenToken from 'plezuro-js-es6/src/mondo/token/SquareBracketOpenToken.js';
import SymbolToken from 'plezuro-js-es6/src/mondo/token/SymbolToken.js';
import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

const INITIAL_COUNTER = 1;
const NULL_COUNTER = 1;

const matchSet = (tokenizer) => {
  tokenizer.getMatchingCloseBracket();
  tokenizer.insertBefore(new BracketCloseToken().setText(']'));

  return 'new Set([';
};

const matchDictionary = () => 'new Dictionary(';

const matchAssociativeArray = () => 'new AssocArray(';

const matchFunctionBegin = () => '(function () {';

const matchFunctionEnd = (tokenizer) => {
  let counter = INITIAL_COUNTER;
  for (
    let token = tokenizer.getPreviousNotBlank();
    token !== null;
    token = tokenizer.getPreviousNotBlank()
  ) {
    if (token.getText() === OperatorToken.getOperatorSemicolon().getText()) {
      token.setText('; return ');
      break;
    }
    if (token instanceof FunctionToken) counter--;
    if (token instanceof FunctionEndToken) counter++;
    if (counter === NULL_COUNTER) {
      tokenizer.insertAfter(new SymbolToken().setText('return '));
      break;
    }
  }
  for (
    let token = tokenizer.getNext();
    token.isBlank();
    token = tokenizer.getNext()
  ) {
    if (token instanceof NewLineToken) token.setText(' ');
  }

  return '})';
};

const classMap = {
  '#(': BracketOpenToken,
  '$(': BracketOpenToken,
  '%(': BracketOpenToken,
  '(': BracketOpenToken,
  ')': BracketCloseToken,
  '[': SquareBracketOpenToken,
  ']': SquareBracketCloseToken,
  '{': FunctionToken,
  '}': FunctionEndToken,
};

const functionMap = {
  '#(': matchDictionary,
  '$(': matchSet,
  '%(': matchAssociativeArray,
  '(': () => '(',
  ')': () => ')',
  '[': () => '[',
  ']': () => ']',
  '{': matchFunctionBegin,
  '}': matchFunctionEnd,
};

export default class BracketToken extends Token {
  setRole(token) {
    this.role = token;

    return this;
  }

  isBlank() {
    return false;
  }

  isEntity() {
    return false;
  }

  static getOperatorBracketOpen() {
    return new BracketOpenToken().setText('(');
  }

  static getOperatorBracketClose() {
    return new BracketCloseToken().setText(')');
  }

  getPossibleTokens() {
    return [
      '[',
      ']',
      '(',
      ')',
      '{',
      '}',
      '#(',
      '$(',
      '%(',
    ];
  }

  doConvert(tokenizer) {
    const func = functionMap[this.originalText];
    if (typeof func === 'function') {
      this.text = func.call(tokenizer);
    }
  }

  eventuallyChangeType(tokenizer) {
    const previous = tokenizer.getPrevious();
    if (
      this.originalText === '[' &&
      previous !== null &&
      previous.isEntity()
    ) {
      this.setRole(new IndexOperatorToken());
    }
    if (classMap[this.originalText]) {
      const Class = classMap[this.originalText];

      return new Class().copyAll(this);
    }

    return this;
  }
}
