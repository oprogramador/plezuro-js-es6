import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

const INITIAL_COUNTER = 1;
const NULL_COUNTER = 1;

const classMap = {
  '#(': 'BracketOpenToken',
  '$(': 'BracketOpenToken',
  '%(': 'BracketOpenToken',
  '(': 'BracketOpenToken',
  ')': 'BracketCloseToken',
  '[': 'SquareBracketOpenToken',
  ']': 'SquareBracketCloseToken',
  '{': 'FunctionToken',
  '}': 'FunctionEndToken',
};

export default class BracketToken extends Token {
  constructor(args) {
    super(args);

    this.functionMap = {
      '#(': () => 'new Dictionary(',
      '$(': this.matchSet,
      '%(': () => 'new AssocArray(',
      '(': () => '(',
      ')': () => ')',
      '[': () => '[',
      ']': () => ']',
      '{': () => '(function () {',
      '}': this.matchFunctionEnd,
    };
  }

  matchSet(tokenizer) {
    tokenizer.getMatchingCloseBracket();
    tokenizer.insertBefore(this.factory.create('BracketCloseToken').setText(']'));

    return 'new Set([';
  }

  matchFunctionEnd(tokenizer) {
    let counter = INITIAL_COUNTER;
    for (
      let token = tokenizer.getPreviousNotBlank();
      token !== null;
      token = tokenizer.getPreviousNotBlank()
    ) {
      if (token.getText() ===
        this.helper.getFunction('OperatorToken.getOperatorSemicolon')()
          .getText()
      ) {
        token.setText('; return ');
        break;
      }
      if (this.factory.is(token, 'FunctionToken')) {
        counter--;
      }
      if (this.factory.is(token, 'FunctionEndToken')) {
        counter++;
      }
      if (counter === NULL_COUNTER) {
        tokenizer.insertAfter(
          this.factory.create('SymbolToken')
            .setText('return ')
        );
        break;
      }
    }
    for (
      let token = tokenizer.getNext();
      token.isBlank();
      token = tokenizer.getNext()
    ) {
      if (this.factory.is(token, 'NewLineToken')) {
        token.setText(' ');
      }
    }

    return '})';
  }

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
    const func = this.functionMap[this.originalText];
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
      this.setRole(this.factory.create('IndexOperatorToken'));
    }
    if (classMap[this.originalText]) {
      return this.factory.create(classMap[this.originalText])
        .copyAll(this);
    }

    return this;
  }
}
