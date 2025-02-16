const vscode = require('vscode');
const { detectTextAlternatives } = require('./textAlternatives');

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
                
                // Add Copilot fix suggestion in hover
                diagnostic.code = {
                    value: 'fixAccessibility',
                    target: vscode.Uri.parse(`https://copilot.github.com/fix?issue=${encodeURIComponent(issue.message)}`)
                };

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

            // Check if GitHub Copilot is installed
            showGitHubCopilotMessage();

        } else {
            vscode.window.showErrorMessage("This is not an HTML file.");
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

// Check for semantic issues in the document text
function checkSemanticIssues(documentText, document) {
    const issues = [];

    // 1.1.1 Non-text content: Check for images without alt text
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

    // 1.2.1 Audio or video (recorded): Check for media without controls
    regex = /<(audio|video)[^>]*>/g;
    while ((match = regex.exec(documentText)) !== null) {
        if (!documentText.includes('controls')) {
            const start = document.positionAt(match.index);
            const end = document.positionAt(match.index + match[0].length);
            issues.push({
                message: "Audio or video without controls: Provide controls for media elements.",
                startLine: start.line,
                startChar: start.character,
                endLine: end.line,
                endChar: end.character
            });
        }
    }

    // 1.3.1 Information and relationships: Ensure that elements have proper relationships and structure (i.e., headings)
    regex = /<h[1-6][^>]*>/g;
    while ((match = regex.exec(documentText)) !== null) {
        const headerTag = match[0];
        if (headerTag.includes("<h1>") && !documentText.includes('<h2>')) {
            issues.push({
                message: "Missing hierarchical header structure: Ensure proper use of headers from h1 to h6.",
                startLine: 0,
                startChar: 0,
                endLine: 0,
                endChar: 0
            });
        }
    }

    // 1.4.3 Contrast (minimum): Check for low contrast colors
    regex = /color:\s*#[0-9a-fA-F]{6}/g;
    while ((match = regex.exec(documentText)) !== null) {
        const color = match[0];
        if (!isValidContrast(color)) { // You will need to implement isValidContrast for contrast checking
            const start = document.positionAt(match.index);
            const end = document.positionAt(match.index + match[0].length);
            issues.push({
                message: `Low contrast color detected: ${color}. Ensure a contrast ratio of at least 4.5:1.`,
                startLine: start.line,
                startChar: start.character,
                endLine: end.line,
                endChar: end.character
            });
        }
    }

    // 2.1.1 Keyboard accessible: Check if links have tabindex for keyboard navigation
    regex = /<a[^>]*href="#"/g;
    while ((match = regex.exec(documentText)) !== null) {
        const linkTag = match[0];
        if (!linkTag.includes('tabindex="0"')) {
            const start = document.positionAt(match.index);
            const end = document.positionAt(match.index + linkTag.length);
            issues.push({
                message: "Link without accessible keyboard navigation (consider adding tabindex).",
                startLine: start.line,
                startChar: start.character,
                endLine: end.line,
                endChar: end.character
            });
        }
    }

    // 2.2.1 Adjustable time: Check if media elements allow users to pause or adjust the time limit
    regex = /<audio[^>]*>/g;
    while ((match = regex.exec(documentText)) !== null) {
        if (!documentText.includes('controls')) {
            const start = document.positionAt(match.index);
            const end = document.positionAt(match.index + match[0].length);
            issues.push({
                message: "Media element without controls: Ensure media elements allow user interaction (e.g., pause, stop, adjust time).",
                startLine: start.line,
                startChar: start.character,
                endLine: end.line,
                endChar: end.character
            });
        }
    }

    // 2.3.1 Flashing content: Check for <blink> or <marquee> tags
    regex = /<blink[^>]*>/g;
    while ((match = regex.exec(documentText)) !== null) {
        const start = document.positionAt(match.index);
        const end = document.positionAt(match.index + match[0].length);
        issues.push({
            message: "Flashing content detected: Avoid using <blink> or <marquee> tags to prevent seizures.",
            startLine: start.line,
            startChar: start.character,
            endLine: end.line,
            endChar: end.character
        });
    }

    // 2.4.4 Link purpose (in context): Ensure links have meaningful descriptions
    regex = /<a[^>]*href="[^"]*">/g;
    while ((match = regex.exec(documentText)) !== null) {
        const linkTag = match[0];
        if (linkTag.includes('href="#"') || linkTag.trim() === '<a></a>') {
            const start = document.positionAt(match.index);
            const end = document.positionAt(match.index + match[0].length);
            issues.push({
                message: "Empty or ambiguous link text: Provide clear and descriptive text for all links.",
                startLine: start.line,
                startChar: start.character,
                endLine: end.line,
                endChar: end.character
            });
        }
    }

    // 2.5.3 Label for inputs: Ensure that all form inputs have associated labels for accessibility
    regex = /<input[^>]*>/g;
    while ((match = regex.exec(documentText)) !== null) {
        const inputTag = match[0];
        if (!documentText.includes(`<label for="${inputTag.id}">`)) {
            const start = document.positionAt(match.index);
            const end = document.positionAt(match.index + match[0].length);
            issues.push({
                message: "Form input without label: Ensure all form fields have associated labels.",
                startLine: start.line,
                startChar: start.character,
                endLine: end.line,
                endChar: end.character
            });
        }
    }


    // 3.1.1 Language of the page: Check if the language attribute is missing in the <html> tag
    if (!documentText.includes('<html lang="')) {
        issues.push({
            message: "Missing language attribute in the <html> tag: Add the 'lang' attribute to specify the language.",
            startLine: 0,
            startChar: 0,
            endLine: 0,
            endChar: 0
        });
    }

    // 3.2.1 Predictability: Ensure that the page behaves predictably
    regex = /<form[^>]*>/g;
    while ((match = regex.exec(documentText)) !== null) {
        const formTag = match[0];
        if (formTag.includes('onSubmit')) {
            issues.push({
                message: "Form with onSubmit handler: Ensure that forms behave predictably and submit actions are clear.",
                startLine: 0,
                startChar: 0,
                endLine: 0,
                endChar: 0
            });
        }
    }

    // 3.3.1 Form errors: Ensure that form fields are properly labeled and errors are identified
    regex = /<input[^>]*>/g;
    while ((match = regex.exec(documentText)) !== null) {
        const inputTag = match[0];
        if (!documentText.includes(`<label for="${inputTag.id}">`)) { // Ensure <label> is associated with form fields
            const start = document.positionAt(match.index);
            const end = document.positionAt(match.index + match[0].length);
            issues.push({
                message: "Form input without label: Ensure all form fields have associated labels.",
                startLine: start.line,
                startChar: start.character,
                endLine: end.line,
                endChar: end.character
            });
        }
    }

    // 4.1.2 Name, role, value: Check for valid ARIA roles
    regex = /role="[^"]*"/g;
    while ((match = regex.exec(documentText)) !== null) {
        if (!isValidARIA(match[0])) {
            const start = document.positionAt(match.index);
            const end = document.positionAt(match.index + match[0].length);
            issues.push({
                message: "Incorrect ARIA usage: Ensure valid ARIA roles are used.",
                startLine: start.line,
                startChar: start.character,
                endLine: end.line,
                endChar: end.character
            });
        }
    }
    // Run accessibility check for Criterio 1.1.1
    const altIssues = detectTextAlternatives(documentText, document);
    issues.push(...altIssues);

    return issues;
}

