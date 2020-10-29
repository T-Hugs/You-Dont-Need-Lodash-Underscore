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
      errors: ["Consider using the native Array.from()"],
      output: `Array.from({ length: Math.ceil(Math.max((-20 - 0) / (-4))) }, (_, i) => i * (-4) + 0).forEach(n => console.log(n))`,
    },
    {
      code: `_.range(4).forEach(n => console.log(n))`,
      errors: ["Consider using the native Array.from()"],
      output: `Array.from({ length: Math.ceil(Math.max((4 - 0) / ((4 - 0 < 0 ? -1 : 1)))) }, (_, i) => i * ((4 - 0 < 0 ? -1 : 1)) + 0).forEach(n => console.log(n))`,
    },
    {
      code: `_.range(-4).forEach(n => console.log(n))`,
      errors: ["Consider using the native Array.from()"],
      output: `Array.from({ length: Math.ceil(Math.max((-4 - 0) / ((-4 - 0 < 0 ? -1 : 1)))) }, (_, i) => i * ((-4 - 0 < 0 ? -1 : 1)) + 0).forEach(n => console.log(n))`,
    },
    {
      code: `_.range(1, 5).forEach(n => console.log(n))`,
      errors: ["Consider using the native Array.from()"],
      output: `Array.from({ length: Math.ceil(Math.max((5 - 1) / ((5 - 1 < 0 ? -1 : 1)))) }, (_, i) => i * ((5 - 1 < 0 ? -1 : 1)) + 1).forEach(n => console.log(n))`,
    },
    {
      code: `_.range(0, 20, 5).forEach(n => console.log(n))`,
      errors: ["Consider using the native Array.from()"],
      output: `Array.from({ length: Math.ceil(Math.max((20 - 0) / (5))) }, (_, i) => i * (5) + 0).forEach(n => console.log(n))`,
    },
    {
      code: `_.range(0, -4, -1).forEach(n => console.log(n))`,
      errors: ["Consider using the native Array.from()"],
      output: `Array.from({ length: Math.ceil(Math.max((-4 - 0) / (-1))) }, (_, i) => i * (-1) + 0).forEach(n => console.log(n))`,
    },
    {
      code: `_.range(1, 4, 0).forEach(n => console.log(n))`,
      errors: ["Consider using the native Array.from()"],
      output: `Array.from({ length: Math.ceil(Math.max((4 - 1) / (0))) }, (_, i) => i * (0) + 1).forEach(n => console.log(n))`, //wrong
    },
    {
      code: `_.range(0).forEach(n => console.log(n))`,
      errors: ["Consider using the native Array.from()"],
      output: `Array.from({ length: Math.ceil(Math.max((0 - 0) / ((0 - 0 < 0 ? -1 : 1)))) }, (_, i) => i * ((0 - 0 < 0 ? -1 : 1)) + 0).forEach(n => console.log(n))`, // wrong
    },
  ],
  valid: [],
});

/*_.range(4);
// => [0, 1, 2, 3]
 
_.range(-4);
// => [0, -1, -2, -3]
 
_.range(1, 5);
// => [1, 2, 3, 4]
 
_.range(0, 20, 5);
// => [0, 5, 10, 15]
 
_.range(0, -4, -1);
// => [0, -1, -2, -3]
 
_.range(1, 4, 0);
// => [1, 1, 1]
 
_.range(0);
// => []*/