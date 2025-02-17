const vscode = require("vscode");

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

        const diagnostics = issues.map((issue) => {
          const range = new vscode.Range(
            issue.startLine,
            issue.startChar,
            issue.endLine,
            issue.endChar
          );
          const diagnostic = new vscode.Diagnostic(
            range,
            issue.message,
            vscode.DiagnosticSeverity.Warning
          );
          diagnostic.code = {
            value: "fixAccessibility",
            target: vscode.Uri.parse(
              `https://copilot.github.com/fix?issue=${encodeURIComponent(
                issue.message
              )}`
            ),
          };
          return diagnostic;
        });

        const diagnosticCollection =
          vscode.languages.createDiagnosticCollection("semantic-checker");
        diagnosticCollection.set(editor.document.uri, diagnostics);

        if (issues.length === 0) {
          vscode.window.showInformationMessage(
            "The HTML meets accessibility requirements."
          );
        } else {
          vscode.window.showWarningMessage(
            `Found ${issues.length} issues. See details in the editor.`
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

  const checks = [
    {
      regex: /<img[^>]*>/g,
      message: "Image without alt text",
      validate: (tag) => !tag.includes('alt="'),
    },
    {
      regex: /<a[^>]*href=[^>]*>(.*?)<\/a>/g,
      message: "Link with icon missing aria-label",
      validate: (tag) => {
        const iconPattern = /<i[^>]*>|<span[^>]*>/g;
        return iconPattern.test(tag) && !tag.includes("aria-label");
      },
    },
    {
      regex: /<button[^>]*>/g,
      message: "Button missing accessible name",
      validate: (tag) =>
        !tag.includes("aria-label") && !tag.includes(">s*[^<]+s*<"),
    },
    {
      regex: /<input[^>]*type="image"[^>]*>/g,
      message: "Image input missing alt attribute",
      validate: (tag) => !tag.includes('alt="'),
    },
    {
      regex: /<svg[^>]*>/g,
      message: "SVG missing aria-label or aria-hidden",
      validate: (tag) =>
        !tag.includes("aria-label") && !tag.includes("aria-hidden"),
    },
    {
      regex: /<table[^>]*>/g,
      message: "Table missing caption",
      validate: (tag) => !documentText.includes("<caption>"),
    },
    {
      regex: /<form[^>]*>/g,
      message: "Form missing label",
      validate: (tag) => !documentText.includes("<label"),
    },
    {
      regex: /<select[^>]*>/g,
      message: "Select missing associated label",
      validate: (tag) => !documentText.includes("<label"),
    },
    {
      regex: /<textarea[^>]*>/g,
      message: "Textarea missing label",
      validate: (tag) => !documentText.includes("<label"),
    },
    {
      regex: /<figure[^>]*>/g,
      message: "Figure missing figcaption",
      validate: (tag) => !documentText.includes("<figcaption>"),
    },
    {
      regex: /<picture[^>]*>/g,
      message: "Picture missing alt in image",
      validate: (tag) =>
        !documentText.includes("<img") || !documentText.includes("alt="),
    },
    {
      regex: /<object[^>]*>/g,
      message: "Object missing text alternative",
      validate: (tag) => !documentText.includes("<p>"),
    },
    {
      regex: /<video[^>]*>/g,
      message: "Video missing captions",
      validate: (tag) => !documentText.includes("<track"),
    },
    {
      regex: /<audio[^>]*>/g,
      message: "Audio missing controls",
      validate: (tag) => !tag.includes("controls"),
    },
    {
      regex: /<iframe[^>]*>/g,
      message: "Iframe missing title attribute",
      validate: (tag) => !tag.includes("title="),
    },
    {
      regex: /<area[^>]*>/g,
      message: "Area missing alt attribute",
      validate: (tag) => !tag.includes("alt="),
    },
    {
      regex: /<canvas[^>]*>/g,
      message: "Canvas missing descriptive text",
      validate: (tag) => !documentText.includes("<p>"),
    },
    {
      regex: /<map[^>]*>/g,
      message: "Map missing alt for areas",
      validate: (tag) =>
        !documentText.includes("<area") || !documentText.includes("alt="),
    },
    {
      regex: /<embed[^>]*>/g,
      message: "Embed missing text alternative",
      validate: (tag) => !documentText.includes("<p>"),
    },
    {
      regex: /<track[^>]*>/g,
      message: "Track missing captions",
      validate: (tag) => !tag.includes('kind="captions"'),
    },
    {
      regex: /<source[^>]*>/g,
      message: "Source missing captions",
      validate: (tag) => !documentText.includes("<track"),
    },
    {
      regex: /<progress[^>]*>/g,
      message: "Progress missing aria-label",
      validate: (tag) => !tag.includes("aria-label"),
    },
    {
      regex: /<meter[^>]*>/g,
      message: "Meter missing aria-label",
      validate: (tag) => !tag.includes("aria-label"),
    },
    {
      regex: /<time[^>]*>/g,
      message: "Time missing context",
      validate: () => true,
    },
    {
      regex: /<abbr[^>]*>/g,
      message: "Abbr missing title attribute",
      validate: (tag) => !tag.includes("title="),
    },
    {
      regex: /<q[^>]*>/g,
      message: "Quote missing cite attribute",
      validate: (tag) => !tag.includes("cite="),
    },
    {
      regex: /<caption[^>]*>(.*?)<\/caption>/g,
      message: "Caption missing description",
      validate: (tag, content) => content.trim() === "",
    },
    {
      regex: /<legend[^>]*>(.*?)<\/legend>/g,
      message: "Legend missing text",
      validate: (tag, content) => content.trim() === "",
    },
    {
      regex: /<figcaption[^>]*>(.*?)<\/figcaption>/g,
      message: "Figcaption missing description",
      validate: (tag, content) => content.trim() === "",
    },
    {
      regex: /<datalist[^>]*>/g,
      message: "Datalist missing context",
      validate: () => true,
    },
    {
      regex: /<h[1-6][^>]*>/g,
      message: "Improper heading structure",
      validate: () => !documentText.includes("<h2>"),
    },
    {
      regex: /color:\s*#[0-9a-fA-F]{6}/g,
      message: "Potential low contrast color",
      validate: () => true,
    },
    {
      regex: /<a[^>]*href="#"/g,
      message: "Link missing tabindex for keyboard navigation",
      validate: (tag) => !tag.includes('tabindex="0"'),
    },
    {
      regex: /<audio[^>]*>/g,
      message: "Audio missing controls for time adjustment",
      validate: (tag) => !tag.includes("controls"),
    },
    {
      regex: /<a[^>]*href="[^"]*">/g,
      message: "Link with ambiguous text",
      validate: (tag) => tag.includes('href="#"') || tag.trim() === "<a></a>",
    },
    {
      regex: /<input[^>]*>/g,
      message: "Input missing label",
      validate: (tag) => !documentText.includes("<label"),
    },
    {
      regex: /<html[^>]*>/g,
      message: "Missing language attribute",
      validate: (tag) => !tag.includes("lang="),
    },
    {
      regex: /<form[^>]*>/g,
      message: "Form with unpredictable behavior",
      validate: (tag) => tag.includes("onSubmit"),
    },
    {
      regex: /<input[^>]*>/g,
      message: "Form field missing error handling",
      validate: (tag) => !documentText.includes("<label"),
    },
    {
      regex: /<applet[^>]*>/g,
      message:
        "Applet element detected (deprecated and requires alternative text)",
      validate: (tag) => !documentText.includes("<p>"),
    },
    {
      regex: /role="[^"]*"/g,
      message: "Invalid ARIA role",
      validate: (tag) => {
        const validRoles = [
          "button",
          "navigation",
          "link",
          "dialog",
          "main",
          "alert",
          "form",
          "application",
          "checkbox",
          "radio",
          "slider",
          "textbox",
        ];
        const role = tag.match(/role="([^"]*)"/);
        return role && !validRoles.includes(role[1]);
      },
    },
  ];

  checks.forEach(({ regex, message, validate }) => {
    let match;
    while ((match = regex.exec(documentText)) !== null) {
      const tag = match[0];
      const content = match[1] || "";
      if (validate(tag, content)) {
        const start = document.positionAt(match.index);
        const end = document.positionAt(match.index + tag.length);
        issues.push({
          message,
          startLine: start.line,
          startChar: start.character,
          endLine: end.line,
          endChar: end.character,
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
