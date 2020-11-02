"use strict";
const RuleTester = require("eslint").RuleTester;
const assert = require("assert");
const rules = require("../../../lib/rules/all");
const allRules = require("../../../lib/rules/rules");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2018, sourceType: "module" },
});

ruleTester.run("_.isFinite", rules["is-finite"], {
  invalid: [
    {
      code: `console.log(_.isFinite(42))`,
      errors: ["Consider using the native Number.isFinite()"],
      output: `console.log(Number.isFinite(42))`,
    },
    {
      code: `console.log(_.isFinite("asdf"))`,
      errors: ["Consider using the native Number.isFinite()"],
      output: `console.log(Number.isFinite("asdf"))`,
    },
    {
      code: `console.log(_.isFinite(Infinity))`,
      errors: ["Consider using the native Number.isFinite()"],
      output: `console.log(Number.isFinite(Infinity))`,
    },
  ],
  valid: [],
});
