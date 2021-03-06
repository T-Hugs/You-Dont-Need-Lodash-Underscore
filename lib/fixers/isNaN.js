module.exports = function (fixer, node, rule, context) {
    const source = context.getSourceCode();
    if (node.arguments.length !== 1) {
        return;
    }
    return fixer.replaceText(
      node,
      `Number.isNaN(${source.getText(node.arguments[0])})`
    );
  };
  