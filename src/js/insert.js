/**
 * ボタンやリンクをHTMLに挿入するスクリプト
 */
import InsertionFactory from "./lib/Insertion/InsertionFactory";

const currentHostname = location.host;
const currentUrl = location.href;
InsertionFactory.create(currentHostname, currentUrl).insert().on();
