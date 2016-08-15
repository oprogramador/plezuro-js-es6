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
}