// Function to validate contrast ratio
function isValidContrast(color) {
    // Check if color is in the form of hex code
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) return true;  // Skip non-hex colors
    
    const backgroundColor = "#FFFFFF"; // Example: white background
    const contrast = contrastRatio(color, backgroundColor);

    // Check if contrast is valid for normal text (min 4.5:1)
    return contrast >= 4.5;
}

// Convert hex color to RGB
function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return [r, g, b];
}

// Calculate luminance based on RGB values
function luminance(rgb) {
    const [r, g, b] = rgb.map(function (c) {
        c = c / 255;
        return (c <= 0.03928) ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio between two colors
function contrastRatio(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const luminance1 = luminance(rgb1);
    const luminance2 = luminance(rgb2);

    const [L1, L2] = luminance1 > luminance2 ? [luminance1, luminance2] : [luminance2, luminance1];
    return (L1 + 0.05) / (L2 + 0.05);
}

// Expanded validation for ARIA roles and properties
function isValidARIA(ariaRole) {
    const validRoles = [
        "button", "navigation", "link", "dialog", "main", "alert", 
        "form", "application", "checkbox", "radio", "slider", "textbox"
    ];

    // Validate ARIA roles
    const role = ariaRole.match(/role="([^"]*)"/);
    if (role && validRoles.includes(role[1].toLowerCase())) {
        return true;
    }

    // Validate other ARIA properties (if needed)
    const validProperties = [
        "aria-labelledby", "aria-describedby", "aria-hidden"
    ];

    // Check if any ARIA properties are valid (additional validation logic)
    for (let prop of validProperties) {
        if (ariaRole.includes(prop)) {
            return true; // If any valid property is found, consider it valid
        }
    }

    return false;
}


// Function to check if GitHub Copilot is installed
function isGitHubCopilotInstalled() {
    const copilot = vscode.extensions.getExtension('GitHub.copilot');
    return copilot !== undefined;
}

// Function to show GitHub Copilot message
function showGitHubCopilotMessage() {
    if (!isGitHubCopilotInstalled()) {
        vscode.window.showInformationMessage("GitHub Copilot is not installed. Please install it to get suggestions for fixing accessibility issues.");
    } else {
        vscode.window.showInformationMessage("GitHub Copilot is installed! It will help you fix accessibility issues.");
    }
}

module.exports = {
    activate,
    deactivate
};
