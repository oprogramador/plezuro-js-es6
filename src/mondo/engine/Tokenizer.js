export default class Tokenizer {
  constructor() {

  }

  process() {

  }

  getTokens() {
    return [];
  }

  hardNext() {
    const TOKEN_PROBABILITY = 0.5;
    if (Math.random() > TOKEN_PROBABILITY) {
      return {
        convert: () => {},
        preConvert: () => {}
      };
    }

    return null;
  }

  hardReset() {
    return {
      convert: () => {},
      preConvert: () => {}
    };
  }
}
