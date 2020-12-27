export default class MetatagNumberRange {
  constructor(range) {
    this.range = range;
  }

  /**
   * The current type for the metatag
   * 
   * @param {string} range
   *          One of the following formats:
   *          - '100' - Exactly 100
   *          - '>=100' - Greater than or equal to 100
   *          - '>100' - Greater than 100
   *          - '<=100' - Less than or equal to 100
   *          - '100' - Less than 100
   */
  set range(range) {
    if (range.startsWith('>=')) {
      this._type = '>=';
      this._value = parseInt(range.substring(2), 10);
      if (isNaN(this._value)) this._value = 0;
    } else if (range.startsWith('>')) {
      this._type = '>';
      this._value = parseInt(range.substring(1), 10);
      if (isNaN(this._value)) this._value = 0;
    } else if (range.startsWith('<=')) {
      this._type = '<=';
      this._value = parseInt(range.substring(2), 10);
      if (isNaN(this._value)) this._value = 0;
    } else if (range.startsWith('<')) {
      this._type = '<';
      this._value = parseInt(range.substring(1), 10);
      if (isNaN(this._value)) this._value = 0;
    } else {
      this._type = '==';
      this._value = parseInt(range, 10);
      if (isNaN(this._value)) this._value = 0;
    }
  }
}