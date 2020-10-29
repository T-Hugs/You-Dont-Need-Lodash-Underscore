"use strict";
const RuleTester = require("eslint").RuleTester;
const assert = require("assert");
const rules = require("../../../lib/rules/all");
const allRules = require("../../../lib/rules/rules");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2018, sourceType: "module" },
});

ruleTester.run("_.range", rules.range, {
  invalid: [
    {
      code: `_.range(0, -20, -4).forEach(n => console.log(n))`,
      errors: [
        "Consider using the native Array.from()",
      ],
      output: `xxxxxxxxxx`,
    },
  ],
  valid: [],
});
