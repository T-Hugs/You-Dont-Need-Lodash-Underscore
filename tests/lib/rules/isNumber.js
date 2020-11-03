"use strict";
const RuleTester = require("eslint").RuleTester;
const assert = require("assert");
const rules = require("../../../lib/rules/all");
const allRules = require("../../../lib/rules/rules");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2018, sourceType: "module" },
});

ruleTester.run("_.isNumber", rules["is-number"], {
  invalid: [
    {
      code: `console.log(_.isNumber(42))`,
      errors: ["Consider using the native typeof value === 'number'"],
      output: `console.log((typeof 42 === "number"))`,
    },
    {
      code: `console.log(_.isNumber("asdf"))`,
      errors: ["Consider using the native typeof value === 'number'"],
      output: `console.log((typeof "asdf" === "number"))`,
    },
    {
      code: `console.log(_.isNumber(Infinity))`,
      errors: ["Consider using the native typeof value === 'number'"],
      output: `console.log((typeof Infinity === "number"))`,
    },
  ],
  valid: [],
});
