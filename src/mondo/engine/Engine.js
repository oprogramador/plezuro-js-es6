import Parser from 'plezuro-js-es6/src/mondo/engine/Parser.js';
import _ from 'lodash';

export default class Engine {
  process(args) {
    _.times(args.length, (i) => {
      const NEXT_INDEX_OFFSET = 1,
        parser = new Parser();

      parser.process(args[i], args[i + NEXT_INDEX_OFFSET]);
    });
  }
}
