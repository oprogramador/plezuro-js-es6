import _ from 'lodash';

export default class Engine {
  process(args) {
    _.times(args.length, (i) => i);
  }
}
