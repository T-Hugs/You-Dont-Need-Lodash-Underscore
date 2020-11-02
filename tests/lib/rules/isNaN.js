"use strict";
const RuleTester = require("eslint").RuleTester;
const assert = require("assert");
const rules = require("../../../lib/rules/all");
const allRules = require("../../../lib/rules/rules");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2018, sourceType: "module" },
});

ruleTester.run("_.isNaN", rules["is-nan"], {
  invalid: [
    {
      code: `console.log(_.isNaN(42))`,
      errors: ["Consider using the native Number.isNaN()"],
      output: `console.log(Number.isNaN(42))`,
    },
    {
      code: `console.log(_.isNaN("asdf"))`,
      errors: ["Consider using the native Number.isNaN()"],
      output: `console.log(Number.isNaN("asdf"))`,
    },
  ],
  valid: [],
});
