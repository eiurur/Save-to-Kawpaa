module.exports = class QueryStringParser {
  static parse() {
    const sets = location.search.substr(1).split('&').map(query => {
      return query.split('=');
    });
    return this._toObject(sets);
  }

  static _toObject(sets) {
    var obj = {};
    sets.forEach( s => {
      obj[s[0]] = s[1];
    })
    return obj;
  }
}