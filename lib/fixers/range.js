module.exports = function (fixer, node, rule, context) {
  const source = context.getSourceCode();
  const args = node.arguments;
  let startText = 0;
  let setStepText = undefined;
  let endText = source.getText(args[0]);
  if (args.length >= 2) {
    startText = source.getText(args[0]);
    endText = source.getText(args[1]);
  }
  if (args.length >= 3) {
    setStepText = source.getText(args[2]);
  }
  const stepText = setStepText ?? `(${endText} - ${startText} < 0 ? -1 : 1)`;

  return fixer.replaceText(
    node,
    `Array.from({ length: Math.ceil(Math.max((${endText} - ${startText}) / (${stepText}))) }, (_, i) => i * (${stepText}) + ${startText})`
  );
};
