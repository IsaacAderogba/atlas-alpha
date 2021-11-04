import { Parser } from "../Parser";

declare global {
  var parser: Parser;
}

global.parser = new Parser();
