module.exports = function (fixer, node, rule, context) {
  const isGetIdentifier =
    node.callee.type === "Identifier" && node.callee.name === "get";
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
};
