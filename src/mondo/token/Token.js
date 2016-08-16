let staticFilename = null;

export default class Token {
  isPossibleAfterPrevious() {
    return true;
  }

  find(args) {
    if (!this.isPossibleAfterPrevious(args.previousToken)) {
      return null;
    }
    try {
      return this.findFromRegex(args.lines, args.lineNr, args.index);
    } catch (e) {
      return this.findFromList(args.lines, args.lineNr, args.index);
    }
  }

  convert() {

  }

  preConvert() {

  }

  getOriginalText() {
    return '';
  }

  getFullFilename() {
    return this.filename || staticFilename;
  }

  getFilename() {
    return this.filename;
  }

  setFilename(value) {
    this.filename = value;

    return this;
  }

  static setStaticFilename(value) {
    staticFilename = value;
  }
}
