"use strict";
const RuleTester = require("eslint").RuleTester;
const assert = require("assert");
const rules = require("../../../lib/rules/all");
const allRules = require("../../../lib/rules/rules");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2018, sourceType: "module" },
});

ruleTester.run("_.max", rules.max, {
  invalid: [
    {
      code: `console.log(_.max([1,2,42,3]))`,
      errors: ["Consider using the native Math.max(...arg)"],
      output: `console.log(Math.max(...([1,2,42,3])))`,
    },
    {
      code: `console.log(_.max("1,2,3,42,5".split(",").map(Number)))`,
      errors: ["Consider using the native Math.max(...arg)"],
      output: `console.log(Math.max(...("1,2,3,42,5".split(",").map(Number))))`,
    },
  ],
  valid: [],
});
