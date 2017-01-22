const Insertion = require('./Insertion');

module.exports = class Link extends Insertion {
  constructor() {
    super();
    this.selector = null;
    this.html = null;
  }
}