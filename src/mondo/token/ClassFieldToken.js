import Token from 'plezuro-js-es6/src/mondo/token/Token.js';

export default class ClassFieldToken extends Token {
  isBlank() {
    return false;
  }

  isEntity() {
    return true;
  }

  getRegex() {
    return '[A-Za-z_]+[A-Za-z_0-9]*::[A-Za-z_]+[A-Za-z_0-9]*';
  }

  doConvert() {
    const split = this.text.split('::');
    this.setText(`${split[0]}['fields']['split[1]']`);
  }
}
