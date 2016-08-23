import NotImplementedException from
  'plezuro-js-es6/src/mondo/exception/NotImplementedException.js';
import SymbolToken from 'plezuro-js-es6/src/mondo/token/SymbolToken.js';
import _ from 'lodash';

const NULL_COUNTER = 0;
const INCREMENT_UNIT = 1;

const addToMap = (map, object, unit) => {
  if (map.has(object)) {
    map.set(object, map.get(object) + unit);
  } else {
    map.set(object, unit);
  }
};

const incrementMap = (map, object) => addToMap(map, object, INCREMENT_UNIT);

const decrementMap = (map, object) => addToMap(map, object, -INCREMENT_UNIT);

const allEqualsZero = (map) => _.every(map.values(), (value) => value === NULL_COUNTER);

export default class AbstractTokenizer {
  constructor() {
    this.finished = false;
  }

  finish() {
    this.finished = true;
  }

  isFinished() {
    return this.finished;
  }

  getTokens() {
    throw new NotImplementedException();
  }

  resetToThis() {
    throw new NotImplementedException();
  }

  getCurrent() {
    throw new NotImplementedException();
  }

  getNext() {
    throw new NotImplementedException();
  }

  getPrevious() {
    throw new NotImplementedException();
  }

  getNextNotBlank() {
    for (let token = this.getNext(); token !== null; token = this.getNext()) {
      if (!token.isBlank()) {
        return token;
      }
    }

    return null;
  }

  getPreviousNotBlank() {
    for (
      let token = this.getPrevious();
      token !== null;
      token = this.getPrevious()
    ) {
      if (!token.isBlank()) {
        return token;
      }
    }

    return null;
  }

  insertAfter() {
    throw new NotImplementedException();
  }

  insertBefore(token) {
    this.getPrevious();
    this.insertAfter(token);
  }

  getNextAtSameBracketLevel() {
    const map = new Map();
    for (
      let token = this.getCurrent();
      token !== null;
      token = this.getNextNotBlank()
    ) {
      if (token.isOpeningToken()) {
        incrementMap(map, token.getClass());
      } else if (token.isClosingToken()) {
        decrementMap(map, token.getOpenClass());
      }
      if (allEqualsZero(map)) {
        return this.getNextNotBlank();
      }
    }

    return null;
  }

  getMatchingCloseBracket() {
    if (!this.getCurrent().isOpeningToken()) {
      return null;
    }

    const neededClass = this.getCurrent().getClass();
    let counter = INCREMENT_UNIT;
    for (
      let token = this.getNextNotBlank();
      token !== null;
      token = this.getNextNotBlank()
    ) {
      if (neededClass.isInstance(token)) {
        counter++;
      }
      if (token.isClosingToken() && token.getOpenClass() === neededClass) {
        counter--;
      }
      if (counter === NULL_COUNTER) {
        return token;
      }
    }

    return null;
  }

  getLastGroup() {
    let counter = NULL_COUNTER;
    const result = [];
    for (
      let token = this.getCurrent();
      token !== null;
      token = this.getPreviousNotBlank()
    ) {
      result.push(_.clone(token));
      if (token.isClosingToken()) {
        counter++;
      } else if (token.isOpeningToken()) {
        counter--;
      }
      if (counter === NULL_COUNTER) {
        break;
      }
    }
    const previous = this.getPreviousNotBlank();
    if (previous instanceof SymbolToken) {
      result.push(_.clone(previous));
    }
    result.reverse();

    return result;
  }
}
