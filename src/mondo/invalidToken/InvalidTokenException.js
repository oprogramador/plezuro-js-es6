import SymbolToken from 'plezuro-js-es6/src/mondo/token/SymbolToken.js';

export default class InvalidTokenException {
  static create(args) {
    const AClass = args.aClass;
    const result = new AClass()
      .setLineNr(args.lineNr)
      .setPosition(args.position)
      .setFilename(args.filename)
      .setExtraMessage(args.extraMessage);

    return result;
  }

  getTokens() {
    const className = this.constructor.name;

    return [
      new SymbolToken()
        .setText(`throw InvalidTokenException.create(
          '${className}',
          '${this.filename}',
          ${this.lineNr},
          ${this.position},
          '${this.getMessage()}'
        );`)
    ];
  }

  getExtraMessage() {
    return this.extraMessage;
  }

  setExtraMessage(value) {
    this.extraMessage = value;

    return this;
  }

  getFilename() {
    return this.filename;
  }

  setFilename(value) {
    this.filename = value;

    return this;
  }

  getLineNr() {
    return this.lineNr;
  }

  setLineNr(value) {
    this.lineNr = value;

    return this;
  }

  getPosition() {
    return this.position;
  }

  setPosition(value) {
    this.position = value;

    return this;
  }

  getMessage() {
    return JSON.stringify(this);
  }
}
