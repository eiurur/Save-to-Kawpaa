/**
 * ボタンやリンクをHTMLに挿入するスクリプト
 */
const InsertionFactory = require("./lib/Insertion/InsertionFactory");

const currentHostname = location.host;
const currentUrl = location.href;
InsertionFactory.create(currentHostname, currentUrl).insert().on();
