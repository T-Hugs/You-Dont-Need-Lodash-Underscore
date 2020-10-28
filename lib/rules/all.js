"use strict";
const kebabCase = require("kebab-case");
const rules = require("./rules");
const utils = require("eslint-utils");

const forbiddenLibs = ["lodash", "lodash-es"];

function getAssignmentLeftHandSide(node) {
  // For VariableDeclarator nodes, the left hand side is called `id`
  // The `x` on `var x = 3;
  if (node.type === "VariableDeclarator") {
    return node.id;
  }
  // For AssignmentExpression nodes, the left hand side is called `left`
  // The `x` on `x = 3;
  if (node.type === "AssignmentExpression") {
    return node.left;
  }
  return null;
}

for (const rule in rules) {
  const alternative = rules[rule].alternative;
  const ruleName = rules[rule].ruleName || kebabCase(rule);
  const forbiddenImports = {
    [`lodash/${rule}`]: 1,
    [`lodash-es/${rule}`]: 1,
    [`lodash.${rule.toLowerCase()}`]: 1,
  };
  module.exports[ruleName] = {
    create(context) {
      let identifier = "";
      return {
        CallExpression(node) {
          const callee = node.callee;
          const objectName =
            callee.name ||
            (callee.object && callee.object.name) ||
            (callee.object &&
              callee.object.callee &&
              callee.object.callee.name);

          if (objectName === "require" && node.arguments.length === 1) {
            const requiredModuleName = node.arguments[0].value;
            const { parent } = node;
            if (forbiddenLibs.includes(requiredModuleName)) {
              const leftHandSide = getAssignmentLeftHandSide(parent);
              // ex: const { indexOf } = require('lodash');
              // ex: ({ indexOf } = require('lodash'));
              if (leftHandSide && leftHandSide.type === "ObjectPattern") {
                leftHandSide.properties.forEach((property) => {
                  if (property.key.name === rule) {
                    context.report({
                      node,
                      message: `{ ${rule} } = require('${requiredModuleName}') detected. Consider using the native ${alternative}`,
                    });
                  }
                });
              }
            } else if (forbiddenImports.hasOwnProperty(requiredModuleName)) {
              // ex: const indexOf = require('lodash.indexof');
              // ex: const indexOf = require('lodash/indexOf');
              context.report({
                node,
                message: `require('${requiredModuleName}') detected. Consider using the native ${alternative}`,
              });
            }
          } else if (
            ((objectName === "_" ||
              objectName === "lodash" ||
              objectName === "underscore") &&
              callee.property &&
              callee.property.name === rule) ||
            (callee.type === "Identifier" && callee.name === identifier)
          ) {
            context.report({
              node,
              message: `Consider using the native ${alternative}`,
              fix: (fixer) => {
                const isGetIdentifier =
                  node.callee.type === "Identifier" &&
                  node.callee.name === "get";
                const isGetMember =
                  node.callee.type === "MemberExpression" &&
                  node.callee.property.name === "get" &&
                  node.callee.object.name === "_";
                const source = context.getSourceCode();

                if (isGetIdentifier || isGetMember) {
                  const firstArgSource = source.getText(node.arguments[0]);
                  const args = node.arguments;
                  let defaultCoalesce = "";
                  let optionalChain = "";
                  if (args.length >= 3) {
                    defaultCoalesce = "?? " + source.getText(node.arguments[2]);
                  }
                  let path;
                  if (
                    args[1] &&
                    args[1].type === "Literal" &&
                    typeof args[1].value === "string"
                  ) {
                    path = args[1].value
                      .replace(/[\[\]]/g, ".")
                      .replace(/\.\.+/g, ".")
                      .split(".")
                      .filter(Boolean)
                      .map((segment) => {
                        if (isNaN(segment)) {
                          return segment;
                        } else {
                          return `[${segment}]`;
                        }
                      });
                  } else if (args[1] && args[1].type === "ArrayExpression") {
                    path = args[1].elements.map((e) => {
                      if (e.type === "Literal") {
                        if (typeof e.value === "number") {
                          return `[${e.value}]`;
                        } else {
                          return e.value;
                        }
                      } else {
                        return `[${source.getText(e)}]`;
                      }
                    });
                  }
                  if (!path) {
                    return;
                  }
                  optionalChain = path.join("?.");

                  return fixer.replaceText(
                    node,
                    `((${firstArgSource})?.${optionalChain} ${defaultCoalesce})`
                  );
                }
              },
            });
          }
        },
        ImportDeclaration(node) {
          if (forbiddenLibs.includes(node.source.value)) {
            // ex: import { indexOf } from 'lodash';
            // ex: import { indexOf as x } from 'lodash';
            node.specifiers.forEach((specifier) => {
              if (
                specifier.type === "ImportSpecifier" &&
                specifier.imported.name === rule
              ) {
                context.report({
                  node,
                  message: `Import { ${rule} } from '${node.source.value}' detected. Consider using the native ${alternative}`,
                });
                identifier = specifier.local.name;
              }
            });
          } else if (forbiddenImports.hasOwnProperty(node.source.value)) {
            // ex: import indexOf from 'lodash/indexOf';
            // ex: import indexOf from 'lodash.indexof';
            context.report({
              node,
              message: `Import from '${node.source.value}' detected. Consider using the native ${alternative}`,
            });
            identifier = node.specifiers[0].local.name;
          }
        },
      };
    },
  };
}
