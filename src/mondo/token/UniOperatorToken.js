import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken.js';
import OperatorToken from 'plezuro-js-es6/src/mondo/token/OperatorToken.js';

const operatorsToOverload = new Set([
  '~',
]);

const functionMap = {
  '@': () => "arguments[0][(new String('fields'))]",
};

export default class UniOperatorToken extends OperatorToken {
  getOnlyPossibleTokens() {
    return [
      '!',
      '&&',
      '**',
      '#',
      '++',
      '--',
      '~',
      '=>',
    ];
  }

  matchOperatorMethod(tokenizer) {
    const func = functionMap[this.originalText];
    if (func) {
      this.text = func.call(tokenizer);
    }
    if (!operatorsToOverload.has(tokenizer.getCurrent().getOriginalText())) {
      return;
    }
    tokenizer.getCurrent().setText(`['${tokenizer.getCurrent().getOriginalText()}'](`);
    tokenizer.insertAfter(BracketToken.getOperatorBracketClose());
  }
}
