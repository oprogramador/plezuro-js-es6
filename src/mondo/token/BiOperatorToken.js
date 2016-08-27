import OperatorToken from 'plezuro-js-es6/src/mondo/token/OperatorToken.js';

const INITIAL_ORDER = -1;
const MAX_ORDER_FACTOR = 2;
const STRING_BEGIN_INDEX = 0;
const COMPOSITE_OPERATOR_EQUALS_SIGN_LENGTH = 1;

const delimiterTokens = new Set([
  ';',
  ',',
]);

const tokensAllowedAtBegin = new Set([
  '+',
  '-',
]);

const compositeOperators = new Set([
  '+=',
  '-=',
  '*=',
  '/=',
  '^=',
  '&=',
  '|=',
  '%=',
  '.=',
]);

const arithmeticTokens = new Set([
  '+',
  '-',
  '%',
  '*',
  '/',
  '^',
  '.',
]);

const possibleTokens = new Set([
  ';',
  ',',
  ':=',
  '=',
  '+=',
  '-=',
  '*=',
  '/=',
  '^=',
  '&=',
  '|=',
  '%=',
  '.=',
  '~~',
  '<->',
  '<<',
  '>>',
  '?',
  '|',
  '&',
  '<=>',
  '>=',
  '>',
  '<=',
  '<',
  '!=',
  '==',
  '!==',
  '===',
  '=~',
  '!~',
  '+',
  '-',
  '%',
  '*',
  '/',
  '^',
  '^^',
  '.',
  '..',
  ':',
]);

const operatorsToOverload = new Set([
  '<<',
  '>>',
  '|',
  '&',
  '=~',
  '!~',
  '+',
  '-',
  '%',
  '*',
  '/',
  '^',
  '..',
  ':',
  '?',
]);

let operatorOrder = null;

const init = () => {
  operatorOrder = new Map();
  possibleTokens.forEach((token, i) => operatorOrder.set(i, token));
};
init();

export default class BiOperatorToken extends OperatorToken {
  constructor(args) {
    super(args);

    this.order = INITIAL_ORDER;
  }

  setOrder(value) {
    this.order = value;

    return this;
  }

  getOrder() {
    if (this.order !== INITIAL_ORDER) {
      return this.order;
    }

    return this.operatorOrder.get(this.originalText);
  }

  getOnlyPossibleTokens() {
    return this.possibleTokens;
  }

  isArithmetic() {
    return arithmeticTokens.has(this.originalText);
  }

  isAllowedAtBegin() {
    return tokensAllowedAtBegin.has(this.originalText);
  }

  isDelimiter() {
    return delimiterTokens.has(this.originalText);
  }

  getOrderMaxNumber() {
    return possibleTokens.size * MAX_ORDER_FACTOR;
  }

  getFunctionMap() {
    return {};
  }

  replaceComposeOperator(tokenizer) {
    let operator = tokenizer.getCurrent().getOriginalText();
    operator = operator.substring(
      STRING_BEGIN_INDEX,
      operator.length - COMPOSITE_OPERATOR_EQUALS_SIGN_LENGTH
    );
    tokenizer.getCurrent().setText('=');
    tokenizer.getPreviousNotBlank();
    const group = tokenizer.getLastGroup();
    tokenizer.resetToThis();
    group.forEach((token) => tokenizer.insertAfter(token));
    tokenizer.insertAfter(
      new BiOperatorToken().setOriginalText(operator).setOrder(this.getOrder())
    );
  }

  preConvert(tokenizer) {
    if (compositeOperators.has(tokenizer.getCurrent().getOriginalText())) {
      this.replaceComposeOperator(tokenizer);
    }
  }

  matchOperatorMethod(tokenizer) {
    if (!operatorsToOverload.has(tokenizer.getCurrent().getOriginalText())) {
      return;
    }
    const myOrder = tokenizer.getCurrent().getOrder();
    tokenizer.getCurrent().setText(`['${tokenizer.getCurrent().getOriginalText()}'](`);
    for (
      let token = tokenizer.getNextAtSameBracketLevel();
      token !== null;
      token = tokenizer.getNextAtSameBracketLevel()
    ) {
      if (
        token.isClosingToken ||
        (
          token instanceof BiOperatorToken &&
          token.getOrder() <= myOrder
        )
      ) {
        tokenizer.insertBefore(this.helper.getFunction('BracketToken.getOperatorBracketClose')());

        return;
      }
    }
    tokenizer.insertBefore(this.helper.getFunction('BracketToken.getOperatorBracketClose')());
  }
}
