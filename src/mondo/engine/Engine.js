import Parser from 'plezuro-js-es6/src/mondo/engine/Parser.js';

export default class Engine {
  process(args) {
    const NEXT_INDEX_OFFSET = 1;
    const GROUP_SIZE = 2;
    for (let i = 0; i < args.length; i += GROUP_SIZE) {
      const parser = new Parser(args[i], args[i + NEXT_INDEX_OFFSET]);
      parser.process();
    }
  }
}
