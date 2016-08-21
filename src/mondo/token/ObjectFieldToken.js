import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

const OBJECT_FIELD_SYMBOL_LENGTH = 1;

export default class ObjectFieldToken extends Token {
  isBlank() {
    return false;
  }

  isEntity() {
    return true;
  }

  getRegex() {
    return '@[A-Za-z_]+[A-Za-z_0-9]*';
  }

  doConvert() {
    this.setText(`this['fields']['${this.text.substring(OBJECT_FIELD_SYMBOL_LENGTH)}']`);
  }
}
