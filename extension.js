const vscode = require("vscode");
const rules = require("./scripts/rules");

// This function is called when your extension is activated
function activate(context) {
  console.log('Extension "semantic-checker" is now active.');
  vscode.window.showInformationMessage("Semantic HTML check initiated.");

  // Function to count all errors detected
  function countErrors(issues) {
    return issues.length;
  }

  let disposable = vscode.commands.registerCommand(
    "extension.checkSemanticHTML",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (editor && editor.document.languageId === "html") {
        const documentText = editor.document.getText();
        const issues = checkSemanticIssues(documentText, editor.document);

        const diagnostics = issues.map((issue) => {
          const range = new vscode.Range(
            issue.startLine,
            issue.startChar,
            issue.endLine,
            issue.endChar
          );

          const diagnostic = new vscode.Diagnostic(
            range,
            `${issue.message}\n\n🔧 Recommendation: ${issue.recommendation}`,
            vscode.DiagnosticSeverity.Warning
          );

          diagnostic.code = {
            value: issue.ruleId,
            target: vscode.Uri.parse(
              `https://copilot.github.com/fix?issue=${encodeURIComponent(
                issue.message
              )}`
            ),
          };

          diagnostic.relatedInformation = [
            new vscode.DiagnosticRelatedInformation(
              new vscode.Location(editor.document.uri, range),
              `📘 Learn more: ${issue.codeUrl}`
            ),
          ];

          return diagnostic;
        });

        const diagnosticCollection =
          vscode.languages.createDiagnosticCollection("semantic-checker");
        diagnosticCollection.set(editor.document.uri, diagnostics);

        const errorCount = countErrors(issues);

        if (issues.length === 0) {
          vscode.window.showInformationMessage(
            "The HTML meets accessibility requirements."
          );
        } else {
          vscode.window.showWarningMessage(
            `Found ${issues.length} issues. See details in the editor. Total errors: ${errorCount}`
          );
        }

        showGitHubCopilotMessage();
      } else {
        vscode.window.showErrorMessage("This is not an HTML file.");
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {
  console.log('Extension "semantic-checker" has been deactivated.');
}

function checkSemanticIssues(documentText, document) {
  const issues = [];

  rules.forEach(({ regex, message, recommendation, validate }) => {
    let match;
    while ((match = regex.exec(documentText)) !== null) {
      const tag = match[0];
      if (validate(tag, documentText)) {
        const start = document.positionAt(match.index);
        const end = document.positionAt(match.index + tag.length);
        issues.push({
          message: `${message} (${
            rules.find((r) => r.message === message)?.id || "R?"
          })`,
          recommendation,
          startLine: start.line,
          startChar: start.character,
          endLine: end.line,
          endChar: end.character,
        });
      }
    }
  });

  if (!rules || !Array.isArray(rules)) {
    vscode.window.showErrorMessage("Rules not loaded properly.");
    return [];
  }

  return issues;
}

// Function to check if GitHub Copilot is installed
function isGitHubCopilotInstalled() {
  const copilot = vscode.extensions.getExtension("GitHub.copilot");
  return copilot !== undefined;
}

// Function to show GitHub Copilot message
function showGitHubCopilotMessage() {
  if (!isGitHubCopilotInstalled()) {
    vscode.window.showInformationMessage(
      "GitHub Copilot is not installed. Please install it to get suggestions for fixing accessibility issues."
    );
  } else {
    vscode.window.showInformationMessage(
      "GitHub Copilot is installed! It will help you fix accessibility issues."
    );
  }
}

module.exports = {
  activate,
  deactivate,
};
