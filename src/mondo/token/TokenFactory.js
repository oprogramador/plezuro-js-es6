import BiOperatorToken from 'plezuro-js-es6/src/mondo/token/BiOperatorToken';
import BracketCloseToken from 'plezuro-js-es6/src/mondo/token/BracketCloseToken';
import BracketOpenToken from 'plezuro-js-es6/src/mondo/token/BracketOpenToken';
import BracketToken from 'plezuro-js-es6/src/mondo/token/BracketToken';
import ClassFieldToken from 'plezuro-js-es6/src/mondo/token/ClassFieldToken';
import CommentToken from 'plezuro-js-es6/src/mondo/token/CommentToken';
import DeclarationToken from 'plezuro-js-es6/src/mondo/token/DeclarationToken';
import FunctionEndToken from 'plezuro-js-es6/src/mondo/token/FunctionEndToken';
import FunctionToken from 'plezuro-js-es6/src/mondo/token/FunctionToken';
import IndexOperatorToken from 'plezuro-js-es6/src/mondo/token/IndexOperatorToken';
import MultiLineCommentToken from 'plezuro-js-es6/src/mondo/token/MultiLineCommentToken';
import MultiLineToken from 'plezuro-js-es6/src/mondo/token/MultiLineToken';
import NewLineToken from 'plezuro-js-es6/src/mondo/token/NewLineToken';
import NumberToken from 'plezuro-js-es6/src/mondo/token/NumberToken';
import ObjectFieldToken from 'plezuro-js-es6/src/mondo/token/ObjectFieldToken';
import OperatorToken from 'plezuro-js-es6/src/mondo/token/OperatorToken';
import RegexToken from 'plezuro-js-es6/src/mondo/token/RegexToken';
import SquareBracketCloseToken from 'plezuro-js-es6/src/mondo/token/SquareBracketCloseToken';
import SquareBracketOpenToken from 'plezuro-js-es6/src/mondo/token/SquareBracketOpenToken';
import StringToken from 'plezuro-js-es6/src/mondo/token/StringToken';
import SymbolToken from 'plezuro-js-es6/src/mondo/token/SymbolToken';
import Token from 'plezuro-js-es6/src/mondo/token/Token';
import TokenHelper from 'plezuro-js-es6/src/mondo/token/TokenHelper';
import UniOperatorToken from 'plezuro-js-es6/src/mondo/token/UniOperatorToken';
import WhiteSpaceToken from 'plezuro-js-es6/src/mondo/token/WhiteSpaceToken';

export default class TokenFactory {
  constructor() {
    this.tokenClasses = {
      BiOperatorToken,
      BracketCloseToken,
      BracketOpenToken,
      BracketToken,
      ClassFieldToken,
      CommentToken,
      DeclarationToken,
      FunctionEndToken,
      FunctionToken,
      IndexOperatorToken,
      MultiLineCommentToken,
      MultiLineToken,
      NewLineToken,
      NumberToken,
      ObjectFieldToken,
      OperatorToken,
      RegexToken,
      SquareBracketCloseToken,
      SquareBracketOpenToken,
      StringToken,
      SymbolToken,
      Token,
      UniOperatorToken,
      WhiteSpaceToken,
    };
  }

  create(name) {
    return new this.tokenClasses[name]()
      .setFactory(this)
      .setHelper(new TokenHelper());
  }
}
