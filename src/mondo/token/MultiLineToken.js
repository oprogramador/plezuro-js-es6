import Token from 'plezuro-js-es6/src/mondo/token/Token.js';
import _ from 'lodash';

const LINE_BEGIN_INDEX = 0;
const MATCH_INDEX = 0;
const NEIGHBOR_OFFSET = 1;

export default class MultiLineToken extends Token {
  getEndRegex() {
    return '';
  }

  constructor(args) {
    super(args);

    this.endLineNr = null;
  }

  getEndLineNr() {
    return this.endLineNr;
  }

  setEndLineNr(value) {
    this.endLineNr = value;

    return this;
  }

  findFromRegex(lines, begLineNr, index) {
    let lineNr = begLineNr;
    let match = this.getRegex().exec(lines[lineNr].substr(index));
    if (match && match.index === index) {
      let tokenText = lines[lineNr].substring(
        match.index,
        match.index + match[MATCH_INDEX].length
      );
      match = this.getEndRegex().exec(tokenText);
      if (match) {
        tokenText = tokenText.substring(
          match.index,
          match.index + match[MATCH_INDEX].length
        );
      } else {
        for (lineNr++; lineNr < lines.length; lineNr++) {
          match = this.getEndRegex().exec(lines[lineNr]);
          if (
            match &&
            match.index >= lineNr === begLineNr
            ? index
            : LINE_BEGIN_INDEX
          ) {
            tokenText += `\t${lines[lineNr].substring(
              match.index,
              match.index + match[MATCH_INDEX].length
            )}`;
            break;
          } else {
            tokenText += `\t${lines[lineNr]}`;
          }
        }
      }
      const token = _.clone(this)
       .setBegX(index)
       .setEndX(
         begLineNr === lineNr
         ? index + match[MATCH_INDEX].length - NEIGHBOR_OFFSET
         : match.index + match[MATCH_INDEX].length - NEIGHBOR_OFFSET
       )
       .setOriginalText(tokenText)
       .setText(tokenText)
       .setLineNr(begLineNr)
       .setEndLineNr(lineNr);

      return token;
    }

    return null;
  }
}
