const vscode = require('vscode');

// This function is called when your extension is activated
function activate(context) {
    console.log('Extension "semantic-checker" is now active.');

    let disposable = vscode.commands.registerCommand('extension.checkSemanticHTML', () => {
        const editor = vscode.window.activeTextEditor;

        // Check if there's an active editor and if the file is HTML
        if (editor && editor.document.languageId === "html") {
            const documentText = editor.document.getText();
            const issues = checkSemanticIssues(documentText, editor.document);

            // Show diagnostic results in the editor
            const diagnostics = issues.map(issue => {
                const range = new vscode.Range(issue.startLine, issue.startChar, issue.endLine, issue.endChar);
                const diagnostic = new vscode.Diagnostic(range, issue.message, vscode.DiagnosticSeverity.Warning);
                return diagnostic;
            });

            // Create a diagnostic collection for semantic issues
            const diagnosticCollection = vscode.languages.createDiagnosticCollection('semantic-checker');
            diagnosticCollection.set(editor.document.uri, diagnostics);

            // If no issues, show success message
            if (issues.length === 0) {
                vscode.window.showInformationMessage("The HTML is semantically correct.");
            } else {
                vscode.window.showWarningMessage(`Found ${issues.length} issues. See the editor for details.`);
            }
        } else {
            vscode.window.showErrorMessage("This is not an HTML file.");
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

function checkSemanticIssues(documentText, document) {
    const issues = [];

    // Check for missing alt text in images
    let regex = /<img[^>]*>/g;
    let match;
    while ((match = regex.exec(documentText)) !== null) {
        const imageTag = match[0];
        if (!imageTag.includes('alt="')) {
            const start = document.positionAt(match.index);
            const end = document.positionAt(match.index + imageTag.length);
            issues.push({
                message: "Image without alt text: Provide alternative text for all images.",
                startLine: start.line,
                startChar: start.character,
                endLine: end.line,
                endChar: end.character
            });
        }
    }

    // Check for empty links
    regex = /<a[^>]*href="#"/g;
    while ((match = regex.exec(documentText)) !== null) {
        const linkTag = match[0];
        const start = document.positionAt(match.index);
        const end = document.positionAt(match.index + linkTag.length);
        issues.push({
            message: "Empty links: Ensure all links have descriptive text.",
            startLine: start.line,
            startChar: start.character,
            endLine: end.line,
            endChar: end.character
        });
    }

    // Check for empty buttons
    regex = /<button[^>]*>.*<\/button>/g;
    while ((match = regex.exec(documentText)) !== null) {
        const buttonTag = match[0];
        if (buttonTag.trim() === "<button></button>") {
            const start = document.positionAt(match.index);
            const end = document.positionAt(match.index + buttonTag.length);
            issues.push({
                message: "Empty buttons: Provide text or icons with alternative text for all buttons.",
                startLine: start.line,
                startChar: start.character,
                endLine: end.line,
                endChar: end.character
            });
        }
    }


    return issues;
}

module.exports = {
    activate,
    deactivate
};
