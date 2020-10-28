"use strict";
const RuleTester = require("eslint").RuleTester;
const assert = require("assert");
const rules = require("../../../lib/rules/all");
const allRules = require("../../../lib/rules/rules");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2018, sourceType: "module" },
});

ruleTester.run("_.get", rules.get, {
  invalid: [
    {
      code: `var result1 = _.get({foo: "asdf"[1]}, 'a[0].b.c', 1)`,
      errors: [
        "Consider using the native optional chaining to get nested values and nullish coalescing operator for fallback values",
      ],
      output: `var result1 = (({foo: "asdf"[1]})?.a?.[0]?.b?.c ?? 1)`,
    },
    {
      code: `import { get } from "lodash"; var result2 = get(object, "a[0].b.c", 42)`,
      errors: [
        {
          message: `Import { get } from 'lodash' detected. Consider using the native optional chaining to get nested values and nullish coalescing operator for fallback values`,
        },
        {
          message:
            "Consider using the native optional chaining to get nested values and nullish coalescing operator for fallback values",
          output: `import { get } from "lodash"; var result2 = ((object)?.a?.[0]?.b?.c ?? 42)`,
        },
      ],
    },
    {
      code: `import { get as x } from "lodash"; var result2 = x(object, "a.0.b.c", 42)`,
      errors: [
        {
          message: `Import { get } from 'lodash' detected. Consider using the native optional chaining to get nested values and nullish coalescing operator for fallback values`,
        },
        {
          message:
            "Consider using the native optional chaining to get nested values and nullish coalescing operator for fallback values",
          output: `import { get as x } from "lodash"; var result2 = ((object)?.a?.[0]?.b?.c ?? 42)`,
        },
      ],
    },
    {
      code: `import get from "lodash/get"; var result3 = get(object, [1, "a", (() => "asdf")()])`,
      errors: [
        {
          message: `Import from 'lodash/get' detected. Consider using the native optional chaining to get nested values and nullish coalescing operator for fallback values`,
        },
        {
          message:
            "Consider using the native optional chaining to get nested values and nullish coalescing operator for fallback values",
          output: `import get from "lodash/get"; var result3 = ((object)?.[1]?.a?.[(() => "asdf")()])`,
        },
      ],
    },
    {
      code: `const data = _.get(series, "[0].data[0]", {});`,
      errors: [
        "Consider using the native optional chaining to get nested values and nullish coalescing operator for fallback values",
      ],
      output: `const data = ((series)?.[0]?.data?.[0] ?? {});`,
    },
  ],
  valid: [],
});
