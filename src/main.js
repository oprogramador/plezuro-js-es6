import Engine from 'plezuro-js-es6/src/mondo/engine/Engine.js';

const engine = new Engine();
const NOT_NEEDED_ARGS_NR = 2;
engine.process(process.argv.splice(NOT_NEEDED_ARGS_NR));
