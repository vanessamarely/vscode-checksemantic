const vscode = require("vscode");
const rules = require("./scripts/rules");

// This function is called when your extension is activated
function activate(context) {
  console.log('Extension "semantic-checker" is now active.');
  vscode.window.showInformationMessage("Semantic HTML check initiated.");

  let disposable = vscode.commands.registerCommand(
    "extension.checkSemanticHTML",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (editor && editor.document.languageId === "html") {
        const documentText = editor.document.getText();
        const issues = checkSemanticIssues(documentText, editor.document);

        const levelBreakdown = issues.reduce((acc, { level }) => {
          const lvl = level.toUpperCase();
          acc[lvl] = (acc[lvl] || 0) + 1;
          return acc;
        }, {});

        const levelBreakdownMsg = Object.entries(levelBreakdown)
          .map(
            ([lvl, cnt]) => `${cnt} issue${cnt > 1 ? "s" : ""} at Level ${lvl}`
          )
          .join(" | ");

        const diagnostics = issues.map((issue) => {
          const range = new vscode.Range(
            issue.startLine,
            issue.startChar,
            issue.endLine,
            issue.endChar
          );

          const diagnostic = new vscode.Diagnostic(
            range,
            `${issue.message} \n [WCAG Level ${issue.level}]\n\n🔧 Recommendation: ${issue.recommendation}`,
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

        console.log(`🔎 Accessibility Check Result:`);
        console.log(`📄 Total issues found: ${issues.length}`);
        console.log(`📊 Breakdown by WCAG Level:`);
        Object.entries(levelBreakdown).forEach(([lvl, cnt]) => {
          console.log(`   - Level ${lvl}: ${cnt} issue${cnt > 1 ? "s" : ""}`);
        });

        saveIssuesToFile(issues, levelBreakdown);

        if (issues.length === 0) {
          vscode.window.showInformationMessage(
            "The HTML meets accessibility requirements."
          );
        } else {
          vscode.window.showWarningMessage(
            `Found ${issues.length} accessibility issues.\nBreakdown: ${levelBreakdownMsg}.`
          );
        }

        showGitHubCopilotMessage();
      } else {
        vscode.window.showErrorMessage("This is not an HTML file.");
      }
    }
  );

  let fixCommand = vscode.commands.registerCommand(
    "extension.fixSemanticHTML",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor || editor.document.languageId !== "html") {
        vscode.window.showErrorMessage("Please open an HTML file to fix.");
        return;
      }

      const document = editor.document;
      const documentText = document.getText();
      const issues = checkSemanticIssues(documentText, document);

      if (issues.length === 0) {
        vscode.window.showInformationMessage("No accessibility issues to fix.");
        return;
      }

      const confirm = await vscode.window.showQuickPick(
        ["Yes, fix what you can", "No, just show me the issues"],
        {
          placeHolder: `Detected ${issues.length} issues. Do you want to fix simple ones automatically?`,
        }
      );

      if (confirm !== "Yes, fix what you can") return;

      const edit = new vscode.WorkspaceEdit();

      for (const issue of issues) {
        const rule = rules.find((r) => issue.ruleId.includes(r.message));

        if (!rule || typeof rule.autofix !== "function") continue;

        const range = new vscode.Range(
          issue.startLine,
          issue.startChar,
          issue.endLine,
          issue.endChar
        );

        const originalText = document.getText(range);
        const fixedText = rule.autofix(originalText);

        if (fixedText && fixedText !== originalText) {
          edit.replace(document.uri, range, fixedText);
        }
      }

      const success = await vscode.workspace.applyEdit(edit);

      if (success) {
        vscode.window.showInformationMessage(
          "✅ Fixes applied where possible!"
        );
      } else {
        vscode.window.showErrorMessage("❌ Failed to apply fixes.");
      }
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(fixCommand);
}

function deactivate() {
  console.log('Extension "semantic-checker" has been deactivated.');
}



// Remove or comment out the old cleanDocument function in your extension.js or equivalent file.

function checkSemanticIssues(rawText, vscodeDocument) {
    const issues = [];
    let preparsedDocumentText = rawText;

    // Blank out comments by replacing their characters with spaces (preserving line breaks)
    preparsedDocumentText = preparsedDocumentText.replace(/<!--[\s\S]*?-->/g, match => {
        return Array.from(match).map(char => (char === '\n' || char === '\r' ? char : ' ')).join('');
    });

    // Blank out script tags (including their content)
    preparsedDocumentText = preparsedDocumentText.replace(/<script[\s\S]*?<\/script>/gi, match => {
        return Array.from(match).map(char => (char === '\n' || char === '\r' ? char : ' ')).join('');
    });

    // Blank out style tags (including their content)
    preparsedDocumentText = preparsedDocumentText.replace(/<style[\s\S]*?<\/style>/gi, match => {
        return Array.from(match).map(char => (char === '\n' || char === '\r' ? char : ' ')).join('');
    });

    // IMPORTANT: Do NOT globally remove attributes like id, class, style, name here.
    // The 'rules.js' regex and validate functions will now operate on text that
    // has these attributes intact if they were in the original HTML.

    rules.forEach(({ id: ruleIdentifier, regex, message, level, recommendation, validate }) => {
        regex.lastIndex = 0; // Reset regex state for global searches
        let execMatch;
        while ((execMatch = regex.exec(preparsedDocumentText)) !== null) {
            const matchedTagString = execMatch[0];

            // Avoid flagging if the match is purely whitespace (from blanking out)
            if (matchedTagString.trim() === "") {
                continue;
            }

            // The validate function receives the matched tag (from preparsedDocumentText)
            // and the whole preparsedDocumentText.
            if (validate(matchedTagString, preparsedDocumentText)) {
                const startPosition = vscodeDocument.positionAt(execMatch.index);
                const endPosition = vscodeDocument.positionAt(execMatch.index + matchedTagString.length);

                issues.push({
                    ruleId: ruleIdentifier, // Use the 'id' from rules.js (e.g., "R1")
                    level: `${level}`,
                    message: `${message} (${ruleIdentifier})`, // Display message with its rule ID
                    recommendation,
                    startLine: startPosition.line,
                    startChar: startPosition.character,
                    endLine: endPosition.line,
                    endChar: endPosition.character,
                });
            }
        }
    });
    return issues;
}

// Function to check if GitHub Copilot is installed
function isGitHubCopilotInstalled() {
  const copilot = vscode.extensions.getExtension("GitHub.copilot");
  return copilot !== undefined;
}

const fs = require("fs");
const path = require("path");
// Function to save issues to a file
function saveIssuesToFile(issues, breakdown) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace folder open.");
    return;
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;
  const outputDir = path.join(workspacePath, "diagnostics");
  const outputFile = path.join(outputDir, "semantic-checker-log.json");

  // Crear carpeta si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const output = {
    totalIssues: issues.length,
    breakdownByLevel: breakdown,
    timestamp: new Date().toISOString(),
    issues: issues.map((issue) => ({
      ruleId: issue.ruleId,
      level: issue.level,
      message: issue.message,
      recommendation: issue.recommendation,
      startLine: issue.startLine + 1, // 1-based
      startChar: issue.startChar,
      endLine: issue.endLine + 1,
      endChar: issue.endChar,
    })),
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), "utf-8");
  console.log(`📁 Diagnostic report saved to: ${outputFile}`);
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
