import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken.js';
import ClassFieldToken from 'plezuro-js-es6/src/mondo/token/ClassFieldToken.js';
import CommentToken from 'plezuro-js-es6/src/mondo/token/CommentToken.js';
import DeclarationToken from
  'plezuro-js-es6/src/mondo/token/DeclarationToken.js';
import InvalidTokenException from
  'plezuro-js-es6/src/mondo/invalidToken/InvalidTokenException.js';
import MultiLineCommentToken from
  'plezuro-js-es6/src/mondo/token/MultiLineCommentToken.js';
import NewLineToken from 'plezuro-js-es6/src/mondo/token/NewLineToken.js';
import NonExistentTokenException from
  'plezuro-js-es6/src/mondo/invalidToken/NonExistentTokenException.js';
import NumberToken from 'plezuro-js-es6/src/mondo/token/NumberToken.js';
import ObjectFieldToken from
  'plezuro-js-es6/src/mondo/token/ObjectFieldToken.js';
import OperatorToken from 'plezuro-js-es6/src/mondo/token/OperatorToken.js';
import RegexToken from 'plezuro-js-es6/src/mondo/token/RegexToken.js';
import StringToken from 'plezuro-js-es6/src/mondo/token/StringToken.js';
import SymbolToken from 'plezuro-js-es6/src/mondo/token/SymbolToken.js';
import Token from 'plezuro-js-es6/src/mondo/token/Token.js';
import WhiteSpaceToken from 'plezuro-js-es6/src/mondo/token/WhiteSpaceToken.js';
import path from 'path';

const LIST_START_INDEX = 0;
const MIN_TOKENS_NR = 1;
const NEXT_INDEX_OFFSET = 1;

export default class Tokenizer {
  constructor(filename, lines) {
    this.filename = filename;
    this.lines = lines;
    this.tokenTypes = [
      new CommentToken(),
      new MultiLineCommentToken(),
      new RegexToken(),
      new BracketToken(),
      new NumberToken(),
      new DeclarationToken(),
      new ClassFieldToken(),
      new ObjectFieldToken(),
      new WhiteSpaceToken(),
      new OperatorToken(),
      new SymbolToken(),
      new StringToken(),
    ];
    this.hardTokenIndex = 0;
    this.tokenIndex = 0;
  }

  process() {
    Token.setStaticFilename(path.resolve(this.filename));
    for (let i = LIST_START_INDEX; i < this.lines.length; i++) {
      let index = LIST_START_INDEX;
      while (index < this.lines[i].length) {
        const oldIndex = index;
        for (let k = LIST_START_INDEX; k < this.tokenTypes.length; k++) {
          const tokenType = this.tokenTypes[k];
          const token = tokenType.setFilename(this.filename).find({
            index,
            lineNr: i,
            lines: this.lines,
            previousToken:
              this.tokens.length > NEXT_INDEX_OFFSET
              ? this.tokens[this.tokens.length - NEXT_INDEX_OFFSET]
              : null,
          });
          if (token) {
            index = token.getEndX() + NEXT_INDEX_OFFSET;
            i = token.getEndLineNr();
            this.tokens.push(token);
            break;
          }
        }
        if (oldIndex === index) {
          throw InvalidTokenException.create({
            aClass: NonExistentTokenException,
            filename: this.filename,
            lineNr: i,
            position: index
          });
        }
      }
      this.tokens.push(
        new NewLineToken(i, this.lines[i].length)
          .setFilename(this.filename)
      );
    }
  }

  hardNext() {
    this.hardTokenIndex++;
    this.tokenIndex = this.hardTokenIndex;
    if (this.tokenIndex < this.tokens.length) {
      return this.tokens[this.tokenIndex];
    }

    return null;
  }

  hardReset() {
    this.finished = false;
    this.hardTokenIndex = 0;
    this.tokenIndex = this.hardTokenIndex;
    if (this.tokens.length < MIN_TOKENS_NR) {
      return null;
    }

    return this.tokens[this.tokenIndex];
  }

  reset() {
    this.tokenIndex = 0;
    if (this.tokens.length < MIN_TOKENS_NR) {
      return null;
    }

    return this.tokens[this.tokenIndex];
  }

  resetToThis() {
    this.tokenIndex = this.hardTokenIndex;

    return this.tokens[this.tokenIndex];
  }

  getPrevious() {
    this.tokenIndex--;
    if (this.tokenIndex >= NEXT_INDEX_OFFSET) {
      return this.tokens[this.tokenIndex];
    }

    return null;
  }

  insertAfter(token) {
    this.tokens.splice(this.tokenIndex + NEXT_INDEX_OFFSET, token);
    if (this.tokenIndex + NEXT_INDEX_OFFSET <= this.hardTokenIndex) {
      this.hardTokenIndex++;
    }
    this.tokenIndex++;
  }

  getTokens() {
    return this.tokens;
  }

  replaceToken(token) {
    this.tokens[this.tokenIndex] = token;
  }
}
