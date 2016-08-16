import Parser from 'plezuro-js-es6/src/mondo/engine/Parser.js';

const LIST_START_INDEX = 0;
const NEXT_INDEX_OFFSET = 1;
const GROUP_SIZE = 2;

export default class Engine {
  process(args) {
    for (let i = LIST_START_INDEX; i < args.length; i += GROUP_SIZE) {
      const parser = new Parser(args[i], args[i + NEXT_INDEX_OFFSET]);
      parser.process();
    }
  }
}
